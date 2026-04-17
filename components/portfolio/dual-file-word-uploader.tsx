"use client";

import { useEffect, useMemo, useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  buildTargetTypePath,
  CONSTRUCTION_TARGET_OPTIONS,
  INTERIOR_TARGET_OPTIONS,
  type ArticleTargetSection,
  type ArticleTargetType,
} from "@/lib/article-path";

export function DualFileWordUploader() {
  const [introFile, setIntroFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [targetSection, setTargetSection] =
    useState<ArticleTargetSection>("thiet-ke-noi-that");
  const [targetType, setTargetType] = useState<ArticleTargetType>("biet-thu");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [newPageUrl, setNewPageUrl] = useState<string>("");
  const [sectionTypeMap, setSectionTypeMap] = useState<
    Record<string, Array<{ value: string; label: string }>>
  >({
    "thiet-ke-noi-that": [...INTERIOR_TARGET_OPTIONS],
    "thi-cong-noi-that": [...CONSTRUCTION_TARGET_OPTIONS],
  });

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const response = await fetch("/api/article-targets", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload?.ok || !Array.isArray(payload.data)) return;

        const nextMap: Record<string, Array<{ value: string; label: string }>> = {
          "thiet-ke-noi-that": [],
          "thi-cong-noi-that": [],
        };
        for (const section of payload.data) {
          if (!section?.code || !Array.isArray(section.types)) continue;
          nextMap[section.code] = section.types.map((item: { code: string; name: string }) => ({
            value: item.code,
            label: item.name,
          }));
        }
        if (nextMap["thiet-ke-noi-that"].length === 0) {
          nextMap["thiet-ke-noi-that"] = [...INTERIOR_TARGET_OPTIONS];
        }
        if (nextMap["thi-cong-noi-that"].length === 0) {
          nextMap["thi-cong-noi-that"] = [...CONSTRUCTION_TARGET_OPTIONS];
        }
        setSectionTypeMap(nextMap);
      } catch {
        // Keep fallback options.
      }
    };

    void loadTargets();
  }, []);

  const activeOptions = useMemo(() => {
    return (
      sectionTypeMap[targetSection] ||
      (targetSection === "thi-cong-noi-that"
        ? [...CONSTRUCTION_TARGET_OPTIONS]
        : [...INTERIOR_TARGET_OPTIONS])
    );
  }, [sectionTypeMap, targetSection]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleIntroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setIntroFile(selectedFile);
    }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setContentFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!introFile || !contentFile) {
      setStatus("error");
      setError("Vui lòng chọn cả hai file Word");
      return;
    }

    if (!title.trim()) {
      setStatus("error");
      setError("Vui lòng nhập tiêu đề");
      return;
    }

    if (!coverImage.trim()) {
      setStatus("error");
      setError("Vui lòng nhập URL ảnh bìa");
      return;
    }

    if (
      !introFile.name.endsWith(".docx") ||
      !contentFile.name.endsWith(".docx")
    ) {
      setStatus("error");
      setError("Vui lòng chọn file Word (.docx)");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setError("");
    setNewPageUrl("");

    try {
      // Convert intro file
      const introFormData = new FormData();
      introFormData.append("file", introFile);
      introFormData.append("autoCreate", "false");

      const introResponse = await fetch("/api/convert-word", {
        method: "POST",
        body: introFormData,
      });

      if (!introResponse.ok) throw new Error("Failed to convert intro file");

      const introData = await introResponse.json();
      const introMarkdown = introData.markdown || "";

      // Convert content file
      const contentFormData = new FormData();
      contentFormData.append("file", contentFile);
      contentFormData.append("autoCreate", "false");

      const contentResponse = await fetch("/api/convert-word", {
        method: "POST",
        body: contentFormData,
      });

      if (!contentResponse.ok)
        throw new Error("Failed to convert content file");

      const contentData = await contentResponse.json();
      const contentMarkdown = contentData.markdown || "";

      // Save article to database
      const articleResponse = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          targetSection,
          targetType,
          category: targetType,
          coverImageUrl: coverImage,
          introContent: introMarkdown,
          mainContent: contentMarkdown,
        }),
      });

      if (!articleResponse.ok) {
        throw new Error("Failed to save article");
      }

      const savedArticle = await articleResponse.json();

      setStatus("success");
      setNewPageUrl(buildTargetTypePath(targetSection, targetType));

      // Reset form
      setIntroFile(null);
      setContentFile(null);
      setTitle("");
      setDescription("");
      setCoverImage("");
      setTargetSection("thiet-ke-noi-that");
      setTargetType("biet-thu");

      // Clear file inputs
      const introInput = document.querySelector(
        "input[name='introFile']",
      ) as HTMLInputElement;
      const contentInput = document.querySelector(
        "input[name='contentFile']",
      ) as HTMLInputElement;
      if (introInput) introInput.value = "";
      if (contentInput) contentInput.value = "";
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi xử lý file",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-6">
      {/* Title Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Nhập tiêu đề bài viết"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Description Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Mô tả
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Nhập mô tả ngắn"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Target Section */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Bài viết thuộc nhóm nào? *
        </label>
        <select
          value={targetSection}
          onChange={(e) => {
            const section = e.target.value as ArticleTargetSection;
            setTargetSection(section);
            const options =
              sectionTypeMap[section] ||
              (section === "thi-cong-noi-that"
                ? [...CONSTRUCTION_TARGET_OPTIONS]
                : [...INTERIOR_TARGET_OPTIONS]);
            setTargetType((options[0]?.value as ArticleTargetType) || "biet-thu");
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="thiet-ke-noi-that">Thiết kế nội thất</option>
          <option value="thi-cong-noi-that">Thi công nội thất</option>
        </select>
      </div>

      {/* Target Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Bài viết cho mục nào? *
        </label>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as ArticleTargetType)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        >
          {activeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Ảnh bìa (URL)
        </label>
        <input
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Intro File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          File Word 1: Tiêu đề & Giới thiệu
        </label>
        <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
          <input
            type="file"
            name="introFile"
            accept=".docx"
            onChange={handleIntroFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {introFile?.name || "Chọn file Word"}
              </p>
              <p className="text-sm text-gray-600">
                Tệp này sẽ chứa tiêu đề và giới thiệu sơ lược
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          File Word 2: Nội dung chính
        </label>
        <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
          <input
            type="file"
            name="contentFile"
            accept=".docx"
            onChange={handleContentFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-gray-900">
                {contentFile?.name || "Chọn file Word"}
              </p>
              <p className="text-sm text-gray-600">
                Tệp này sẽ chứa nội dung chính bài viết
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Chuyển đổi & Tạo trang
          </>
        )}
      </button>

      {/* Status Messages */}
      {status === "success" && (
        <div className="flex items-start gap-3 rounded-lg border border-green-300 bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">Thành công!</p>
            <p className="text-sm text-green-700 mt-1">
              Bài viết đã được tạo và lưu thành công.
            </p>
            {newPageUrl && (
              <Link
                href={newPageUrl}
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-900"
              >
                Xem ngay trên trang loại hình →
              </Link>
            )}
          </div>
        </div>
      )}

      {status === "error" && error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">Lỗi</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </form>
  );
}
