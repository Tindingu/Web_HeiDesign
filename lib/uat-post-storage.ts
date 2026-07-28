import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";

export type UatPost = {
  id: string;
  sourceSlug: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImageUrl: string;
  markdown: string;
  rawMarkdown: string;
  publishedAt?: string;
  updatedAt?: string;
  sourceUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  importedAt: string;
  imageCount: number;
};

type SourceMetadata = {
  id?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  sourceUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  images?: Array<{ file?: string }>;
  targetSection?: string;
  targetType?: string;
};

export const UAT_DEFAULT_SOURCE_SLUG = "thiet-ke-noi-that-chung-cu";

const uatPostsRoot = path.join(process.cwd(), "icep-design-posts");
const uatStoreRoot = path.join(process.cwd(), ".uat");
const uatPostsFile = path.join(uatStoreRoot, "posts.json");
const adminMarkdownDraftsRoot = path.join(uatPostsRoot, "admin-md-drafts");

export function assertUatLocalOnly() {
  if (process.env.VERCEL === "1") {
    throw new Error("UAT local routes are disabled on Vercel.");
  }
}

export function getUatSourceDir(sourceSlug = UAT_DEFAULT_SOURCE_SLUG) {
  return path.join(uatPostsRoot, sourceSlug);
}

export function getUatAssetFilePath(sourceSlug: string, relativePath: string) {
  const sourceDir = getUatSourceDir(sourceSlug);
  const filePath = path.resolve(sourceDir, relativePath);
  const safeRoot = path.resolve(sourceDir);

  if (!filePath.startsWith(`${safeRoot}${path.sep}`)) {
    throw new Error("Invalid UAT asset path.");
  }

  return filePath;
}

function normalizeRelativePath(value = "") {
  return value
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "")
    .replace(/^\/+/, "");
}

function toUatAssetUrl(sourceSlug: string, value = "") {
  const normalized = normalizeRelativePath(value);
  return `/api/uat/assets/${sourceSlug}/${normalized
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function stripFrontmatter(markdown: string) {
  if (!markdown.startsWith("---")) return markdown;
  const endIndex = markdown.indexOf("\n---", 3);
  if (endIndex === -1) return markdown;
  return markdown.slice(endIndex + 4).trimStart();
}

function rewriteLocalImagePaths(markdown: string, sourceSlug: string) {
  return markdown
    .replace(
      /(!\[[^\]]*\]\()(\.\/images\/[^\s)]+)(?:\s+["'][^"']*["'])?(\))/g,
      (_, prefix: string, imagePath: string, suffix: string) =>
        `${prefix}${toUatAssetUrl(sourceSlug, imagePath)}${suffix}`,
    )
    .replace(
      /(<img[^>]+src=["'])(\.\/images\/[^"']+)(["'][^>]*>)/g,
      (_, prefix: string, imagePath: string, suffix: string) =>
        `${prefix}${toUatAssetUrl(sourceSlug, imagePath)}${suffix}`,
    );
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function readUatSourcePost(
  sourceSlug = UAT_DEFAULT_SOURCE_SLUG,
): Promise<UatPost> {
  assertUatLocalOnly();

  if (sourceSlug.startsWith("admin-md-drafts/")) {
    const draftSlug = sourceSlug.replace(/^admin-md-drafts\//, "");
    const draftPost = await readAdminMarkdownDraft(draftSlug);
    if (draftPost) return draftPost;
  }

  const sourceDir = getUatSourceDir(sourceSlug);
  let metadata: SourceMetadata;
  let rawMarkdown: string;

  try {
    [metadata, rawMarkdown] = await Promise.all([
      readJsonFile<SourceMetadata>(path.join(sourceDir, "metadata.json"), {}),
      readFile(path.join(sourceDir, "index.md"), "utf8"),
    ]);
  } catch (error) {
    const draftPost = await readAdminMarkdownDraft(sourceSlug);
    if (draftPost) {
      return {
        ...draftPost,
        sourceSlug,
      };
    }

    throw new Error(
      error instanceof Error
        ? `Không tìm thấy source UAT "${sourceSlug}". Cần có index.md trong ${sourceDir} hoặc trong ${path.join(
            adminMarkdownDraftsRoot,
            sourceSlug,
          )}. Chi tiết: ${error.message}`
        : `Không tìm thấy source UAT "${sourceSlug}".`,
    );
  }

  const markdown = rewriteLocalImagePaths(stripFrontmatter(rawMarkdown), sourceSlug);
  const slug = metadata.slug || sourceSlug;
  const coverImageUrl = toUatAssetUrl(
    sourceSlug,
    metadata.coverImage || "images/Thiet-ke-noi-that-chung-cu.jpg",
  );

  return {
    id: String(metadata.id || slug),
    sourceSlug,
    slug,
    title: metadata.title || slug,
    excerpt: metadata.excerpt || "",
    category: metadata.category || "",
    coverImageUrl,
    markdown,
    rawMarkdown,
    publishedAt: metadata.publishedAt,
    updatedAt: metadata.updatedAt,
    sourceUrl: metadata.sourceUrl,
    seoTitle: metadata.seoTitle,
    seoDescription: metadata.seoDescription,
    importedAt: new Date().toISOString(),
    imageCount: metadata.images?.length || 0,
  };
}

export async function readUatPosts(): Promise<UatPost[]> {
  assertUatLocalOnly();
  return readJsonFile<UatPost[]>(uatPostsFile, []);
}

async function readAdminMarkdownDraft(slug: string): Promise<UatPost | null> {
  assertUatLocalOnly();

  const draftDir = path.resolve(adminMarkdownDraftsRoot, slug);
  const safeRoot = path.resolve(adminMarkdownDraftsRoot);

  if (!draftDir.startsWith(`${safeRoot}${path.sep}`)) {
    return null;
  }

  try {
    const [metadata, rawMarkdown] = await Promise.all([
      readJsonFile<SourceMetadata>(path.join(draftDir, "metadata.json"), {}),
      readFile(path.join(draftDir, "index.md"), "utf8"),
    ]);
    const draftSlug = metadata.slug || slug;
    const markdown = stripFrontmatter(rawMarkdown);

    return {
      id: draftSlug,
      sourceSlug: `admin-md-drafts/${draftSlug}`,
      slug: draftSlug,
      title: metadata.title || draftSlug,
      excerpt: metadata.excerpt || metadata.seoDescription || "",
      category: metadata.category || metadata.targetType || "",
      coverImageUrl: metadata.coverImage || "",
      markdown,
      rawMarkdown,
      publishedAt: metadata.publishedAt,
      updatedAt: metadata.updatedAt,
      sourceUrl: metadata.sourceUrl,
      seoTitle: metadata.seoTitle,
      seoDescription: metadata.seoDescription,
      importedAt: metadata.updatedAt || new Date().toISOString(),
      imageCount: metadata.images?.length || 0,
    };
  } catch {
    return null;
  }
}

export async function getUatPostBySlug(slug: string): Promise<UatPost | null> {
  const posts = await readUatPosts();
  const savedPost = posts.find((post) => post.slug === slug);
  if (savedPost) return savedPost;

  return readAdminMarkdownDraft(slug);
}

export async function saveUatPost(post: UatPost): Promise<UatPost> {
  assertUatLocalOnly();
  const posts = await readUatPosts();
  const importedPost = {
    ...post,
    importedAt: new Date().toISOString(),
  };
  const nextPosts = [
    importedPost,
    ...posts.filter((item) => item.slug !== importedPost.slug),
  ];

  await mkdir(uatStoreRoot, { recursive: true });
  await writeFile(uatPostsFile, JSON.stringify(nextPosts, null, 2), "utf8");

  return importedPost;
}
