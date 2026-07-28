import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { toSlug } from "@/lib/article-path";
import {
  assertUatLocalOnly,
  readUatSourcePost,
  saveUatPost,
} from "@/lib/uat-post-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type MarkdownMetadata = {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
  sourceUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  targetSection?: string;
  targetType?: string;
};

const draftsRoot = path.join(
  process.cwd(),
  "icep-design-posts",
  "admin-md-drafts",
);

function parseFrontmatter(markdown: string): MarkdownMetadata {
  const normalized = markdown.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) return {};

  const endIndex = normalized.indexOf("\n---", 3);
  if (endIndex === -1) return {};

  const block = normalized.slice(3, endIndex).trim();
  const metadata: MarkdownMetadata = {};

  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1] as keyof MarkdownMetadata;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    metadata[key] = value;
  }

  return metadata;
}

function firstHeading(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || "";
}

function firstParagraph(markdown: string) {
  return (
    markdown
      .replace(/^---[\s\S]*?\n---/, "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith("#") && !line.startsWith("![")) ||
    ""
  );
}

function firstMarkdownImage(markdown: string) {
  return markdown.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/)?.[1];
}

function extractImageFiles(markdown: string) {
  return Array.from(
    markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g),
  ).map((match) => ({ file: match[1] }));
}

function resolveSafeDraftDir(slug: string) {
  const safeRoot = path.resolve(draftsRoot);
  const targetDir = path.resolve(safeRoot, slug);

  if (!targetDir.startsWith(`${safeRoot}${path.sep}`)) {
    throw new Error("Slug/folder UAT không hợp lệ.");
  }

  return targetDir;
}

function errorResponse(error: unknown, status = 500) {
  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "Không thể upload Markdown",
    },
    { status },
  );
}

export async function POST(request: NextRequest) {
  try {
    assertUatLocalOnly();

    const formData = await request.formData();
    const file = formData.get("file");
    const requestedSlug = String(formData.get("slug") || "").trim();

    if (!(file instanceof File)) {
      return errorResponse("Vui lòng chọn file Markdown .md", 400);
    }

    if (!file.name.toLowerCase().endsWith(".md")) {
      return errorResponse("File upload phải có định dạng .md", 400);
    }

    const markdown = await file.text();
    const metadata = parseFrontmatter(markdown);
    const title = metadata.title || firstHeading(markdown) || file.name.replace(/\.md$/i, "");
    const slug = toSlug(requestedSlug || metadata.slug || title);

    if (!slug) {
      return errorResponse("Không thể tạo slug từ file Markdown.", 400);
    }

    const draftDir = resolveSafeDraftDir(slug);
    const coverImage = metadata.coverImage || firstMarkdownImage(markdown) || "";
    const draftMetadata: MarkdownMetadata & {
      images: Array<{ file: string }>;
      updatedAt: string;
    } = {
      ...metadata,
      slug,
      title,
      excerpt: metadata.excerpt || metadata.seoDescription || firstParagraph(markdown),
      coverImage,
      images: extractImageFiles(markdown),
      updatedAt: new Date().toISOString(),
    };

    await mkdir(draftDir, { recursive: true });
    await Promise.all([
      writeFile(path.join(draftDir, "index.md"), markdown, "utf8"),
      writeFile(
        path.join(draftDir, "metadata.json"),
        JSON.stringify(draftMetadata, null, 2),
        "utf8",
      ),
    ]);

    const sourcePost = await readUatSourcePost(`admin-md-drafts/${slug}`);
    const savedPost = await saveUatPost(sourcePost);

    return NextResponse.json({
      ok: true,
      data: {
        post: savedPost,
        savedTo: path.join(draftDir, "index.md"),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
