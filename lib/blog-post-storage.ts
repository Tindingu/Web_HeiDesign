import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";
import type { ImageAsset, Post } from "@/lib/strapi";
import { defaultBlurDataURL } from "@/lib/constants";
import { readBlogCategories } from "@/lib/taxonomy-storage";

export type BlogPostRecord = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  coverImage: ImageAsset;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type BlogPostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  cover_image_url: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
};

function mapBlogPostRow(row: BlogPostRow): BlogPostRecord {
  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    content: row.content,
    coverImage: {
      url: row.cover_image_url,
      alt: row.title,
      blurDataURL: defaultBlurDataURL,
    },
    publishedAt: new Date(row.published_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function readBlogPosts(): Promise<BlogPostRecord[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<BlogPostRow>(
    `
      SELECT
        bp.id,
        bp.slug,
        bp.title,
        bp.excerpt,
        COALESCE(c.name, 'Tin tức') AS category,
        bp.content,
        bp.cover_image_url,
        bp.published_at,
        bp.created_at,
        bp.updated_at
      FROM blog_posts bp
      LEFT JOIN blog_categories c ON c.id = bp.category_id
      ORDER BY published_at DESC, bp.id DESC
    `,
  );
  return result.rows.map(mapBlogPostRow);
}

export async function writeBlogPosts(posts: BlogPostRecord[]): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE blog_posts RESTART IDENTITY");

    for (const post of posts) {
      const categories = await readBlogCategories();
      const matchedCategory = categories.find(
        (item) => item.name === post.category,
      );
      const categoryId =
        matchedCategory?.id ??
        (
          await pool.query<{ id: number }>(
            "INSERT INTO blog_categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
            [post.category],
          )
        ).rows[0].id;

      await pool.query(
        `
          INSERT INTO blog_posts (
            id,
            slug,
            title,
            excerpt,
            category_id,
            content,
            cover_image_url,
            published_at,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          categoryId,
          post.content,
          post.coverImage?.url ?? "",
          post.publishedAt,
          post.createdAt,
          post.updatedAt,
        ],
      );
    }

    await pool.query(
      "SELECT setval(pg_get_serial_sequence('blog_posts', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM blog_posts",
    );
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function getBlogPostById(
  id: number,
): Promise<BlogPostRecord | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<BlogPostRow>(
    `
      SELECT
        bp.id,
        bp.slug,
        bp.title,
        bp.excerpt,
        COALESCE(c.name, 'Tin tức') AS category,
        bp.content,
        bp.cover_image_url,
        bp.published_at,
        bp.created_at,
        bp.updated_at
      FROM blog_posts bp
      LEFT JOIN blog_categories c ON c.id = bp.category_id
      WHERE bp.id = $1
      LIMIT 1
    `,
    [id],
  );
  return result.rows[0] ? mapBlogPostRow(result.rows[0]) : null;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query<BlogPostRow>(
    `
      SELECT
        bp.id,
        bp.slug,
        bp.title,
        bp.excerpt,
        COALESCE(c.name, 'Tin tức') AS category,
        bp.content,
        bp.cover_image_url,
        bp.published_at,
        bp.created_at,
        bp.updated_at
      FROM blog_posts bp
      LEFT JOIN blog_categories c ON c.id = bp.category_id
      WHERE bp.slug = $1
      LIMIT 1
    `,
    [slug],
  );
  return result.rows[0] ? mapBlogPostRow(result.rows[0]) : null;
}

export async function createBlogPost(
  post: Omit<BlogPostRecord, "id" | "createdAt" | "updatedAt">,
): Promise<BlogPostRecord> {
  await ensureDbSchema();
  const pool = getDbPool();
  const categories = await readBlogCategories();
  const matchedCategory = categories.find(
    (item) => item.name === post.category,
  );
  const categoryId =
    matchedCategory?.id ??
    (
      await pool.query<{ id: number }>(
        "INSERT INTO blog_categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        [post.category],
      )
    ).rows[0].id;

  const result = await pool.query<BlogPostRow>(
    `
      INSERT INTO blog_posts (
        slug,
        title,
        excerpt,
        category_id,
        content,
        cover_image_url,
        published_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        slug,
        title,
        excerpt,
        (SELECT name FROM blog_categories WHERE id = blog_posts.category_id) AS category,
        content,
        cover_image_url,
        published_at,
        created_at,
        updated_at
    `,
    [
      post.slug,
      post.title,
      post.excerpt,
      categoryId,
      post.content,
      post.coverImage?.url ?? "",
      post.publishedAt,
    ],
  );
  return mapBlogPostRow(result.rows[0]);
}

export async function updateBlogPost(
  id: number,
  updates: Partial<Omit<BlogPostRecord, "id" | "createdAt">>,
): Promise<BlogPostRecord | null> {
  const existing = await getBlogPostById(id);
  if (!existing) return null;

  const merged: BlogPostRecord = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  await ensureDbSchema();
  const pool = getDbPool();
  const categories = await readBlogCategories();
  const matchedCategory = categories.find(
    (item) => item.name === merged.category,
  );
  const categoryId =
    matchedCategory?.id ??
    (
      await pool.query<{ id: number }>(
        "INSERT INTO blog_categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        [merged.category],
      )
    ).rows[0].id;

  const result = await pool.query<BlogPostRow>(
    `
      UPDATE blog_posts
      SET
        slug = $2,
        title = $3,
        excerpt = $4,
        category_id = $5,
        content = $6,
        cover_image_url = $7,
        published_at = $8
      WHERE id = $1
      RETURNING
        id,
        slug,
        title,
        excerpt,
        (SELECT name FROM blog_categories WHERE id = blog_posts.category_id) AS category,
        content,
        cover_image_url,
        published_at,
        created_at,
        updated_at
    `,
    [
      id,
      merged.slug,
      merged.title,
      merged.excerpt,
      categoryId,
      merged.content,
      merged.coverImage?.url ?? "",
      merged.publishedAt,
    ],
  );

  return result.rows[0] ? mapBlogPostRow(result.rows[0]) : null;
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export function toPost(record: BlogPostRecord): Post {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    category: record.category,
    content: record.content,
    coverImage: record.coverImage,
    publishedAt: record.publishedAt,
  };
}
