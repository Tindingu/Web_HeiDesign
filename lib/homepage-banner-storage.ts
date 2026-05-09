import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type HomepageBannerItem = {
  imageUrl: string;
  alt: string;
  isActive: boolean;
};

export type HomepageBannerSettings = {
  bannerItems: HomepageBannerItem[];
  updatedAt: string;
};

export async function readHomepageBanners(): Promise<HomepageBannerItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  try {
    const res = (await pool.query(
      `SELECT banner_items, updated_at FROM homepage_banners_config ORDER BY id DESC LIMIT 1`,
    )) as { rows: any[] };

    if (!res.rows[0]) return [];
    const row = res.rows[0];
    return Array.isArray(row.banner_items) ? row.banner_items : [];
  } catch (error) {
    console.warn("Error reading homepage banners from DB:", error);
    return [];
  }
}

export async function readActiveHomepageBanners(): Promise<HomepageBannerItem[]> {
  const items = await readHomepageBanners();
  return items.filter((i) => i.isActive);
}

export async function saveHomepageBanners(
  entries: Array<{
    imageUrl: string;
    alt?: string;
    isActive?: boolean;
  }>,
): Promise<HomepageBannerSettings> {
  await ensureDbSchema();
  const pool = getDbPool();
  await pool.query("BEGIN");
  try {
    const normalized: HomepageBannerItem[] = entries.map((e, idx) => {
      const imageUrl = String(e.imageUrl || "").trim();
      const alt = String(e.alt || "").trim();
      const isActive = e.isActive ?? true;
      if (!imageUrl) throw new Error(`Banner #${idx + 1} missing imageUrl`);
      return { imageUrl, alt, isActive };
    });

    // Delete existing and insert new (keep only 1 record)
    await pool.query("TRUNCATE TABLE homepage_banners_config RESTART IDENTITY");
    await pool.query(
      `INSERT INTO homepage_banners_config (banner_items, updated_at) VALUES ($1, $2)`,
      [normalized, new Date().toISOString()],
    );
    await pool.query("COMMIT");
    return { bannerItems: normalized, updatedAt: new Date().toISOString() };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function clearHomepageBanners(): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();
  await pool.query("TRUNCATE TABLE homepage_banners_config RESTART IDENTITY");
}
