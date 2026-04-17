import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";

export type TaxonomyItem = {
  id: number;
  name: string;
  code?: string;
};

export type ArticleTypeItem = {
  id: number;
  name: string;
  code: string;
  sectionId: number;
  sectionCode: string;
  sectionName: string;
};

function toCode(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function readBlogCategories(): Promise<TaxonomyItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "SELECT id, name FROM blog_categories ORDER BY name ASC",
  );
  return result.rows.map((row) => ({ id: Number(row.id), name: row.name }));
}

export async function readProjectCategories(): Promise<TaxonomyItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "SELECT id, name FROM project_categories ORDER BY id ASC",
  );
  return result.rows.map((row) => ({ id: Number(row.id), name: row.name }));
}

export async function readProjectStyles(): Promise<TaxonomyItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "SELECT id, name FROM project_styles ORDER BY id ASC",
  );
  return result.rows.map((row) => ({ id: Number(row.id), name: row.name }));
}

export async function createBlogCategory(name: string): Promise<TaxonomyItem> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "INSERT INTO blog_categories (name) VALUES ($1) RETURNING id, name",
    [name.trim()],
  );
  const row = result.rows[0];
  return { id: Number(row.id), name: row.name };
}

export async function createProjectCategory(name: string): Promise<TaxonomyItem> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "INSERT INTO project_categories (name) VALUES ($1) RETURNING id, name",
    [name.trim()],
  );
  const row = result.rows[0];
  return { id: Number(row.id), name: row.name };
}

export async function createProjectStyle(name: string): Promise<TaxonomyItem> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "INSERT INTO project_styles (name) VALUES ($1) RETURNING id, name",
    [name.trim()],
  );
  const row = result.rows[0];
  return { id: Number(row.id), name: row.name };
}

export async function updateBlogCategory(id: number, name: string): Promise<TaxonomyItem | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "UPDATE blog_categories SET name = $2 WHERE id = $1 RETURNING id, name",
    [id, name.trim()],
  );
  if (!result.rows[0]) return null;
  return { id: Number(result.rows[0].id), name: result.rows[0].name };
}

export async function updateProjectCategory(id: number, name: string): Promise<TaxonomyItem | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "UPDATE project_categories SET name = $2 WHERE id = $1 RETURNING id, name",
    [id, name.trim()],
  );
  if (!result.rows[0]) return null;
  return { id: Number(result.rows[0].id), name: result.rows[0].name };
}

export async function updateProjectStyle(id: number, name: string): Promise<TaxonomyItem | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string }>(
    "UPDATE project_styles SET name = $2 WHERE id = $1 RETURNING id, name",
    [id, name.trim()],
  );
  if (!result.rows[0]) return null;
  return { id: Number(result.rows[0].id), name: result.rows[0].name };
}

export async function deleteBlogCategory(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const inUse = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM blog_posts WHERE category_id = $1",
    [id],
  );
  if (Number(inUse.rows[0]?.count || 0) > 0) {
    throw new Error("Không thể xóa category đang được bài viết sử dụng");
  }
  const result = await pool.query("DELETE FROM blog_categories WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function deleteProjectCategory(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const inUse = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM projects WHERE category_id = $1",
    [id],
  );
  if (Number(inUse.rows[0]?.count || 0) > 0) {
    throw new Error("Không thể xóa category đang được dự án sử dụng");
  }
  const result = await pool.query("DELETE FROM project_categories WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function deleteProjectStyle(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const inUse = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM projects WHERE style_id = $1",
    [id],
  );
  if (Number(inUse.rows[0]?.count || 0) > 0) {
    throw new Error("Không thể xóa style đang được dự án sử dụng");
  }
  const result = await pool.query("DELETE FROM project_styles WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function readArticleSections(): Promise<TaxonomyItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{ id: number; name: string; code: string | null }>(
    "SELECT id, name, code FROM article_sections ORDER BY id ASC",
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    code: row.code ?? undefined,
  }));
}

export async function readArticleTypes(): Promise<ArticleTypeItem[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    name: string;
    code: string;
    section_id: number;
    section_code: string;
    section_name: string;
  }>(
    `
      SELECT t.id, t.name, t.code, t.section_id, s.code AS section_code, s.name AS section_name
      FROM article_types t
      JOIN article_sections s ON s.id = t.section_id
      ORDER BY s.id ASC, t.id ASC
    `,
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    code: row.code,
    sectionId: Number(row.section_id),
    sectionCode: row.section_code,
    sectionName: row.section_name,
  }));
}

export async function createArticleType(input: {
  name: string;
  code?: string;
  sectionId: number;
}): Promise<ArticleTypeItem> {
  await ensureDbSchema();
  const pool = getDbPool();
  const code = toCode(input.code || input.name);
  const result = await pool.query<{
    id: number;
    name: string;
    code: string;
    section_id: number;
    section_code: string;
    section_name: string;
  }>(
    `
      INSERT INTO article_types (name, code, section_id)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        code,
        section_id,
        (SELECT code FROM article_sections WHERE id = section_id) AS section_code,
        (SELECT name FROM article_sections WHERE id = section_id) AS section_name
    `,
    [input.name.trim(), code, input.sectionId],
  );
  const row = result.rows[0];
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code,
    sectionId: Number(row.section_id),
    sectionCode: row.section_code,
    sectionName: row.section_name,
  };
}

export async function updateArticleType(
  id: number,
  input: { name: string; code?: string; sectionId: number },
): Promise<ArticleTypeItem | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const code = toCode(input.code || input.name);
  const result = await pool.query<{
    id: number;
    name: string;
    code: string;
    section_id: number;
    section_code: string;
    section_name: string;
  }>(
    `
      UPDATE article_types
      SET name = $2, code = $3, section_id = $4
      WHERE id = $1
      RETURNING
        id,
        name,
        code,
        section_id,
        (SELECT code FROM article_sections WHERE id = section_id) AS section_code,
        (SELECT name FROM article_sections WHERE id = section_id) AS section_name
    `,
    [id, input.name.trim(), code, input.sectionId],
  );
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code,
    sectionId: Number(row.section_id),
    sectionCode: row.section_code,
    sectionName: row.section_name,
  };
}

export async function deleteArticleType(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const inUse = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM project_articles WHERE type_id = $1",
    [id],
  );
  if (Number(inUse.rows[0]?.count || 0) > 0) {
    throw new Error("Không thể xóa loại bài viết đang được sử dụng");
  }
  const result = await pool.query("DELETE FROM article_types WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function getArticleTypeByCode(sectionCode: string, typeCode: string): Promise<ArticleTypeItem | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    name: string;
    code: string;
    section_id: number;
    section_code: string;
    section_name: string;
  }>(
    `
      SELECT t.id, t.name, t.code, t.section_id, s.code AS section_code, s.name AS section_name
      FROM article_types t
      JOIN article_sections s ON s.id = t.section_id
      WHERE s.code = $1 AND t.code = $2
      LIMIT 1
    `,
    [sectionCode, typeCode],
  );

  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code,
    sectionId: Number(row.section_id),
    sectionCode: row.section_code,
    sectionName: row.section_name,
  };
}

export async function ensureArticleTypeByCode(sectionCode: string, typeCode: string): Promise<ArticleTypeItem> {
  const existing = await getArticleTypeByCode(sectionCode, typeCode);
  if (existing) return existing;

  const sections = await readArticleSections();
  const section = sections.find((item) => item.code === sectionCode);
  if (!section) {
    throw new Error(`Section not found: ${sectionCode}`);
  }

  return createArticleType({
    sectionId: section.id,
    code: typeCode,
    name: typeCode.replace(/-/g, " "),
  });
}
