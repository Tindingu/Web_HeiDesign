import { readFile } from "fs/promises";
import path from "path";
import { NextRequest } from "next/server";
import {
  assertUatLocalOnly,
  getUatAssetFilePath,
} from "@/lib/uat-post-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const contentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { path?: string[] } },
) {
  try {
    assertUatLocalOnly();

    const parts = params.path || [];
    const [sourceSlug, ...assetParts] = parts;
    if (!sourceSlug || assetParts.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    const relativePath = assetParts.map(decodeURIComponent).join(path.sep);
    const filePath = getUatAssetFilePath(sourceSlug, relativePath);
    const body = await readFile(filePath);
    const contentType =
      contentTypes[path.extname(filePath).toLowerCase()] ||
      "application/octet-stream";

    return new Response(body, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
