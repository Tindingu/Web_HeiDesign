import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type HomepageTestimonial = {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  updatedAt: string;
};

export async function readHomepageTestimonials(): Promise<
  HomepageTestimonial[]
> {
  await ensureDbSchema();
  const pool = getDbPool();
  try {
    const res = (await pool.query(
      `SELECT id, external_id, name, quote, image_url, sort_order, is_active, updated_at FROM homepage_testimonials ORDER BY sort_order ASC, id ASC`
    )) as { rows: any[] };

    return res.rows.map((row, index) => ({
      id: row.external_id ?? String(row.id),
      name: row.name || "",
      quote: row.quote || "",
      imageUrl: row.image_url || "",
      sortOrder: Number(row.sort_order ?? index),
      isActive: row.is_active !== false,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    // Table might not exist or columns missing, return empty
    console.warn("Error reading testimonials from DB:", error);
    return [];
  }
}

export async function readActiveHomepageTestimonials(): Promise<
  HomepageTestimonial[]
> {
  const items = await readHomepageTestimonials();
  return items.filter((item) => item.isActive);
}

export async function saveHomepageTestimonials(
  input: Array<
    Pick<HomepageTestimonial, "name" | "quote" | "imageUrl" | "isActive">
  >,
): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE homepage_testimonials RESTART IDENTITY");

    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const name = String(item.name || "").trim();
      const quote = String(item.quote || "").trim();
      const imageUrl = String(item.imageUrl || "").trim();

      if (!name) throw new Error(`Nhận xét #${i + 1} chưa có tên khách hàng.`);
      if (!quote) throw new Error(`Nhận xét #${i + 1} chưa có nội dung.`);
      if (!imageUrl) throw new Error(`Nhận xét #${i + 1} chưa có hình khách hàng.`);

      const externalId = `${Date.now()}-${i}`;
      await pool.query(
        `INSERT INTO homepage_testimonials (external_id, name, quote, image_url, sort_order, is_active, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          externalId,
          name,
          quote,
          imageUrl,
          i,
          item.isActive ?? true,
          new Date().toISOString(),
        ],
      );
    }

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}
