"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

type AdminTestimonial = {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
  isActive: boolean;
};

type ApiResponse = {
  ok: boolean;
  data?: Array<{
    id: string;
    name: string;
    quote: string;
    imageUrl: string;
    isActive: boolean;
  }>;
  error?: string;
};

function createEmptyItem(): AdminTestimonial {
  return {
    id: crypto.randomUUID(),
    name: "",
    quote: "",
    imageUrl: "",
    isActive: true,
  };
}

export function CustomerTestimonialManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState<AdminTestimonial[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/homepage-testimonials", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiResponse;

        if (!response.ok || !payload.ok || !Array.isArray(payload.data)) {
          throw new Error(payload.error || "Không thể tải nhận xét khách hàng");
        }

        setItems(
          payload.data.map((item) => ({
            id: item.id,
            name: item.name,
            quote: item.quote,
            imageUrl: item.imageUrl,
            isActive: item.isActive,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải nhận xét khách hàng",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const orderedItems = useMemo(() => items, [items]);

  const updateItem = (id: string, patch: Partial<AdminTestimonial>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => setItems((current) => [...current, createEmptyItem()]);

  const removeItem = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));

  const moveItem = (id: string, direction: "up" | "down") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index < 0) return current;

      const next = [...current];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return current;

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const cleaned = orderedItems.map((item, index) => {
        if (!item.name.trim()) {
          throw new Error(`Nhận xét #${index + 1} chưa có tên khách hàng.`);
        }
        if (!item.quote.trim()) {
          throw new Error(`Nhận xét #${index + 1} chưa có nội dung.`);
        }
        if (!item.imageUrl.trim()) {
          throw new Error(`Nhận xét #${index + 1} chưa có hình.`);
        }

        return {
          name: item.name.trim(),
          quote: item.quote.trim(),
          imageUrl: item.imageUrl.trim(),
          isActive: item.isActive,
        };
      });

      const response = await fetch("/api/homepage-testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cleaned }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu nhận xét");
      }

      setSuccess("Đã lưu nhận xét khách hàng.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu nhận xét");
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
          Quản lý nhận xét khách hàng
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Thêm hình khách hàng, tên và nội dung nhận xét để hiển thị ở trang
          chủ.
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
        {orderedItems.map((item, index) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
              <div className="relative min-h-[170px] bg-slate-100">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.name || `Khách hàng #${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Nhận xét #{index + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {item.name || "Chưa có tên khách hàng"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, "up")}
                      className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      aria-label="Đưa nhận xét lên"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, "down")}
                      className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                      aria-label="Đưa nhận xét xuống"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                      aria-label="Xóa nhận xét"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, { name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Ví dụ: Chị Trang"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Link ảnh khách hàng
                    </label>
                    <input
                      type="url"
                      value={item.imageUrl}
                      onChange={(e) =>
                        updateItem(item.id, { imageUrl: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://... hoặc /upload/..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Nội dung nhận xét
                    </label>
                    <textarea
                      value={item.quote}
                      onChange={(e) =>
                        updateItem(item.id, { quote: e.target.value })
                      }
                      className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Nhập nội dung nhận xét..."
                    />
                  </div>

                  <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) =>
                        updateItem(item.id, { isActive: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Hiển thị nhận xét này trên trang chủ
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm nhận xét
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {saving ? "Đang lưu..." : "Lưu nhận xét"}
        </Button>
      </div>
    </div>
  );
}
