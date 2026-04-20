import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";
import { ensureArticleTypeByCode } from "@/lib/taxonomy-storage";

export interface ProjectArticle {
  id: number;
  slug?: string;
  targetSection?: "thiet-ke-noi-that" | "thi-cong-noi-that" | "du-an";
  targetType?: string;
  title: string;
  description: string;
  category?: string;
  coverImageUrl: string;
  introContent: string; // Markdown from File 1
  mainContent: string; // Markdown from File 2
  createdAt: string;
  updatedAt: string;
}

type ArticleRow = {
  id: number;
  slug: string | null;
  target_section: "thiet-ke-noi-that" | "thi-cong-noi-that" | "du-an";
  target_type: string;
  title: string;
  description: string;
  cover_image_url: string;
  intro_content: string;
  main_content: string;
  created_at: Date;
  updated_at: Date;
};

function mapArticleRow(row: ArticleRow): ProjectArticle {
  return {
    id: Number(row.id),
    slug: row.slug ?? undefined,
    targetSection: row.target_section,
    targetType: row.target_type,
    title: row.title,
    description: row.description,
    category: row.target_type,
    coverImageUrl: row.cover_image_url,
    introContent: row.intro_content,
    mainContent: row.main_content,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function readArticles(): Promise<ProjectArticle[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = (await pool.query(
    `
      SELECT
        pa.id,
        pa.slug,
        s.code AS target_section,
        t.code AS target_type,
        pa.title,
        pa.description,
        pa.cover_image_url,
        pa.intro_content,
        pa.main_content,
        pa.created_at,
        pa.updated_at
      FROM project_articles pa
      JOIN article_sections s ON s.id = pa.section_id
      JOIN article_types t ON t.id = pa.type_id
      ORDER BY pa.updated_at DESC, pa.id DESC
    `,
  )) as { rows: ArticleRow[] };

  return result.rows.map(mapArticleRow);
}

export async function writeArticles(articles: ProjectArticle[]): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE project_articles RESTART IDENTITY");

    for (const article of articles) {
      const type = await ensureArticleTypeByCode(
        article.targetSection ?? "thiet-ke-noi-that",
        article.targetType ?? "biet-thu",
      );
      await pool.query(
        `
          INSERT INTO project_articles (
            id,
            slug,
            section_id,
            type_id,
            title,
            description,
            cover_image_url,
            intro_content,
            main_content,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `,
        [
          article.id,
          article.slug ?? null,
          type.sectionId,
          type.id,
          article.title,
          article.description,
          article.coverImageUrl,
          article.introContent,
          article.mainContent,
          article.createdAt ?? new Date().toISOString(),
          article.updatedAt ?? new Date().toISOString(),
        ],
      );
    }

    await pool.query(
      "SELECT setval(pg_get_serial_sequence('project_articles', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM project_articles",
    );
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function getArticleById(
  id: number,
): Promise<ProjectArticle | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = (await pool.query(
    `
      SELECT
        pa.id,
        pa.slug,
        s.code AS target_section,
        t.code AS target_type,
        pa.title,
        pa.description,
        pa.cover_image_url,
        pa.intro_content,
        pa.main_content,
        pa.created_at,
        pa.updated_at
      FROM project_articles pa
      JOIN article_sections s ON s.id = pa.section_id
      JOIN article_types t ON t.id = pa.type_id
      WHERE pa.id = $1
      LIMIT 1
    `,
    [id],
  )) as { rows: ArticleRow[] };
  return result.rows[0] ? mapArticleRow(result.rows[0]) : null;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ProjectArticle | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = (await pool.query(
    `
      SELECT
        pa.id,
        pa.slug,
        s.code AS target_section,
        t.code AS target_type,
        pa.title,
        pa.description,
        pa.cover_image_url,
        pa.intro_content,
        pa.main_content,
        pa.created_at,
        pa.updated_at
      FROM project_articles pa
      JOIN article_sections s ON s.id = pa.section_id
      JOIN article_types t ON t.id = pa.type_id
      WHERE pa.slug = $1
      LIMIT 1
    `,
    [slug],
  )) as { rows: ArticleRow[] };
  return result.rows[0] ? mapArticleRow(result.rows[0]) : null;
}

export async function createArticle(
  article: Omit<ProjectArticle, "id" | "createdAt" | "updatedAt">,
): Promise<ProjectArticle> {
  await ensureDbSchema();
  const pool = getDbPool();
  const type = await ensureArticleTypeByCode(
    article.targetSection ?? "thiet-ke-noi-that",
    article.targetType ?? "biet-thu",
  );

  const result = (await pool.query(
    `
      INSERT INTO project_articles (
        slug,
        section_id,
        type_id,
        title,
        description,
        cover_image_url,
        intro_content,
        main_content
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        slug,
        (SELECT code FROM article_sections WHERE id = project_articles.section_id) AS target_section,
        (SELECT code FROM article_types WHERE id = project_articles.type_id) AS target_type,
        title,
        description,
        cover_image_url,
        intro_content,
        main_content,
        created_at,
        updated_at
    `,
    [
      article.slug ?? null,
      type.sectionId,
      type.id,
      article.title,
      article.description,
      article.coverImageUrl,
      article.introContent,
      article.mainContent,
    ],
  )) as { rows: ArticleRow[] };

  return mapArticleRow(result.rows[0]);
}

export async function upsertArticleByTargetType(
  targetSection: "thiet-ke-noi-that" | "thi-cong-noi-that" | "du-an",
  targetType: string,
  article: Omit<
    ProjectArticle,
    "id" | "createdAt" | "updatedAt" | "targetSection" | "targetType"
  >,
): Promise<ProjectArticle> {
  await ensureDbSchema();
  const pool = getDbPool();
  const type = await ensureArticleTypeByCode(targetSection, targetType);
  await pool.query("BEGIN");
  try {
    const updated = (await pool.query(
      `
        UPDATE project_articles
        SET
          slug = $3,
          title = $4,
          description = $5,
          cover_image_url = $6,
          intro_content = $7,
          main_content = $8
        WHERE section_id = $1 AND type_id = $2
        RETURNING
          id,
          slug,
          (SELECT code FROM article_sections WHERE id = project_articles.section_id) AS target_section,
          (SELECT code FROM article_types WHERE id = project_articles.type_id) AS target_type,
          title,
          description,
          cover_image_url,
          intro_content,
          main_content,
          created_at,
          updated_at
      `,
      [
        type.sectionId,
        type.id,
        article.slug ?? null,
        article.title,
        article.description,
        article.coverImageUrl,
        article.introContent,
        article.mainContent,
      ],
    )) as { rows: ArticleRow[] };

    if (updated.rows[0]) {
      await pool.query("COMMIT");
      return mapArticleRow(updated.rows[0]);
    }

    const inserted = (await pool.query(
      `
        INSERT INTO project_articles (
          slug,
          section_id,
          type_id,
          title,
          description,
          cover_image_url,
          intro_content,
          main_content
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
          id,
          slug,
          (SELECT code FROM article_sections WHERE id = project_articles.section_id) AS target_section,
          (SELECT code FROM article_types WHERE id = project_articles.type_id) AS target_type,
          title,
          description,
          cover_image_url,
          intro_content,
          main_content,
          created_at,
          updated_at
      `,
      [
        article.slug ?? null,
        type.sectionId,
        type.id,
        article.title,
        article.description,
        article.coverImageUrl,
        article.introContent,
        article.mainContent,
      ],
    )) as { rows: ArticleRow[] };

    await pool.query("COMMIT");
    return mapArticleRow(inserted.rows[0]);
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function updateArticle(
  id: number,
  updates: Partial<Omit<ProjectArticle, "id" | "createdAt">>,
): Promise<ProjectArticle | null> {
  const existing = await getArticleById(id);
  if (!existing) return null;

  const merged: ProjectArticle = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  await ensureDbSchema();
  const pool = getDbPool();
  const updatedType = await ensureArticleTypeByCode(
    merged.targetSection ?? "thiet-ke-noi-that",
    merged.targetType ?? "biet-thu",
  );
  const result = (await pool.query(
    `
      UPDATE project_articles
      SET
        slug = $2,
        section_id = $3,
        type_id = $4,
        title = $5,
        description = $6,
        cover_image_url = $7,
        intro_content = $8,
        main_content = $9
      WHERE id = $1
      RETURNING
        id,
        slug,
        (SELECT code FROM article_sections WHERE id = project_articles.section_id) AS target_section,
        (SELECT code FROM article_types WHERE id = project_articles.type_id) AS target_type,
        title,
        description,
        cover_image_url,
        intro_content,
        main_content,
        created_at,
        updated_at
    `,
    [
      id,
      merged.slug ?? null,
      updatedType.sectionId,
      updatedType.id,
      merged.title,
      merged.description,
      merged.coverImageUrl,
      merged.introContent,
      merged.mainContent,
    ],
  )) as { rows: ArticleRow[] };

  return result.rows[0] ? mapArticleRow(result.rows[0]) : null;
}

export async function deleteArticle(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query(
    "DELETE FROM project_articles WHERE id = $1",
    [id],
  );
  return (result.rowCount ?? 0) > 0;
}
