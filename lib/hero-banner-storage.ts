import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type HeroBannerSettings = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageUrls: string[];
  updatedAt: string;
};

export async function readHeroBannerSettings(): Promise<HeroBannerSettings | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  try {
    const res = (await pool.query(
      `SELECT title, subtitle, cta_primary, cta_secondary, image_urls, updated_at FROM homepage_hero_banners ORDER BY id DESC LIMIT 1`,
    )) as { rows: any[] };

    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      title: row.title || "",
      subtitle: row.subtitle || "",
      ctaPrimary: row.cta_primary || "Đặt lịch tư vấn",
      ctaSecondary: row.cta_secondary || "Xem dự án",
      imageUrls: Array.isArray(row.image_urls) ? row.image_urls : [],
      updatedAt: row.updated_at
        ? new Date(row.updated_at).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Error reading hero banner from DB:", error);
    return null;
  }
}

export async function saveHeroBannerSettings(
  input: Omit<HeroBannerSettings, "updatedAt">,
): Promise<HeroBannerSettings> {
  await ensureDbSchema();
  const pool = getDbPool();
  await pool.query("BEGIN");
  try {
    // Delete existing and insert new (keep only 1 record)
    await pool.query("TRUNCATE TABLE homepage_hero_banners RESTART IDENTITY");
    await pool.query(
      `INSERT INTO homepage_hero_banners (title, subtitle, cta_primary, cta_secondary, image_urls, updated_at) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        input.title,
        input.subtitle,
        input.ctaPrimary,
        input.ctaSecondary,
        input.imageUrls || [],
        new Date().toISOString(),
      ],
    );
    await pool.query("COMMIT");
    return { ...input, updatedAt: new Date().toISOString() };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}
