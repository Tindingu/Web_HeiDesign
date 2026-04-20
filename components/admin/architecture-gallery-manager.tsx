"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type StyleItem = { id: number; name: string };
type ProjectLinkItem = { id: number; title: string; slug: string };
type SlotTemplate = {
  slotIndex: number;
  orientation: "landscape" | "portrait" | "square";
};

type GalleryItem = {
  id: number;
  styleId: number;
  projectId: number;
  slotIndex: number;
  orientation: "landscape" | "portrait" | "square";
  imageUrl: string;
  imageAlt: string;
};

type DraftEntry = {
  slotIndex: number;
  orientation: "landscape" | "portrait" | "square";
  imageUrl: string;
  imageAlt: string;
  projectId: number;
};

type ApiResponse = {
  ok: boolean;
  data?: {
    styles: StyleItem[];
    projects: ProjectLinkItem[];
    slots: SlotTemplate[];
    grouped: Record<string, GalleryItem[]>;
  };
  error?: string;
};

function emptyDraft(slots: SlotTemplate[]): DraftEntry[] {
  return slots.map((slot) => ({
    slotIndex: slot.slotIndex,
    orientation: slot.orientation,
    imageUrl: "",
    imageAlt: "",
    projectId: 0,
  }));
}

export function ArchitectureGalleryManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [styles, setStyles] = useState<StyleItem[]>([]);
  const [projects, setProjects] = useState<ProjectLinkItem[]>([]);
  const [slots, setSlots] = useState<SlotTemplate[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<number>(0);
  const [draft, setDraft] = useState<Record<number, DraftEntry[]>>({});

  const selectedEntries = useMemo(() => {
    return draft[selectedStyleId] || emptyDraft(slots);
  }, [draft, selectedStyleId, slots]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/architecture-gallery", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ApiResponse;
        if (!response.ok || !payload.ok || !payload.data) {
          throw new Error(payload.error || "Không thể tải dữ liệu gallery");
        }

        setStyles(payload.data.styles || []);
        setProjects(payload.data.projects || []);
        setSlots(payload.data.slots || []);

        const nextDraft: Record<number, DraftEntry[]> = {};
        for (const style of payload.data.styles || []) {
          const currentItems = payload.data.grouped[String(style.id)] || [];
          const base = emptyDraft(payload.data.slots || []);
          for (const item of currentItems) {
            const idx = base.findIndex(
              (slot) => slot.slotIndex === item.slotIndex,
            );
            if (idx >= 0) {
              base[idx] = {
                slotIndex: item.slotIndex,
                orientation: item.orientation,
                imageUrl: item.imageUrl,
                imageAlt: item.imageAlt,
                projectId: item.projectId,
              };
            }
          }
          nextDraft[style.id] = base;
        }

        setDraft(nextDraft);
        if (payload.data.styles?.[0]?.id) {
          setSelectedStyleId(payload.data.styles[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const updateEntry = (
    slotIndex: number,
    patch: Partial<Pick<DraftEntry, "imageUrl" | "imageAlt" | "projectId">>,
  ) => {
    setDraft((prev) => {
      const current = prev[selectedStyleId] || emptyDraft(slots);
      const next = current.map((entry) =>
        entry.slotIndex === slotIndex ? { ...entry, ...patch } : entry,
      );
      return { ...prev, [selectedStyleId]: next };
    });
  };

  const validate = () => {
    if (!selectedStyleId) {
      throw new Error("Vui lòng chọn style kiến trúc.");
    }
    if (!selectedEntries.length) {
      throw new Error("Chưa có template slot.");
    }

    for (const entry of selectedEntries) {
      if (!entry.imageUrl.trim()) {
        throw new Error(
          `Slot #${entry.slotIndex} (${entry.orientation}) chưa có URL ảnh.`,
        );
      }
      if (!entry.projectId) {
        throw new Error(`Slot #${entry.slotIndex} chưa chọn link dự án.`);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      validate();

      const response = await fetch("/api/architecture-gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          styleId: selectedStyleId,
          entries: selectedEntries.map((entry) => ({
            slotIndex: entry.slotIndex,
            projectId: entry.projectId,
            imageUrl: entry.imageUrl,
            imageAlt: entry.imageAlt,
          })),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Không thể lưu gallery");
      }

      setSuccess("Đã lưu gallery thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-600">Đang tải cấu hình gallery...</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Architecture Masonry
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Quản lý ảnh Kiến trúc nhà phố
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Template cố định {slots.length || 12} slot ngang/dọc/vuông. Mỗi slot
          bắt buộc có ảnh và link dự án để layout luôn khít như mẫu.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Style
        </label>
        <select
          value={selectedStyleId || ""}
          onChange={(e) => setSelectedStyleId(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
        >
          {styles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
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

      <div className="grid gap-4 md:grid-cols-2">
        {selectedEntries.map((entry) => (
          <div
            key={entry.slotIndex}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                Slot #{entry.slotIndex}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  entry.orientation === "landscape"
                    ? "bg-sky-100 text-sky-700"
                    : entry.orientation === "portrait"
                      ? "bg-fuchsia-100 text-fuchsia-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {entry.orientation === "landscape"
                  ? "Ngang"
                  : entry.orientation === "portrait"
                    ? "Dọc"
                    : "Vuông"}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  URL ảnh
                </label>
                <input
                  type="url"
                  value={entry.imageUrl}
                  onChange={(e) =>
                    updateEntry(entry.slotIndex, { imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Alt ảnh
                </label>
                <input
                  type="text"
                  value={entry.imageAlt}
                  onChange={(e) =>
                    updateEntry(entry.slotIndex, { imageAlt: e.target.value })
                  }
                  placeholder="Mô tả ảnh"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Link dự án
                </label>
                <select
                  value={entry.projectId || ""}
                  onChange={(e) =>
                    updateEntry(entry.slotIndex, {
                      projectId: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Chọn dự án --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {saving ? "Đang lưu..." : "Lưu cấu hình gallery"}
        </Button>
      </div>
    </div>
  );
}
