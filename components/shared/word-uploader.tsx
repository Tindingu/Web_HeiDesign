"use client";

import { useState } from "react";
import {
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export function WordUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [newPageUrl, setNewPageUrl] = useState<string>("");

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    // Auto-generate slug if user hasn't manually changed it
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus("error");
      setError("Vui lòng chọn file Word");
      return;
    }

    if (!title.trim()) {
      setStatus("error");
      setError("Vui lòng nhập tiêu đề dịch vụ");
      return;
    }

    if (!slug.trim()) {
      setStatus("error");
      setError("Vui lòng nhập slug URL");
      return;
    }

    if (!file.name.endsWith(".docx")) {
      setStatus("error");
      setError("Vui lòng chọn file Word (.docx)");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setError("");
    setNewPageUrl("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description || "Dịch vụ từ ICEP Design");
      formData.append("slug", slug);
      formData.append(
        "coverImage",
        coverImage ||
          "https://res.cloudinary.com/dfazfoh2l/image/upload/v1771992147/vila_tld4bi.webp",
      );
      formData.append("autoCreate", "true");
      formData.append("overwrite", "true");

      const response = await fetch("/api/convert-word", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi chuyển đổi file");
      }

      const data = await response.json();
      setMarkdown(data.markdown);

      if (data.autoCreated && data.newPageUrl) {
        setNewPageUrl(data.newPageUrl);
        setStatus("success");
      } else {
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Lỗi chuyển đổi file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpload} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tiêu Đề Dịch Vụ <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Ví dụ: Thiết Kế Nội Thất Nhà Ở"
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô Tả Ngắn
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả ngắn dịch vụ (tùy chọn)"
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Slug <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">/dich-vu/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="thiet-ke-nha-o"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tự động tạo từ tiêu đề, bạn có thể chỉnh sửa
          </p>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Ảnh Bìa
          </label>
          <input
            type="url"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 disabled:bg-gray-100"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            File Word (.docx) <span className="text-red-600">*</span>
          </label>
          <label className="block cursor-pointer">
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              disabled={isLoading}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-amber-600 bg-white px-6 py-4 hover:bg-amber-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  <span className="font-semibold text-gray-700">
                    Đang xử lý...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-amber-600" />
                  <div className="text-left">
                    <span className="font-semibold text-gray-700 block">
                      {file ? file.name : "Chọn file Word (.docx)"}
                    </span>
                    {file && (
                      <span className="text-xs text-gray-500">
                        Sẵn sàng tải lên
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Tạo Trang Dịch Vụ"
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && newPageUrl && (
        <div className="rounded-lg bg-green-50 p-4 border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900">
                Tạo trang thành công!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Trang dịch vụ mới đã được tạo và sẵn sàng xem
              </p>
              <div className="mt-3 flex gap-2">
                <Link
                  href={newPageUrl}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 transition-colors"
                >
                  Xem Trang Mới
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setFile(null);
                    setTitle("");
                    setDescription("");
                    setSlug("");
                    setCoverImage("");
                    setMarkdown("");
                    setNewPageUrl("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 transition-colors"
                >
                  Tạo Trang Khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === "success" && !newPageUrl && (
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">
                Chuyển đổi thành công!
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Sao chép nội dung Markdown bên dưới
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Lỗi</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Markdown Output */}
      {markdown && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Markdown Content:
            </label>
            <textarea
              value={markdown}
              readOnly
              rows={10}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-700"
            />
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(markdown);
              alert("Đã sao chép vào clipboard!");
            }}
            className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 transition-colors"
          >
            Sao Chép Markdown
          </button>
        </div>
      )}
    </div>
  );
}
