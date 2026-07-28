import { NextRequest, NextResponse } from "next/server";
import {
  UAT_DEFAULT_SOURCE_SLUG,
  readUatPosts,
  readUatSourcePost,
  saveUatPost,
} from "@/lib/uat-post-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function errorResponse(error: unknown, status = 500) {
  return NextResponse.json(
    {
      ok: false,
      error: error instanceof Error ? error.message : "UAT local error",
    },
    { status },
  );
}

export async function GET() {
  try {
    const [sourcePost, posts] = await Promise.all([
      readUatSourcePost(UAT_DEFAULT_SOURCE_SLUG),
      readUatPosts(),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        sourcePost,
        posts,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const sourceSlug =
      typeof body.sourceSlug === "string" && body.sourceSlug.trim()
        ? body.sourceSlug.trim()
        : UAT_DEFAULT_SOURCE_SLUG;
    const sourcePost = await readUatSourcePost(sourceSlug);
    const savedPost = await saveUatPost(sourcePost);

    return NextResponse.json({
      ok: true,
      data: savedPost,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
