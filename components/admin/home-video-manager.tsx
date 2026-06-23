"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Play,
  Trash2,
} from "lucide-react";
import { buildYouTubeThumbnailUrl, extractYouTubeId } from "@/lib/youtube";
import type { HomepageVideoDisplayType } from "@/lib/homepage-video-storage";

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
  displayType?: HomepageVideoDisplayType;
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

function mapPersistedVideo(video: PersistedVideo): AdminHomepageVideo {
  return {
    id: String(video.id),
    title: video.title,
    youtubeUrl: video.youtubeUrl,
    isActive: video.isActive,
  };
}

function validateItems(items: AdminHomepageVideo[], label: string) {
  return items.map((item) => {
    const youtubeId = extractYouTubeId(item.youtubeUrl);
    if (!item.title.trim()) {
      throw new Error(`Mỗi ${label} cần có tiêu đề.`);
    }
    if (!youtubeId) {
      throw new Error(
        `Link YouTube không hợp lệ trong ${label}: ${item.youtubeUrl || "(trống)"}`,
      );
    }
    return {
      title: item.title.trim(),
      youtubeUrl: item.youtubeUrl.trim(),
      isActive: item.isActive,
    };
  });
}

type VideoListEditorProps = {
  title: string;
  description: string;
  emptyText: string;
  addLabel: string;
  previewRatio: "wide" | "short";
  items: AdminHomepageVideo[];
  onChange: (items: AdminHomepageVideo[]) => void;
};

function VideoListEditor({
  title,
  description,
  emptyText,
  addLabel,
  previewRatio,
  items,
  onChange,
}: VideoListEditorProps) {
  const updateItem = (id: string, patch: Partial<AdminHomepageVideo>) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => onChange([...items, createEmptyVideo()]);
  const removeItem = (id: string) =>
    onChange(items.filter((item) => item.id !== id));
  const moveItem = (id: string, direction: "up" | "down") => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <Button type="button" onClick={addItem} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      ) : (
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
                  <div className="flex min-h-[180px] items-center justify-center bg-slate-100 p-4">
                    <div
                      className={`relative overflow-hidden rounded-xl bg-slate-200 ${
                        previewRatio === "short"
                          ? "aspect-[9/16] h-[220px]"
                          : "aspect-video w-full"
                      }`}
                    >
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
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Video #{index + 1}
                        </p>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {item.title || "Chưa đặt tiêu đề"}
                        </h4>
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
                          onChange={(event) =>
                            updateItem(item.id, { title: event.target.value })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Ví dụ: Thi công phòng khách cao cấp"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">
                          Link YouTube
                        </label>
                        <input
                          type="url"
                          value={item.youtubeUrl}
                          onChange={(event) =>
                            updateItem(item.id, {
                              youtubeUrl: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="https://www.youtube.com/watch?v=... hoặc /shorts/..."
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Hiển thị video
                        </p>
                        <p className="text-xs text-slate-500">
                          Tắt để ẩn video này khỏi trang chủ
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
      )}
    </section>
  );
}

export function HomeVideoManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [items, setItems] = useState<AdminHomepageVideo[]>([]);
  const [shortItems, setShortItems] = useState<AdminHomepageVideo[]>([]);

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
          payload.data
            .filter((video) => (video.displayType ?? "standard") === "standard")
            .map(mapPersistedVideo),
        );
        setShortItems(
          payload.data
            .filter((video) => video.displayType === "short")
            .map(mapPersistedVideo),
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
  const orderedShortItems = useMemo(() => shortItems, [shortItems]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const cleaned = validateItems(orderedItems, "video YouTube");
      const cleanedShorts = validateItems(orderedShortItems, "short video");

      const response = await fetch("/api/video-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cleaned,
          shortItems: cleanedShorts,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu video");
      }

      setSuccess("Đã lưu danh sách video trang chủ thành công.");
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
          Quản lý video trang chủ
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý video YouTube ngang và Short Video dọc trong cùng một trang.
          Sau khi lưu, trang chủ sẽ được revalidate tự động.
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

      <VideoListEditor
        title="Video YouTube"
        description="Các video ngang đang hiển thị trong section HEI Channel."
        emptyText="Chưa có video YouTube nào."
        addLabel="Thêm video"
        previewRatio="wide"
        items={orderedItems}
        onChange={setItems}
      />

      <VideoListEditor
        title="Short Video"
        description="Các video dọc hiển thị trong section Short Video trên trang chủ."
        emptyText="Chưa có Short Video nào."
        addLabel="Thêm Short Video"
        previewRatio="short"
        items={orderedShortItems}
        onChange={setShortItems}
      />

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 px-6 shadow-lg hover:bg-amber-700"
        >
          {saving ? "Đang lưu..." : "Lưu danh sách video"}
        </Button>
      </div>
    </div>
  );
}
