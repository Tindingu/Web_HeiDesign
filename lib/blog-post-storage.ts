import fs from "fs/promises";
import path from "path";
import type { ImageAsset, Post } from "@/lib/strapi";

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

const blogPostsFile = path.join(process.cwd(), "data", "blog-posts.json");

async function ensureDataDir() {
  const dir = path.dirname(blogPostsFile);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory may already exist.
  }
}

export async function readBlogPosts(): Promise<BlogPostRecord[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(blogPostsFile, "utf-8");
    return JSON.parse(content) as BlogPostRecord[];
  } catch {
    return [];
  }
}

export async function writeBlogPosts(posts: BlogPostRecord[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(blogPostsFile, JSON.stringify(posts, null, 2), "utf-8");
}

export async function getBlogPostById(
  id: number,
): Promise<BlogPostRecord | null> {
  const posts = await readBlogPosts();
  return posts.find((post) => post.id === id) || null;
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRecord | null> {
  const posts = await readBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function createBlogPost(
  post: Omit<BlogPostRecord, "id" | "createdAt" | "updatedAt">,
): Promise<BlogPostRecord> {
  const posts = await readBlogPosts();
  const now = new Date().toISOString();

  const newPost: BlogPostRecord = {
    ...post,
    id: Math.max(0, ...posts.map((p) => p.id)) + 1,
    createdAt: now,
    updatedAt: now,
  };

  posts.push(newPost);
  await writeBlogPosts(posts);
  return newPost;
}

export async function updateBlogPost(
  id: number,
  updates: Partial<Omit<BlogPostRecord, "id" | "createdAt">>,
): Promise<BlogPostRecord | null> {
  const posts = await readBlogPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeBlogPosts(posts);
  return posts[index];
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const posts = await readBlogPosts();
  const filtered = posts.filter((post) => post.id !== id);

  if (filtered.length === posts.length) return false;

  await writeBlogPosts(filtered);
  return true;
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
