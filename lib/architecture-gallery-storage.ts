import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";
import {
  ARCHITECTURE_GALLERY_SLOTS,
  getExpectedOrientation,
  isValidArchitectureSlotCount,
  type GalleryOrientation,
} from "@/lib/architecture-gallery";

export type ArchitectureGalleryItem = {
  id: number;
  styleId: number;
  styleName: string;
  styleSlug: string;
  projectId: number;
  projectSlug: string;
  projectTitle: string;
  slotIndex: number;
  orientation: GalleryOrientation;
  imageUrl: string;
  imageAlt: string;
};

export type ArchitectureGalleryInput = {
  slotIndex: number;
  projectId: number;
  imageUrl: string;
  imageAlt?: string;
};

export type ProjectLinkOption = {
  id: number;
  title: string;
  slug: string;
};

type GalleryRow = {
  id: number;
  style_id: number;
  style_name: string;
  project_id: number;
  project_slug: string;
  project_title: string;
  slot_index: number;
  orientation: GalleryOrientation;
  image_url: string;
  image_alt: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value: string) {
  return normalizeText(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapRow(row: GalleryRow): ArchitectureGalleryItem {
  return {
    id: Number(row.id),
    styleId: Number(row.style_id),
    styleName: row.style_name,
    styleSlug: slugify(row.style_name),
    projectId: Number(row.project_id),
    projectSlug: row.project_slug,
    projectTitle: row.project_title,
    slotIndex: Number(row.slot_index),
    orientation: row.orientation,
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
  };
}

export async function readArchitectureGallery(): Promise<
  ArchitectureGalleryItem[]
> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<GalleryRow>(
    `
      SELECT
        agi.id,
        agi.style_id,
        ps.name AS style_name,
        agi.project_id,
        p.slug AS project_slug,
        p.title AS project_title,
        agi.slot_index,
        agi.orientation,
        agi.image_url,
        agi.image_alt
      FROM architecture_gallery_items agi
      JOIN project_styles ps ON ps.id = agi.style_id
      JOIN projects p ON p.id = agi.project_id
      ORDER BY agi.style_id ASC, agi.slot_index ASC
    `,
  );

  return result.rows.map((row) => ({
    ...mapRow(row),
  }));
}

export async function readProjectLinkOptions(): Promise<ProjectLinkOption[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; title: string; slug: string }>(
    `
      SELECT id, title, slug
      FROM projects
      ORDER BY updated_at DESC, id DESC
    `,
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
  }));
}

export async function saveArchitectureGalleryForStyle(
  styleId: number,
  entries: ArchitectureGalleryInput[],
): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();

  if (!isValidArchitectureSlotCount(entries.length)) {
    throw new Error(
      `Cần đúng ${ARCHITECTURE_GALLERY_SLOTS.length} ảnh theo template ngang/dọc/vuông cố định.`,
    );
  }

  const uniqueSlots = new Set(entries.map((item) => item.slotIndex));
  if (uniqueSlots.size !== ARCHITECTURE_GALLERY_SLOTS.length) {
    throw new Error("Danh sách ảnh có slot bị thiếu hoặc bị trùng.");
  }

  for (const item of entries) {
    const expected = getExpectedOrientation(item.slotIndex);
    if (!expected) {
      throw new Error(`Slot không hợp lệ: ${item.slotIndex}`);
    }
    if (!item.imageUrl?.trim()) {
      throw new Error(`Slot ${item.slotIndex} chưa có URL ảnh.`);
    }
    if (!Number(item.projectId)) {
      throw new Error(`Slot ${item.slotIndex} chưa chọn link dự án.`);
    }
  }

  await pool.query("BEGIN");
  try {
    await pool.query(
      "DELETE FROM architecture_gallery_items WHERE style_id = $1",
      [styleId],
    );

    for (const item of entries) {
      const orientation = getExpectedOrientation(item.slotIndex);
      await pool.query(
        `
          INSERT INTO architecture_gallery_items (
            style_id,
            project_id,
            slot_index,
            orientation,
            image_url,
            image_alt
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          styleId,
          item.projectId,
          item.slotIndex,
          orientation,
          item.imageUrl.trim(),
          item.imageAlt?.trim() || "",
        ],
      );
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}
