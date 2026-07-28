"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectArticle } from "@/lib/article-storage";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import {
  buildTargetTypePath,
  CONSTRUCTION_TARGET_OPTIONS,
  DU_AN_TARGET_OPTIONS,
  INTERIOR_TARGET_OPTIONS,
  type ArticleTargetSection,
  type ArticleTargetType,
} from "@/lib/article-path";

type FormData = Omit<ProjectArticle, "id" | "createdAt" | "updatedAt">;
type UploadMode = "word" | "markdown";

const initialFormData: FormData = {
  targetSection: "thiet-ke-noi-that",
  targetType: "biet-thu",
  title: "",
  description: "",
  category: "biet-thu",
  coverImageUrl: "",
  introContent: "",
  mainContent: "",
  rendererVersion: "legacy",
};

function stripMarkdownFrontmatter(markdown: string) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) return normalized.trim();

  const endIndex = normalized.indexOf("\n---", 3);
  if (endIndex === -1) return normalized.trim();

  return normalized.slice(endIndex + 4).trimStart();
}

function splitMarkdownContent(markdown: string) {
  const content = stripMarkdownFrontmatter(markdown);
  const markerPattern = /^\s*<!--\s*MAIN_CONTENT\s*-->\s*$/im;
  const match = markerPattern.exec(content);

  if (!match || match.index < 0) {
    return {
      introContent: "",
      mainContent: content,
    };
  }

  return {
    introContent: content.slice(0, match.index).trim(),
    mainContent: content.slice(match.index + match[0].length).trim(),
  };
}

function parseMarkdownFrontmatter(markdown: string) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) return {};

  const endIndex = normalized.indexOf("\n---", 3);
  if (endIndex === -1) return {};

  const frontmatter = normalized.slice(3, endIndex);
  const result: Record<string, string> = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }

  return result;
}

export function ArticleForm({ article }: { article?: ProjectArticle }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(
    article || initialFormData,
  );
  const [introFile, setIntroFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>(
    article?.rendererVersion === "v2" ? "markdown" : "word",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sectionTypeMap, setSectionTypeMap] = useState<
    Record<string, Array<{ value: string; label: string }>>
  >({
    "thiet-ke-noi-that": [...INTERIOR_TARGET_OPTIONS],
    "thi-cong-noi-that": [...CONSTRUCTION_TARGET_OPTIONS],
    "du-an": [...DU_AN_TARGET_OPTIONS],
  });

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const response = await fetch("/api/article-targets", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.ok || !Array.isArray(payload.data)) {
          return;
        }

        const nextMap: Record<
          string,
          Array<{ value: string; label: string }>
        > = {
          "thiet-ke-noi-that": [],
          "thi-cong-noi-that": [],
          "du-an": [],
        };

        for (const section of payload.data) {
          if (!section?.code || !Array.isArray(section.types)) continue;
          nextMap[section.code] = section.types.map(
            (item: { code: string; name: string }) => ({
              value: item.code,
              label: item.name,
            }),
          );
        }

        if (nextMap["thiet-ke-noi-that"].length === 0) {
          nextMap["thiet-ke-noi-that"] = [...INTERIOR_TARGET_OPTIONS];
        }
        if (nextMap["thi-cong-noi-that"].length === 0) {
          nextMap["thi-cong-noi-that"] = [...CONSTRUCTION_TARGET_OPTIONS];
        }
        if (nextMap["du-an"].length === 0) {
          nextMap["du-an"] = [...DU_AN_TARGET_OPTIONS];
        }

        setSectionTypeMap(nextMap);
      } catch {
        // Keep fallback options.
      }
    };

    void loadTargets();
  }, []);

  const getSectionOptions = useCallback(
    (section: ArticleTargetSection) => {
      return (
        sectionTypeMap[section] ||
        (section === "thi-cong-noi-that"
          ? [...CONSTRUCTION_TARGET_OPTIONS]
          : section === "du-an"
            ? [...DU_AN_TARGET_OPTIONS]
            : [...INTERIOR_TARGET_OPTIONS])
      );
    },
    [sectionTypeMap],
  );

  const activeTypeOptions = useMemo(
    () =>
      getSectionOptions(
        (formData.targetSection as ArticleTargetSection) || "thiet-ke-noi-that",
      ),
    [formData.targetSection, getSectionOptions],
  );

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const convertWordFile = async (file: File, fieldLabel: string) => {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      throw new Error(`${fieldLabel} phải là file .docx`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("autoCreate", "false");

    const response = await fetch("/api/convert-word", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Không thể chuyển đổi ${fieldLabel}`);
    }

    const data = await response.json();
    return String(data.markdown || "");
  };

  const handleMarkdownFileChange = async (file: File | null) => {
    setMarkdownFile(file);
    setError("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".md")) {
      setError("Vui lòng chọn file Markdown .md");
      return;
    }

    try {
      const rawMarkdown = await file.text();
      const metadata = parseMarkdownFrontmatter(rawMarkdown);
      setFormData((prev) => ({
        ...prev,
        title: metadata.title || prev.title,
        description: metadata.excerpt || metadata.description || prev.description,
        coverImageUrl:
          metadata.coverImage && /^https?:\/\//i.test(metadata.coverImage)
            ? metadata.coverImage
            : prev.coverImageUrl,
      }));
    } catch {
      setError("Không thể đọc file Markdown");
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      setSuccessMessage("");

      // Validation
      if (!formData.title.trim()) {
        setError("Tiêu đề không được bỏ trống");
        setLoading(false);
        return;
      }

      if (!formData.targetSection?.trim()) {
        setError("Vui lòng chọn nhóm nội dung");
        setLoading(false);
        return;
      }

      if (!formData.targetType?.trim()) {
        setError("Vui lòng chọn danh mục bài viết");
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError("Mô tả không được bỏ trống");
        setLoading(false);
        return;
      }

      if (!formData.coverImageUrl.trim()) {
        setError("URL ảnh bìa không được bỏ trống");
        setLoading(false);
        return;
      }

      // Tạo mới bắt buộc phải upload đủ 2 file Word.
      if (!article && uploadMode === "word" && (!introFile || !mainFile)) {
        setError("Vui lòng chọn đủ 2 file Word (Giới thiệu và Nội dung chính)");
        setLoading(false);
        return;
      }

      try {
        if (uploadMode === "markdown" && !markdownFile && !article) {
          throw new Error("Vui lòng chọn file Markdown .md");
        }

        let introContent = formData.introContent;
        let mainContent = formData.mainContent;

        if (uploadMode === "markdown" && markdownFile) {
          const splitContent = splitMarkdownContent(await markdownFile.text());
          introContent = splitContent.introContent;
          mainContent = splitContent.mainContent;
        } else if (introFile) {
          introContent = await convertWordFile(introFile, "File Giới thiệu");
        }

        if (uploadMode === "word" && mainFile) {
          mainContent = await convertWordFile(mainFile, "File Nội dung chính");
        }

        if (!mainContent.trim()) {
          throw new Error(
            "Nội dung sau chuyển đổi đang trống, vui lòng kiểm tra file Word",
          );
        }

        const method = article ? "PUT" : "POST";
        const url = article
          ? `/api/articles?id=${article.id}`
          : "/api/articles";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            targetSection: formData.targetSection,
            targetType: formData.targetType,
            category: formData.targetType,
            introContent,
            mainContent,
            rendererVersion: uploadMode === "markdown" ? "v2" : "legacy",
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Lỗi khi lưu bài viết");
        }

        setSuccessMessage(
          article
            ? "Cập nhật bài viết thành công!"
            : "Tạo bài viết thành công!",
        );
        setIntroFile(null);
        setMainFile(null);
        setMarkdownFile(null);
        setTimeout(() => {
          router.push("/admin/du-an");
          router.refresh();
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
    [formData, article, introFile, mainFile, markdownFile, uploadMode, router],
  );

  return (
    <Container className="py-12">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            {article ? "Sửa Bài Viết" : "Tạo Bài Viết Mới"}
          </h1>
          <Link href="/admin/du-an">
            <Button variant="outline">← Quay lại</Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 p-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tiêu đề bài viết"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Target Section + Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Bài viết thuộc nhóm nào? *
            </label>
            <select
              value={formData.targetSection || "thiet-ke-noi-that"}
              onChange={(e) => {
                const targetSection = e.target.value as ArticleTargetSection;
                const firstType =
                  (getSectionOptions(targetSection)[0]
                    ?.value as ArticleTargetType) || "biet-thu";
                setFormData((prev) => ({
                  ...prev,
                  targetSection,
                  targetType: firstType,
                  category: firstType,
                }));
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="thiet-ke-noi-that">Thiết kế nội thất</option>
              <option value="thi-cong-noi-that">Thi công nội thất</option>
              <option value="du-an">Dự án</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Bài viết cho mục nào? *
            </label>
            <select
              value={formData.targetType || "biet-thu"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  targetType: e.target.value as ArticleTargetType,
                  category: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            >
              {activeTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Bài viết sẽ hiển thị tại:{" "}
              {buildTargetTypePath(
                (formData.targetSection as ArticleTargetSection) ||
                  "thiet-ke-noi-that",
                formData.targetType || "biet-thu",
              )}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mô tả *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Nhập mô tả bài viết"
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              URL Ảnh Bìa *
            </label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  coverImageUrl: e.target.value,
                }))
              }
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Chọn cách nhập nội dung *
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setUploadMode("word")}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  uploadMode === "word"
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-300"
                }`}
              >
                <span className="block font-semibold">2 file Word</span>
                <span className="text-xs">Convert .docx sang Markdown</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("markdown")}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  uploadMode === "markdown"
                    ? "border-amber-500 bg-amber-50 text-amber-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-300"
                }`}
              >
                <span className="block font-semibold">1 file Markdown</span>
                <span className="text-xs">Upload trực tiếp file .md</span>
              </button>
            </div>
          </div>

          {uploadMode === "word" ? (
            <>

          {/* Intro Word File */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              File Word 1: Tiêu đề & Giới thiệu {!article && "*"}
            </label>
            <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setIntroFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {introFile?.name || "Chọn file Word .docx"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {article
                      ? "Để trống nếu muốn giữ nội dung cũ"
                      : "Tệp này chứa phần tiêu đề và giới thiệu"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Word File */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              File Word 2: Nội dung chính {!article && "*"}
            </label>
            <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
              <input
                type="file"
                accept=".docx"
                onChange={(e) => setMainFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {mainFile?.name || "Chọn file Word .docx"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {article
                      ? "Để trống nếu muốn giữ nội dung cũ"
                      : "Tệp này chứa nội dung chính bài viết"}
                  </p>
                </div>
              </div>
            </div>
          </div>

            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                File Markdown: Nội dung bài viết {!article && "*"}
              </label>
              <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
                <input
                  type="file"
                  accept=".md,text/markdown,text/plain"
                  onChange={(e) =>
                    void handleMarkdownFileChange(e.target.files?.[0] ?? null)
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {markdownFile?.name || "Chọn file Markdown .md"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Upload trực tiếp nội dung Markdown, không cần convert Word
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Nếu file có frontmatter, hệ thống sẽ tự bỏ phần metadata khi lưu
                nội dung. Ảnh trong Markdown nên dùng URL public đầy đủ.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Thêm{" "}
                <code className="rounded bg-gray-100 px-1">
                  {"<!-- MAIN_CONTENT -->"}
                </code>{" "}
                để tách phần trên marker vào giới thiệu và phần dưới marker vào
                nội dung chính.
              </p>
            </div>
          )}

          {(formData.introContent || formData.mainContent) && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Bài viết đang có nội dung đã lưu. Bạn có thể upload file mới để
              ghi đè nội dung hiện tại.
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {loading ? "Đang lưu..." : article ? "Cập nhật" : "Tạo bài viết"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
