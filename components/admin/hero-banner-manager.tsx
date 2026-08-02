"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type ApiPayload = {
  ok: boolean;
  data?: { imageUrls: string[] } | null;
  error?: string;
};

async function parseApiResponse<T extends { ok: boolean; error?: string }>(
  response: Response,
): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {
      ok: false,
      error: `API trả về body rỗng (${response.status})`,
    } as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      ok: false,
      error: "API trả về dữ liệu không phải JSON hợp lệ",
    } as T;
  }
}

export function HeroBannerManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/hero-banner", {
          cache: "no-store",
        });
        const payload = await parseApiResponse<ApiPayload>(response);
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Không thể tải cấu hình");
        }
        if (payload.data) {
          setImageUrls(
            payload.data.imageUrls.length > 0 ? payload.data.imageUrls : [""],
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải cấu hình");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "HEI-design/hero-banners");

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await parseApiResponse<{
        ok: boolean;
        data?: { url: string };
        error?: string;
      }>(response);
      if (!response.ok || !result.ok || !result.data?.url) {
        throw new Error(result.error || "Upload failed");
      }
      const uploadedUrl = result.data.url;

      // Add to list
      setImageUrls((prev) => {
        const last = prev[prev.length - 1];
        if (last === "") {
          return [...prev.slice(0, -1), uploadedUrl];
        } else {
          return [...prev, uploadedUrl];
        }
      });

      setSuccess("Tải ảnh lên thành công!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải ảnh lên");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const handleAddUrl = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [""] : next;
    });
  };

  const handleSave = async () => {
    const filteredUrls = imageUrls.filter((u) => u.trim().length > 0);
    if (filteredUrls.length === 0) {
      setError("Vui lòng thêm ít nhất một ảnh banner");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/hero-banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          title: "Nội thất cao cấp",
          subtitle: "Thiết kế, thi công và hoàn thiện trọn gói",
          ctaPrimary: "Đặt lịch tư vấn",
          ctaSecondary: "Xem dự án",
          imageUrls: filteredUrls,
        }),
      });
      const payload = await parseApiResponse<ApiPayload>(response);
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu cấu hình");
      }
      setSuccess("Đã lưu banner hero cho trang chủ.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Trang chủ
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Quản lý banner hero
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cập nhật tiêu đề, mô tả, và ảnh hiển thị trên banner lớn trang chủ.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {/* Images */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Ảnh banner (tỉ lệ 16:9) -{" "}
              {imageUrls.filter((u) => u.trim().length > 0).length} ảnh
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Đang tải..." : "Upload ảnh"}
              </button>
              <button
                type="button"
                onClick={handleAddUrl}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm URL
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder={`https://... (ảnh ${index + 1})`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUrl(index)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {url.trim() && (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="relative w-full bg-slate-100 aspect-video">
                      <Image
                        src={url.trim()}
                        alt={`Banner ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {saving ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </div>
    </div>
  );
}
