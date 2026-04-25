"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type TopicOption = {
  label: string;
  slug: string;
};

type Settings = {
  topicSlug: string;
  topicLabel: string;
  bannerImageUrls: string[];
};

type ApiPayload = {
  ok: boolean;
  data?: {
    settings: Settings | null;
    availableTopics: TopicOption[];
  };
  error?: string;
};

export function HotBlogTopicManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [options, setOptions] = useState<TopicOption[]>([]);
  const [topicSlug, setTopicSlug] = useState("");
  const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([""]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/hot-blog-topic", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiPayload;
        if (!response.ok || !payload.ok || !payload.data) {
          throw new Error(payload.error || "Không thể tải cấu hình");
        }
        setOptions(payload.data.availableTopics);
        setTopicSlug(payload.data.settings?.topicSlug || "");
        const urls = payload.data.settings?.bannerImageUrls ?? [];
        setBannerImageUrls(urls.length > 0 ? urls : [""]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải cấu hình");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const selectedTopic = useMemo(
    () => options.find((item) => item.slug === topicSlug) || null,
    [options, topicSlug],
  );

  const handleUrlChange = (index: number, value: string) => {
    setBannerImageUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const handleAddUrl = () => {
    setBannerImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveUrl = (index: number) => {
    setBannerImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length === 0 ? [""] : next;
    });
  };

  const handleSave = async () => {
    if (!selectedTopic) {
      setError("Vui lòng chọn chủ đề.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const filteredUrls = bannerImageUrls.filter((u) => u.trim().length > 0);
      const response = await fetch("/api/hot-blog-topic", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicSlug: selectedTopic.slug,
          topicLabel: selectedTopic.label,
          bannerImageUrls: filteredUrls,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu cấu hình");
      }
      setSuccess("Đã lưu chủ đề hot cho trang chủ.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Bỏ cấu hình chủ đề hot?")) return;
    try {
      await fetch("/api/hot-blog-topic", { method: "DELETE" });
      setTopicSlug("");
      setBannerImageUrls([""]);
      setSuccess("Đã xóa cấu hình chủ đề hot.");
    } catch {
      setError("Không thể xóa cấu hình.");
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
          Quản lý chủ đề hot
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Chọn một chủ đề từ blog kinh nghiệm và thêm các ảnh banner (nhiều ảnh
          sẽ hiển thị liền nhau trên trang chủ).
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
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Chọn chủ đề hot
          </label>
          <select
            value={topicSlug}
            onChange={(e) => setTopicSlug(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">-- Chọn chủ đề --</option>
            {options.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Ảnh banner ({bannerImageUrls.filter((u) => u.trim()).length} ảnh)
            </label>
            <button
              type="button"
              onClick={handleAddUrl}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm ảnh
            </button>
          </div>

          <div className="space-y-3">
            {bannerImageUrls.map((url, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder={`https://... hoặc /upload/... (ảnh ${index + 1})`}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {bannerImageUrls.length > 1 && (
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
                    <div className="relative h-32 w-full bg-slate-100">
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

          {/* Preview all images side by side */}
          {bannerImageUrls.filter((u) => u.trim()).length > 1 && (
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-medium text-slate-500">
                Xem trước — ảnh hiển thị liền nhau trên trang chủ:
              </p>
              <div className="flex overflow-hidden rounded-lg border border-slate-200">
                {bannerImageUrls
                  .filter((u) => u.trim())
                  .map((url, i) => (
                    <div key={i} className="relative h-28 flex-1">
                      <Image
                        src={url}
                        alt={`Banner preview ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
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
          {topicSlug && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={saving}
            >
              Xóa cấu hình
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
