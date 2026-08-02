import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  readHomepageVideos,
  saveHomepageVideos,
} from "@/lib/homepage-video-storage";
import { revalidateHomepageContent } from "@/lib/revalidate-public-paths";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  noStore();

  try {
    const items = await readHomepageVideos();
    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    console.error("GET /api/video-section error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải danh sách video" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const shortItems = Array.isArray(body.shortItems) ? body.shortItems : [];

    await saveHomepageVideos(items, shortItems);
    revalidateHomepageContent();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/video-section error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu playlist video";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
