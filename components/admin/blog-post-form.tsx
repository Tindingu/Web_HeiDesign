"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { BlogPostRecord } from "@/lib/blog-post-storage";

const BLOG_CATEGORIES = [
  "Xu hướng thiết kế",
  "Kinh nghiệm thi công",
  "Vật liệu nội thất",
  "Phong thủy nội thất",
  "Mẹo tối ưu không gian",
  "Báo giá và chi phí",
];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      throw new Error("Không thể chuyển đổi file Word");
    }

    const data = await response.json();
    return String(data.markdown || "");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        if (!formData.title.trim()) throw new Error("Vui lòng nhập tiêu đề");
        if (!formData.slug.trim()) throw new Error("Slug không hợp lệ");
        if (!formData.excerpt.trim())
          throw new Error("Vui lòng nhập mô tả ngắn");
        if (!formData.category.trim())
          throw new Error("Vui lòng chọn thể loại");

        let content = formData.content;

        if (wordFile) {
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
    [formData, post, router, wordFile, convertWordFile],
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Thể loại *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
            >
              {BLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
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
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              File Word bài viết {!post && "*"}
            </label>
            <input
              type="file"
              accept=".docx"
              onChange={(e) => setWordFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
            />
            {post && (
              <p className="mt-2 text-xs text-gray-500">
                Không chọn file nếu muốn giữ nguyên nội dung hiện tại.
              </p>
            )}
          </div>

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
                : "Đăng bài từ Word"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
