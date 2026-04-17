import type { Project } from "@/lib/strapi";
import { ensureDbSchema } from "@/lib/db/schema";
import { getDbPool } from "@/lib/db/neon";
import { defaultBlurDataURL } from "@/lib/constants";
import { readProjectCategories, readProjectStyles } from "@/lib/taxonomy-storage";

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  style: string;
  budget: string;
  cover_image_url: string;
  cover_image_alt: string;
  cover_image_blur_data_url: string | null;
  word_content: string | null;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
};

type ProjectImageRow = {
  project_id: number;
  url: string;
  alt: string;
  blur_data_url: string | null;
  position: number;
};

type ProjectHighlightRow = {
  project_id: number;
  content: string;
  position: number;
};

type ProjectAttributeRow = {
  project_id: number;
  attr_key: string;
  attr_value: string;
  label: string | null;
};

type ProjectSectionRow = {
  project_id: number;
  title: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  position: number;
};

function normalizeImageUrl(value: string | null | undefined): string {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.startsWith("/") || text.startsWith("http://") || text.startsWith("https://")) {
    return text;
  }
  return "";
}

const fallbackProjectCoverImage = "/upload/banner/hero-cover.png";

function getCategoryFallback(category?: string): string {
  return category && category.trim() ? category.trim() : "Chưa phân loại";
}

function getStyleFallback(style?: string): string {
  return style && style.trim() ? style.trim() : "Hiện đại";
}

function mapProjectRows(
  rows: ProjectRow[],
  imageRows: ProjectImageRow[],
  highlightRows: ProjectHighlightRow[],
  attributeRows: ProjectAttributeRow[],
  sectionRows: ProjectSectionRow[],
): Project[] {
  const imagesByProject = new Map<number, ProjectImageRow[]>();
  const highlightsByProject = new Map<number, ProjectHighlightRow[]>();
  const attributesByProject = new Map<number, ProjectAttributeRow[]>();
  const sectionsByProject = new Map<number, ProjectSectionRow[]>();

  for (const image of imageRows) {
    const key = Number(image.project_id);
    const list = imagesByProject.get(key) ?? [];
    list.push(image);
    imagesByProject.set(key, list);
  }

  for (const highlight of highlightRows) {
    const key = Number(highlight.project_id);
    const list = highlightsByProject.get(key) ?? [];
    list.push(highlight);
    highlightsByProject.set(key, list);
  }

  for (const attribute of attributeRows) {
    const key = Number(attribute.project_id);
    const list = attributesByProject.get(key) ?? [];
    list.push(attribute);
    attributesByProject.set(key, list);
  }

  for (const section of sectionRows) {
    const key = Number(section.project_id);
    const list = sectionsByProject.get(key) ?? [];
    list.push(section);
    sectionsByProject.set(key, list);
  }

  return rows.map((row) => {
    const id = Number(row.id);
    const gallery = (imagesByProject.get(id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((image) => ({
        url: normalizeImageUrl(image.url),
        alt: image.alt,
        blurDataURL: image.blur_data_url ?? defaultBlurDataURL,
      }))
      .filter((image) => Boolean(image.url));

    const highlights = (highlightsByProject.get(id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((highlight) => highlight.content);

    const attributeList = attributesByProject.get(id) ?? [];
    const details = attributeList
      .filter((item) => item.attr_key.startsWith("detail:"))
      .map((item) => ({
        label: item.label || item.attr_key.replace("detail:", ""),
        value: item.attr_value,
      }));

    const projectDetails = {
      area:
        attributeList.find((item) => item.attr_key === "project.area")
          ?.attr_value || "",
      duration:
        attributeList.find((item) => item.attr_key === "project.duration")
          ?.attr_value || "",
      scope:
        attributeList.find((item) => item.attr_key === "project.scope")
          ?.attr_value || "",
      client: attributeList.find((item) => item.attr_key === "project.client")
        ?.attr_value,
      location:
        attributeList.find((item) => item.attr_key === "project.location")
          ?.attr_value,
      completedDate:
        attributeList.find((item) => item.attr_key === "project.completedDate")
          ?.attr_value,
    };

    const sections = (sectionsByProject.get(id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((section) => ({
        title: section.title,
        content: section.content || "",
        image: section.image_url
          ? {
              url: normalizeImageUrl(section.image_url),
              alt: section.image_alt || section.title,
              blurDataURL: defaultBlurDataURL,
            }
          : undefined,
      }))
      .map((section) => {
        if (section.image && !section.image.url) {
          return { ...section, image: undefined };
        }
        return section;
      });

    return {
      id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      description: row.description,
      category: getCategoryFallback(row.category),
      style: row.style,
      budget: row.budget,
      coverImage: {
        url: normalizeImageUrl(row.cover_image_url) || fallbackProjectCoverImage,
        alt: row.cover_image_alt,
        blurDataURL: row.cover_image_blur_data_url ?? defaultBlurDataURL,
      },
      gallery,
      details,
      projectDetails,
      highlights,
      sections,
      wordContent: row.word_content ?? undefined,
      featured: row.featured,
      createdAt: new Date(row.created_at).toISOString(),
      updatedAt: new Date(row.updated_at).toISOString(),
    };
  });
}

async function loadProjectRelations(projectIds: number[]) {
  if (projectIds.length === 0) {
    return {
      images: [] as ProjectImageRow[],
      highlights: [] as ProjectHighlightRow[],
      attributes: [] as ProjectAttributeRow[],
      sections: [] as ProjectSectionRow[],
    };
  }

  const pool = getDbPool();
  const [imagesResult, highlightsResult, attributesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT project_id, url, alt, blur_data_url, position
        FROM project_images
        WHERE project_id = ANY($1::int[])
        ORDER BY project_id ASC, position ASC, id ASC
      `,
      [projectIds],
    ) as Promise<{ rows: ProjectImageRow[] }>,
    pool.query(
      `
        SELECT project_id, content, position
        FROM project_highlights
        WHERE project_id = ANY($1::int[])
        ORDER BY project_id ASC, position ASC, id ASC
      `,
      [projectIds],
    ) as Promise<{ rows: ProjectHighlightRow[] }>,
    pool.query(
      `
        SELECT project_id, attr_key, attr_value, label
        FROM project_attributes
        WHERE project_id = ANY($1::int[])
        ORDER BY project_id ASC, id ASC
      `,
      [projectIds],
    ) as Promise<{ rows: ProjectAttributeRow[] }>,
    pool.query(
      `
        SELECT project_id, title, content, image_url, image_alt, position
        FROM project_sections
        WHERE project_id = ANY($1::int[])
        ORDER BY project_id ASC, position ASC, id ASC
      `,
      [projectIds],
    ) as Promise<{ rows: ProjectSectionRow[] }>,
  ]);

  return {
    images: imagesResult.rows,
    highlights: highlightsResult.rows,
    attributes: attributesResult.rows,
    sections: sectionsResult.rows,
  };
}

async function resolveProjectCategoryId(name: string): Promise<number> {
  const pool = getDbPool();
  const normalized = getCategoryFallback(name);
  const categories = await readProjectCategories();
  const existed = categories.find((item) => item.name === normalized);
  if (existed) return existed.id;

  const inserted = await pool.query(
    "INSERT INTO project_categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    [normalized],
  ) as { rows: { id: number }[] };
  return Number(inserted.rows[0].id);
}

async function resolveProjectStyleId(name: string): Promise<number> {
  const pool = getDbPool();
  const normalized = getStyleFallback(name);
  const styles = await readProjectStyles();
  const existed = styles.find((item) => item.name === normalized);
  if (existed) return existed.id;

  const inserted = await pool.query(
    "INSERT INTO project_styles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    [normalized],
  ) as { rows: { id: number }[] };
  return Number(inserted.rows[0].id);
}

async function replaceProjectRelations(projectId: number, project: Project) {
  const pool = getDbPool();
  await pool.query("DELETE FROM project_images WHERE project_id = $1", [projectId]);
  await pool.query("DELETE FROM project_highlights WHERE project_id = $1", [projectId]);
  await pool.query("DELETE FROM project_attributes WHERE project_id = $1", [projectId]);
  await pool.query("DELETE FROM project_sections WHERE project_id = $1", [projectId]);

  for (const [index, image] of (project.gallery ?? []).entries()) {
    const url = normalizeImageUrl(image.url);
    if (!url) continue;
    await pool.query(
      `
        INSERT INTO project_images (project_id, url, alt, blur_data_url, position)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [projectId, url, image.alt ?? "", image.blurDataURL ?? null, index],
    );
  }

  for (const [index, highlight] of (project.highlights ?? []).entries()) {
    await pool.query(
      `
        INSERT INTO project_highlights (project_id, content, position)
        VALUES ($1, $2, $3)
      `,
      [projectId, highlight, index],
    );
  }

  for (const item of project.details ?? []) {
    await pool.query(
      `
        INSERT INTO project_attributes (project_id, attr_key, attr_value, label)
        VALUES ($1, $2, $3, $4)
      `,
      [projectId, `detail:${item.label || "detail"}`, item.value || "", item.label || null],
    );
  }

  const projectDetails = project.projectDetails;
  if (projectDetails) {
    const detailsMap: Array<[string, string | undefined]> = [
      ["project.area", projectDetails.area],
      ["project.duration", projectDetails.duration],
      ["project.scope", projectDetails.scope],
      ["project.client", projectDetails.client],
      ["project.location", projectDetails.location],
      ["project.completedDate", projectDetails.completedDate],
    ];

    for (const [key, value] of detailsMap) {
      if (!value) continue;
      await pool.query(
        `
          INSERT INTO project_attributes (project_id, attr_key, attr_value, label)
          VALUES ($1, $2, $3, NULL)
        `,
        [projectId, key, value],
      );
    }
  }

  for (const [index, section] of (project.sections ?? []).entries()) {
    const imageUrl = normalizeImageUrl(section.image?.url);
    await pool.query(
      `
        INSERT INTO project_sections (project_id, title, content, image_url, image_alt, position)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        projectId,
        section.title || "",
        section.content || "",
        imageUrl || null,
        section.image?.alt || null,
        index,
      ],
    );
  }
}

export async function readProjects(): Promise<Project[]> {
  await ensureDbSchema();
  const pool = getDbPool();
  const projectsResult = await pool.query(
    `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.summary,
        p.description,
        COALESCE(pc.name, 'Chưa phân loại') AS category,
        COALESCE(ps.name, p.style) AS style,
        p.budget,
        p.cover_image_url,
        p.cover_image_alt,
        p.cover_image_blur_data_url,
        p.word_content,
        p.featured,
        p.created_at,
        p.updated_at
      FROM projects p
      LEFT JOIN project_categories pc ON pc.id = p.category_id
      LEFT JOIN project_styles ps ON ps.id = p.style_id
      ORDER BY p.updated_at DESC, p.id DESC
    `,
  ) as { rows: ProjectRow[] };

  const ids = projectsResult.rows.map((row) => Number(row.id));
  const relations = await loadProjectRelations(ids);
  return mapProjectRows(
    projectsResult.rows,
    relations.images,
    relations.highlights,
    relations.attributes,
    relations.sections,
  );
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    await pool.query("TRUNCATE TABLE project_images, project_highlights, project_attributes, project_sections, projects RESTART IDENTITY CASCADE");

    for (const project of projects) {
      const categoryId = await resolveProjectCategoryId(project.category);
      const styleName = getStyleFallback(project.style);
      const styleId = await resolveProjectStyleId(styleName);
      const inserted = await pool.query(
        `
          INSERT INTO projects (
            id,
            slug,
            title,
            summary,
            description,
            category_id,
            style_id,
            style,
            budget,
            cover_image_url,
            cover_image_alt,
            cover_image_blur_data_url,
            word_content,
            featured,
            created_at,
            updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15, $16
          )
          RETURNING id
        `,
        [
          project.id,
          project.slug,
          project.title,
          project.summary,
          project.description,
          categoryId,
          styleId,
          styleName,
          project.budget,
          normalizeImageUrl(project.coverImage?.url),
          project.coverImage?.alt ?? project.title,
          project.coverImage?.blurDataURL ?? null,
          project.wordContent ?? null,
          Boolean(project.featured),
          project.createdAt ?? new Date().toISOString(),
          project.updatedAt ?? new Date().toISOString(),
        ],
      ) as { rows: { id: number }[] };
      await replaceProjectRelations(Number(inserted.rows[0].id), project);
    }

    await pool.query(
      "SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM projects",
    );
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.summary,
        p.description,
        COALESCE(pc.name, 'Chưa phân loại') AS category,
        COALESCE(ps.name, p.style) AS style,
        p.budget,
        p.cover_image_url,
        p.cover_image_alt,
        p.cover_image_blur_data_url,
        p.word_content,
        p.featured,
        p.created_at,
        p.updated_at
      FROM projects p
      LEFT JOIN project_categories pc ON pc.id = p.category_id
      LEFT JOIN project_styles ps ON ps.id = p.style_id
      WHERE p.id = $1
      LIMIT 1
    `,
    [id],
  ) as { rows: ProjectRow[] };

  if (!result.rows[0]) return null;
  const relations = await loadProjectRelations([id]);
  return mapProjectRows(
    [result.rows[0]],
    relations.images,
    relations.highlights,
    relations.attributes,
    relations.sections,
  )[0] ?? null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.slug,
        p.title,
        p.summary,
        p.description,
        COALESCE(pc.name, 'Chưa phân loại') AS category,
        COALESCE(ps.name, p.style) AS style,
        p.budget,
        p.cover_image_url,
        p.cover_image_alt,
        p.cover_image_blur_data_url,
        p.word_content,
        p.featured,
        p.created_at,
        p.updated_at
      FROM projects p
      LEFT JOIN project_categories pc ON pc.id = p.category_id
      LEFT JOIN project_styles ps ON ps.id = p.style_id
      WHERE p.slug = $1
      LIMIT 1
    `,
    [slug],
  ) as { rows: ProjectRow[] };

  const row = result.rows[0];
  if (!row) return null;
  const id = Number(row.id);
  const relations = await loadProjectRelations([id]);
  return mapProjectRows(
    [row],
    relations.images,
    relations.highlights,
    relations.attributes,
    relations.sections,
  )[0] ?? null;
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    const categoryId = await resolveProjectCategoryId(project.category);
    const styleName = getStyleFallback(project.style);
    const styleId = await resolveProjectStyleId(styleName);
    const inserted = await pool.query(
      `
        INSERT INTO projects (
          slug,
          title,
          summary,
          description,
          category_id,
          style_id,
          style,
          budget,
          cover_image_url,
          cover_image_alt,
          cover_image_blur_data_url,
          word_content,
          featured
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13
        )
        RETURNING
          id,
          slug,
          title,
          summary,
          description,
          (SELECT name FROM project_categories WHERE id = projects.category_id) AS category,
          (SELECT name FROM project_styles WHERE id = projects.style_id) AS style,
          budget,
          cover_image_url,
          cover_image_alt,
          cover_image_blur_data_url,
          word_content,
          featured,
          created_at,
          updated_at
      `,
      [
        project.slug,
        project.title,
        project.summary,
        project.description,
        categoryId,
        styleId,
        project.style,
        project.budget,
        normalizeImageUrl(project.coverImage?.url),
        project.coverImage?.alt ?? project.title,
        project.coverImage?.blurDataURL ?? null,
        project.wordContent ?? null,
        Boolean(project.featured),
      ],
    ) as { rows: ProjectRow[] };

    const row = inserted.rows[0];
    const id = Number(row.id);
    await replaceProjectRelations(id, { ...project, id } as Project);
    await pool.query("COMMIT");

    const relations = await loadProjectRelations([id]);
    return mapProjectRows(
      [row],
      relations.images,
      relations.highlights,
      relations.attributes,
      relations.sections,
    )[0];
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function updateProject(
  id: number,
  updates: Partial<Project>,
): Promise<Project | null> {
  const existing = await getProjectById(id);
  if (!existing) return null;

  const merged: Project = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
  };

  await ensureDbSchema();
  const pool = getDbPool();

  await pool.query("BEGIN");
  try {
    const categoryId = await resolveProjectCategoryId(merged.category);
    const styleName = getStyleFallback(merged.style);
    const styleId = await resolveProjectStyleId(styleName);
    const updated = await pool.query(
      `
        UPDATE projects
        SET
          slug = $2,
          title = $3,
          summary = $4,
          description = $5,
          category_id = $6,
          style_id = $7,
          style = $8,
          budget = $9,
          cover_image_url = $10,
          cover_image_alt = $11,
          cover_image_blur_data_url = $12,
          word_content = $13,
          featured = $14
        WHERE id = $1
        RETURNING
          id,
          slug,
          title,
          summary,
          description,
          (SELECT name FROM project_categories WHERE id = projects.category_id) AS category,
          (SELECT name FROM project_styles WHERE id = projects.style_id) AS style,
          budget,
          cover_image_url,
          cover_image_alt,
          cover_image_blur_data_url,
          word_content,
          featured,
          created_at,
          updated_at
      `,
      [
        id,
        merged.slug,
        merged.title,
        merged.summary,
        merged.description,
        categoryId,
        styleId,
        styleName,
        merged.budget,
        normalizeImageUrl(merged.coverImage?.url),
        merged.coverImage?.alt ?? merged.title,
        merged.coverImage?.blurDataURL ?? null,
        merged.wordContent ?? null,
        Boolean(merged.featured),
      ],
    ) as { rows: ProjectRow[] };

    await replaceProjectRelations(id, merged);
    await pool.query("COMMIT");

    const relations = await loadProjectRelations([id]);
    return mapProjectRows(
      updated.rows,
      relations.images,
      relations.highlights,
      relations.attributes,
      relations.sections,
    )[0] ?? null;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  await ensureDbSchema();
  const pool = getDbPool();
  const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}
