"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type BannerItem = {
  imageUrl: string;
  alt?: string;
  isActive?: boolean;
};

async function parseApiResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return {
      ok: false,
      error: `API trả về body rỗng (${response.status})`,
    };
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "API trả về dữ liệu không phải JSON hợp lệ",
    };
  }
}

export function HomepageBannerManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState<BannerItem[]>([
    { imageUrl: "", alt: "", isActive: true },
  ]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/homepage-banners", { cache: "no-store" });
        const payload = await parseApiResponse(res);
        if (!res.ok || !payload.ok)
          throw new Error(payload.error || "Không thể tải banners");
        const data = Array.isArray(payload.data) ? payload.data : [];
        if (data.length === 0)
          setItems([{ imageUrl: "", alt: "", isActive: true }]);
        else
          setItems(
            data.map((d: any) => ({
              imageUrl: d.imageUrl || d.image_url || "",
              alt: d.alt || "",
              isActive: d.isActive ?? d.is_active ?? true,
            })),
          );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải banners");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const update = (index: number, patch: Partial<BannerItem>) => {
    setItems((cur) =>
      cur.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  };

  const add = () =>
    setItems((cur) => [...cur, { imageUrl: "", alt: "", isActive: true }]);
  const remove = (index: number) =>
    setItems((cur) => cur.filter((_, i) => i !== index));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const cleaned = items
        .map((it) => ({
          imageUrl: String(it.imageUrl || "").trim(),
          alt: String(it.alt || "").trim(),
          isActive: Boolean(it.isActive),
        }))
        .filter((it) => it.imageUrl.length > 0);
      if (cleaned.length === 0)
        throw new Error("Vui lòng thêm ít nhất 1 banner.");
      const res = await fetch("/api/homepage-banners", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ items: cleaned }),
      });
      const payload = await parseApiResponse(res);
      if (!res.ok || !payload.ok)
        throw new Error(payload.error || "Không thể lưu banners");
      setSuccess("Đã lưu banners.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu banners");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Xóa tất cả banners?")) return;
    try {
      const res = await fetch("/api/homepage-banners", {
        method: "DELETE",
        cache: "no-store",
      });
      const payload = await parseApiResponse(res);
      if (!res.ok || !payload.ok) {
        throw new Error(payload.error || "KhÃ´ng thá»ƒ xÃ³a banners.");
      }
      setItems([{ imageUrl: "", alt: "", isActive: true }]);
      setSuccess("Đã xóa banners.");
    } catch {
      setError("Không thể xóa banners.");
    }
  };

  if (loading)
    return <p className="text-sm text-slate-500">Đang tải banners...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Trang chủ
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Quản lý banner trang chủ
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Nhập URL ảnh (Cloudinary link) và mô tả alt. Hệ thống sẽ lưu URL để
          hiển thị trên trang chủ.
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

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">
                  URL ảnh (Cloudinary)
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={item.imageUrl}
                  onChange={(e) => update(idx, { imageUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                />

                <label className="block text-xs font-medium text-slate-600">
                  Alt text
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={item.alt}
                  onChange={(e) => update(idx, { alt: e.target.value })}
                  placeholder="Mô tả ngắn"
                />

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={!!item.isActive}
                    onChange={(e) =>
                      update(idx, { isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded"
                  />
                  Hiển thị banner này
                </label>
              </div>

              <div className="relative min-h-[120px] bg-slate-100 p-2">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.alt || `Banner ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm text-red-600"
                >
                  {" "}
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
                {idx === items.length - 1 && (
                  <button
                    type="button"
                    onClick={add}
                    className="inline-flex items-center gap-2 rounded-full border bg-amber-50 px-3 py-1 text-sm text-amber-700"
                  >
                    {" "}
                    <Plus className="h-4 w-4" /> Thêm
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {saving ? "Đang lưu..." : "Lưu banners"}
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}
