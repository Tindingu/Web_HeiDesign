import { NextRequest, NextResponse } from "next/server";
import {
  readHomepageVideos,
  saveHomepageVideos,
} from "@/lib/homepage-video-storage";

export async function GET() {
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
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    await saveHomepageVideos(items);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/video-section error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu playlist video";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
