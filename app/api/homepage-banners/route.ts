import { NextRequest, NextResponse } from "next/server";
import {
  readHomepageBanners,
  readActiveHomepageBanners,
  saveHomepageBanners,
  clearHomepageBanners,
} from "@/lib/homepage-banner-storage";

export async function GET() {
  try {
    const items = await readHomepageBanners();
    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    console.error("GET /api/homepage-banners error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải banners" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    await saveHomepageBanners(items);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/homepage-banners error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu banners";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await clearHomepageBanners();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/homepage-banners error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể xóa banners" },
      { status: 500 },
    );
  }
}
