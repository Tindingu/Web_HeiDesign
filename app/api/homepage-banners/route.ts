import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  readHomepageBanners,
  saveHomepageBanners,
  clearHomepageBanners,
} from "@/lib/homepage-banner-storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  noStore();

  try {
    const items = await readHomepageBanners();
    return NextResponse.json(
      { ok: true, data: items },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("GET /api/homepage-banners error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải banners" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    await saveHomepageBanners(items);
    const savedItems = await readHomepageBanners();
    return NextResponse.json(
      { ok: true, data: savedItems },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("PUT /api/homepage-banners error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu banners";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400, headers: noCacheHeaders },
    );
  }
}

export async function DELETE() {
  noStore();

  try {
    await clearHomepageBanners();
    return NextResponse.json(
      { ok: true, data: [] },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("DELETE /api/homepage-banners error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể xóa banners" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}
