import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type HomepageBanner = {
  id: number;
  imageUrl: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

type HomepageBannerRow = {
  id: number;
  image_url: string;
  alt: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

async function ensureHomepageBannersTable() {
  const pool = getDbPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS homepage_banners (
      id SERIAL PRIMARY KEY,
      image_url TEXT NOT NULL,
      alt TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_homepage_banners_sort_order ON homepage_banners(sort_order, id);
    CREATE INDEX IF NOT EXISTS idx_homepage_banners_is_active ON homepage_banners(is_active);
  `);
}

function mapRow(row: HomepageBannerRow): HomepageBanner {
  return {
    id: Number(row.id),
    imageUrl: row.image_url,
    alt: row.alt,
    sortOrder: Number(row.sort_order),
    isActive: Boolean(row.is_active),
    updatedAt: row.updated_at,
  };
}

export async function readHomepageBanners(): Promise<HomepageBanner[]> {
  await ensureDbSchema();
  await ensureHomepageBannersTable();
  const pool = getDbPool();
  const result = (await pool.query(
    `
      SELECT id, image_url, alt, sort_order, is_active, updated_at
      FROM homepage_banners
      ORDER BY sort_order ASC, id ASC
    `,
  )) as { rows: HomepageBannerRow[] };
  return result.rows.map(mapRow);
}

export async function readActiveHomepageBanners(): Promise<HomepageBanner[]> {
  const items = await readHomepageBanners();
  return items.filter((i) => i.isActive);
}

export async function saveHomepageBanners(
  entries: Array<{
    imageUrl: string;
    alt?: string;
    isActive?: boolean;
  }>,
): Promise<void> {
  await ensureDbSchema();
  await ensureHomepageBannersTable();
  const pool = getDbPool();

  if (!Array.isArray(entries)) throw new Error("Invalid entries");

  const normalized = entries.map((e, idx) => {
    const imageUrl = String(e.imageUrl || "").trim();
    const alt = String(e.alt || "").trim();
    const isActive = e.isActive ?? true;
    if (!imageUrl) throw new Error(`Banner #${idx + 1} missing imageUrl`);
    return { imageUrl, alt, isActive };
  });

  await pool.query("BEGIN");
  try {
    await pool.query("DELETE FROM homepage_banners");
    for (let i = 0; i < normalized.length; i += 1) {
      const item = normalized[i];
      await pool.query(
        `
          INSERT INTO homepage_banners (image_url, alt, sort_order, is_active)
          VALUES ($1, $2, $3, $4)
        `,
        [item.imageUrl, item.alt, i, item.isActive],
      );
    }
    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}

export async function clearHomepageBanners(): Promise<void> {
  await ensureDbSchema();
  await ensureHomepageBannersTable();
  const pool = getDbPool();
  await pool.query("DELETE FROM homepage_banners");
}
