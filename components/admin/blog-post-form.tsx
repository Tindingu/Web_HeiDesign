"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { BlogPostRecord } from "@/lib/blog-post-storage";

const BLOG_CATEGORIES = [
  "Xu hướng thiết kế",
  "Kinh nghiệm thi công",
  "Phong thủy nội thất",
  "Mẹo tối ưu không gian",
  "Báo giá và chi phí",
];

type UploadMode = "word" | "markdown";

type FormData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
  content: string;
  publishedAt: string;
};

const initialFormData: FormData = {
  slug: "",
  title: "",
  excerpt: "",
  category: BLOG_CATEGORIES[0],
  coverImageUrl: "",
  content: "",
  publishedAt: new Date().toISOString(),
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdownFrontmatter(markdown: string) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) return normalized.trim();

  const endIndex = normalized.indexOf("\n---", 3);
  if (endIndex === -1) return normalized.trim();

  return normalized.slice(endIndex + 4).trimStart();
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

    result[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }

  return result;
}

function firstHeading(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "";
}

function firstParagraph(markdown: string) {
  return (
    stripMarkdownFrontmatter(markdown)
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find(
        (block) =>
          block &&
          !block.startsWith("#") &&
          !block.startsWith("!") &&
          !block.startsWith("<"),
      ) || ""
  );
}

function firstMarkdownImage(markdown: string) {
  return markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/)?.[1];
}

export function BlogPostForm({ post }: { post?: BlogPostRecord }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(
    post
      ? {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          coverImageUrl: post.coverImage.url,
          content: post.content,
          publishedAt: post.publishedAt,
        }
      : initialFormData,
  );
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [markdownFile, setMarkdownFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>(
    post?.rendererVersion === "v2" ? "markdown" : "word",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<string[]>(BLOG_CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/taxonomies", { cache: "no-store" });
        const payload = await response.json();
        if (!response.ok || !payload?.ok) return;
        const names = (payload?.data?.blogCategories || [])
          .map((item: { name: string }) => item.name)
          .filter(Boolean);

        if (names.length > 0) {
          setCategories(names);
          setFormData((prev) => ({
            ...prev,
            category: prev.category || names[0],
          }));
        }
      } catch {
        // Keep fallback categories.
      }
    };

    void loadCategories();
  }, []);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => {
      const next = { ...prev, title: value };
      if (!post || !prev.slug) {
        next.slug = toSlug(value);
      }
      return next;
    });
  };

  const convertWordFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      throw new Error("Vui lòng chọn file .docx");
    }

    const body = new FormData();
    body.append("file", file);
    body.append("autoCreate", "false");

    const response = await fetch("/api/convert-word", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "Không thể chuyển đổi file Word");
    }

    const data = await response.json();
    return String(data.markdown || "");
  }, []);

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
      const title = metadata.title || firstHeading(rawMarkdown);
      const excerpt =
        metadata.seoDescription || metadata.description || firstParagraph(rawMarkdown);
      const coverImage = metadata.coverImage || firstMarkdownImage(rawMarkdown);

      setFormData((prev) => ({
        ...prev,
        title: title || prev.title,
        slug: !post && title ? toSlug(title) : prev.slug,
        excerpt: excerpt || prev.excerpt,
        coverImageUrl:
          coverImage && /^https?:\/\//i.test(coverImage)
            ? coverImage
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

      try {
        if (!formData.title.trim()) throw new Error("Vui lòng nhập tiêu đề");
        if (!formData.slug.trim()) throw new Error("Slug không hợp lệ");
        if (!formData.excerpt.trim()) {
          throw new Error("Vui lòng nhập mô tả ngắn");
        }
        if (!formData.category.trim()) {
          throw new Error("Vui lòng chọn thể loại");
        }

        let content = formData.content;

        if (uploadMode === "markdown") {
          if (markdownFile) {
            content = stripMarkdownFrontmatter(await markdownFile.text());
          } else if (!post) {
            throw new Error("Vui lòng chọn file Markdown .md để đăng bài");
          }
        } else if (wordFile) {
          content = await convertWordFile(wordFile);
        } else if (!post) {
          throw new Error("Vui lòng chọn file Word để đăng bài");
        }

        if (!content.trim()) {
          throw new Error("Nội dung bài viết đang trống");
        }

        const method = post ? "PUT" : "POST";
        const url = post ? `/api/blog-posts?id=${post.id}` : "/api/blog-posts";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            slug: toSlug(formData.slug),
            content,
            rendererVersion: uploadMode === "markdown" ? "v2" : "legacy",
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Lưu bài viết thất bại");
        }

        router.push("/admin/kinh-nghiem");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      post,
      router,
      wordFile,
      markdownFile,
      uploadMode,
      convertWordFile,
    ],
  );

  return (
    <Container className="py-12">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            {post ? "Sửa Bài Kinh Nghiệm" : "Tạo Bài Kinh Nghiệm"}
          </h1>
          <Link href="/admin/kinh-nghiem">
            <Button variant="outline">← Quay lại</Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-gray-200 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Tiêu đề *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: toSlug(e.target.value),
                }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Mô tả ngắn *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Thể loại *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Link
              href="/admin/categories"
              className="mt-2 inline-block text-xs text-amber-700 hover:underline"
            >
              Quản lý category blog
            </Link>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              URL ảnh bìa
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900">
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
                <span className="block font-semibold">1 file Word</span>
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
                <span className="text-xs">Dùng renderer MD mới, không ảnh hưởng bài cũ</span>
              </button>
            </div>
          </div>

          {uploadMode === "word" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                File Word bài viết {!post && "*"}
              </label>
              <div className="relative rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-6 py-4">
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => setWordFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {wordFile?.name || "Chọn file Word .docx"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {post
                        ? "Để trống nếu muốn giữ nội dung cũ"
                        : "Tệp Word sẽ được convert sang Markdown như luồng cũ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                File Markdown bài viết {!post && "*"}
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
                Nếu file có frontmatter, hệ thống sẽ tự bỏ metadata khi lưu nội
                dung. Các trường title, excerpt, coverImage sẽ được lấy để gợi ý
                điền form nếu có.
              </p>
            </div>
          )}

          {post?.content ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Bài viết đang có nội dung đã lưu. Bạn có thể upload file mới để
              ghi đè nội dung hiện tại.
            </div>
          ) : null}

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {loading
              ? "Đang xử lý..."
              : post
                ? "Cập nhật bài viết"
                : uploadMode === "markdown"
                  ? "Đăng bài từ Markdown"
                  : "Đăng bài từ Word"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
