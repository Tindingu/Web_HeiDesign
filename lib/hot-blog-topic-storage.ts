import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type HotBlogTopicSettings = {
  topicSlug: string;
  topicLabel: string;
  /** Multiple banner images displayed side-by-side on homepage */
  bannerImageUrls: string[];
  updatedAt: string;
};

export async function readHotBlogTopicSettings(): Promise<HotBlogTopicSettings | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  try {
    const res = (await pool.query(
      `SELECT topic_slug, topic_label, banner_image_urls, updated_at FROM homepage_hot_topics ORDER BY id DESC LIMIT 1`
    )) as { rows: any[] };

    if (!res.rows[0]) return null;
    const row = res.rows[0];
    return {
      topicSlug: row.topic_slug || "",
      topicLabel: row.topic_label || "",
      bannerImageUrls: Array.isArray(row.banner_image_urls) ? row.banner_image_urls : [],
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Error reading hot topic from DB:", error);
    return null;
  }
}

export async function saveHotBlogTopicSettings(
  input: Omit<HotBlogTopicSettings, "updatedAt">,
): Promise<HotBlogTopicSettings> {
  await ensureDbSchema();
  const pool = getDbPool();
  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE homepage_hot_topics RESTART IDENTITY");
    await pool.query(
      `INSERT INTO homepage_hot_topics (topic_slug, topic_label, banner_image_urls, updated_at) VALUES ($1, $2, $3, $4)`,
      [input.topicSlug, input.topicLabel, input.bannerImageUrls || [], new Date().toISOString()],
    );
    await pool.query("COMMIT");
    return { ...input, updatedAt: new Date().toISOString() };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function clearHotBlogTopicSettings(): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();
  await pool.query("TRUNCATE TABLE homepage_hot_topics RESTART IDENTITY");
}
