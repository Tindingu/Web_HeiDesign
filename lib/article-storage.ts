import fs from "fs/promises";
import path from "path";

export interface ProjectArticle {
  id: number;
  slug?: string;
  targetSection?: "thiet-ke-noi-that" | "thi-cong-noi-that";
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

const articlesFile = path.join(process.cwd(), "data", "articles.json");

async function ensureDataDir() {
  const dir = path.dirname(articlesFile);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

export async function readArticles(): Promise<ProjectArticle[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(articlesFile, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}

export async function writeArticles(articles: ProjectArticle[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(articlesFile, JSON.stringify(articles, null, 2), "utf-8");
}

export async function getArticleById(
  id: number,
): Promise<ProjectArticle | null> {
  const articles = await readArticles();
  return articles.find((a) => a.id === id) || null;
}

export async function getArticleBySlug(
  slug: string,
): Promise<ProjectArticle | null> {
  const articles = await readArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export async function createArticle(
  article: Omit<ProjectArticle, "id" | "createdAt" | "updatedAt">,
): Promise<ProjectArticle> {
  const articles = await readArticles();
  const newArticle: ProjectArticle = {
    ...article,
    id: Math.max(0, ...articles.map((a) => a.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articles.push(newArticle);
  await writeArticles(articles);
  return newArticle;
}

export async function upsertArticleByTargetType(
  targetSection: "thiet-ke-noi-that" | "thi-cong-noi-that",
  targetType: string,
  article: Omit<
    ProjectArticle,
    "id" | "createdAt" | "updatedAt" | "targetSection" | "targetType"
  >,
): Promise<ProjectArticle> {
  const articles = await readArticles();
  const index = articles.findIndex(
    (a) => a.targetSection === targetSection && a.targetType === targetType,
  );

  if (index !== -1) {
    articles[index] = {
      ...articles[index],
      ...article,
      targetSection,
      targetType,
      updatedAt: new Date().toISOString(),
    };
    await writeArticles(articles);
    return articles[index];
  }

  const newArticle: ProjectArticle = {
    ...article,
    targetSection,
    targetType,
    id: Math.max(0, ...articles.map((a) => a.id)) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articles.push(newArticle);
  await writeArticles(articles);
  return newArticle;
}

export async function updateArticle(
  id: number,
  updates: Partial<Omit<ProjectArticle, "id" | "createdAt">>,
): Promise<ProjectArticle | null> {
  const articles = await readArticles();
  const index = articles.findIndex((a) => a.id === id);

  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeArticles(articles);
  return articles[index];
}

export async function deleteArticle(id: number): Promise<boolean> {
  const articles = await readArticles();
  const filtered = articles.filter((a) => a.id !== id);

  if (filtered.length === articles.length) return false;

  await writeArticles(filtered);
  return true;
}
