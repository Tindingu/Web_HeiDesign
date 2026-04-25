import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";
import { buildYouTubeThumbnailUrl, extractYouTubeId } from "@/lib/youtube";

export type HomepageVideoItem = {
  id: number;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomepageVideoInput = {
  title: string;
  youtubeUrl: string;
  sortOrder?: number;
  isActive?: boolean;
};

type HomepageVideoRow = {
  id: number;
  title: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string;
  sort_order: number;
  is_active: boolean;
};

async function ensureHomepageVideosTable() {
  const pool = getDbPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS homepage_videos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      youtube_url TEXT NOT NULL,
      youtube_id TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE homepage_videos DROP COLUMN IF EXISTS description;

    CREATE INDEX IF NOT EXISTS idx_homepage_videos_sort_order ON homepage_videos(sort_order, id);
    CREATE INDEX IF NOT EXISTS idx_homepage_videos_is_active ON homepage_videos(is_active);
  `);
}

function mapRow(row: HomepageVideoRow): HomepageVideoItem {
  return {
    id: Number(row.id),
    title: row.title,
    youtubeUrl: row.youtube_url,
    youtubeId: row.youtube_id,
    thumbnailUrl: row.thumbnail_url,
    sortOrder: Number(row.sort_order),
    isActive: Boolean(row.is_active),
  };
}

function normalizeItem(
  item: HomepageVideoInput,
  sortOrder: number,
): HomepageVideoInput & {
  youtubeId: string;
  thumbnailUrl: string;
} {
  const youtubeId = extractYouTubeId(item.youtubeUrl);
  if (!youtubeId) {
    throw new Error(`Không nhận ra video YouTube từ link: ${item.youtubeUrl}`);
  }

  return {
    title: item.title.trim(),
    youtubeUrl: item.youtubeUrl.trim(),
    sortOrder,
    isActive: item.isActive ?? true,
    youtubeId,
    thumbnailUrl: buildYouTubeThumbnailUrl(youtubeId),
  };
}

export async function readHomepageVideos(): Promise<HomepageVideoItem[]> {
  await ensureDbSchema();
  await ensureHomepageVideosTable();
  const pool = getDbPool();
  const result = await pool.query<HomepageVideoRow>(
    `
      SELECT
        id,
        title,
        youtube_url,
        youtube_id,
        thumbnail_url,
        sort_order,
        is_active
      FROM homepage_videos
      ORDER BY sort_order ASC, id ASC
    `,
  );

  return result.rows.map(mapRow);
}

export async function readActiveHomepageVideos(): Promise<HomepageVideoItem[]> {
  const videos = await readHomepageVideos();
  return videos.filter((video) => video.isActive);
}

export async function saveHomepageVideos(
  items: HomepageVideoInput[],
): Promise<void> {
  await ensureDbSchema();
  await ensureHomepageVideosTable();
  const pool = getDbPool();

  if (items.length === 0) {
    throw new Error("Cần ít nhất 1 video để hiển thị trên trang chủ.");
  }

  const normalized = items.map((item, index) =>
    normalizeItem(item, item.sortOrder ?? index),
  );
  const activeCount = normalized.filter((item) => item.isActive).length;
  if (activeCount === 0) {
    throw new Error("Ít nhất 1 video phải được bật để hiển thị.");
  }

  await pool.query("BEGIN");
  try {
    await pool.query("DELETE FROM homepage_videos");

    for (let index = 0; index < normalized.length; index += 1) {
      const item = normalized[index];
      await pool.query(
        `
          INSERT INTO homepage_videos (
            title,
            youtube_url,
            youtube_id,
            thumbnail_url,
            sort_order,
            is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          item.title,
          item.youtubeUrl,
          item.youtubeId,
          item.thumbnailUrl,
          index,
          item.isActive ?? true,
        ],
      );
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}
