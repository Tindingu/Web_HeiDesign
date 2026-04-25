"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  RefreshCw,
  Play,
} from "lucide-react";
import { buildYouTubeThumbnailUrl, extractYouTubeId } from "@/lib/youtube";

export type AdminHomepageVideo = {
  id: string;
  title: string;
  youtubeUrl: string;
  isActive: boolean;
};

type PersistedVideo = {
  id: number;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl: string;
  sortOrder: number;
  isActive: boolean;
};

type ApiResponse = {
  ok: boolean;
  data?: PersistedVideo[];
  error?: string;
};

function createEmptyVideo(): AdminHomepageVideo {
  return {
    id: crypto.randomUUID(),
    title: "",
    youtubeUrl: "",
    isActive: true,
  };
}

export function HomeVideoManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState<AdminHomepageVideo[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/video-section", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiResponse;
        if (!response.ok || !payload.ok || !Array.isArray(payload.data)) {
          throw new Error(payload.error || "Không thể tải danh sách video");
        }

        setItems(
          payload.data.map((video) => ({
            id: String(video.id),
            title: video.title,
            youtubeUrl: video.youtubeUrl,
            isActive: video.isActive,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Không thể tải danh sách video",
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const orderedItems = useMemo(() => items, [items]);

  const updateItem = (id: string, patch: Partial<AdminHomepageVideo>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => setItems((current) => [...current, createEmptyVideo()]);
  const removeItem = (id: string) =>
    setItems((current) => current.filter((item) => item.id !== id));
  const moveItem = (id: string, direction: "up" | "down") => {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index < 0) return current;
      const next = [...current];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const cleaned = orderedItems.map((item) => {
        const youtubeId = extractYouTubeId(item.youtubeUrl);
        if (!item.title.trim()) {
          throw new Error("Mỗi video cần có tiêu đề.");
        }
        if (!youtubeId) {
          throw new Error(
            `Link YouTube không hợp lệ: ${item.youtubeUrl || "(trống)"}`,
          );
        }
        return {
          title: item.title.trim(),
          youtubeUrl: item.youtubeUrl.trim(),
          isActive: item.isActive,
        };
      });

      const response = await fetch("/api/video-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cleaned }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu video");
      }

      setSuccess("Đã lưu playlist video thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu video");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <RefreshCw className="h-4 w-4 animate-spin" />
        Đang tải video...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Trang chủ
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Quản lý video Hometalk style
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Thêm nhiều link YouTube, sắp xếp thứ tự và bật/tắt từng video. Video ở
          trên sẽ đổi theo video bạn chọn từ carousel bên dưới.
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
        {items.map((item, index) => {
          const videoId = extractYouTubeId(item.youtubeUrl);
          const preview = videoId ? buildYouTubeThumbnailUrl(videoId) : "";
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
                <div className="relative min-h-[170px] bg-slate-100">
                  {preview ? (
                    <img
                      src={preview}
                      alt={item.title || "Video preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      Chưa có preview
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm">
                      <Play className="ml-0.5 h-4 w-4" fill="white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Video #{index + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.title || "Chưa đặt tiêu đề"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, "up")}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        aria-label="Đưa video lên"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, "down")}
                        className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        aria-label="Đưa video xuống"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                        aria-label="Xóa video"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, { title: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Ví dụ: Hometalk TV"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Link YouTube
                      </label>
                      <input
                        type="url"
                        value={item.youtubeUrl}
                        onChange={(e) =>
                          updateItem(item.id, { youtubeUrl: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Hiển thị video
                      </p>
                      <p className="text-xs text-slate-500">
                        Tắt để ẩn video này khỏi carousel
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateItem(item.id, { isActive: !item.isActive })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ${
                        item.isActive ? "bg-amber-500" : "bg-gray-300"
                      }`}
                      aria-checked={item.isActive}
                      role="switch"
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition duration-200 ${
                          item.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm video
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {saving ? "Đang lưu..." : "Lưu playlist video"}
        </Button>
      </div>
    </div>
  );
}
