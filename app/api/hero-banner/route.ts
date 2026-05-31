import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  readHeroBannerSettings,
  saveHeroBannerSettings,
} from "@/lib/hero-banner-storage";
import { revalidateHomepageContent } from "@/lib/revalidate-public-paths";

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
    const settings = await readHeroBannerSettings();
    return NextResponse.json(
      {
        ok: true,
        data: settings,
      },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("GET /api/hero-banner error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải cấu hình banner hero" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const subtitle = String(body.subtitle || "").trim();
    const ctaPrimary = String(body.ctaPrimary || "Đặt lịch tư vấn").trim();
    const ctaSecondary = String(body.ctaSecondary || "Xem dự án").trim();
    const rawUrls = Array.isArray(body.imageUrls) ? body.imageUrls : [];
    const imageUrls = rawUrls
      .map((u: unknown) => String(u ?? "").trim())
      .filter((u: string) => u.length > 0);

    if (!title || !subtitle) {
      return NextResponse.json(
        { ok: false, error: "Tiêu đề và mô tả không được để trống" },
        { status: 400, headers: noCacheHeaders },
      );
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng thêm ít nhất một ảnh banner" },
        { status: 400, headers: noCacheHeaders },
      );
    }

    const saved = await saveHeroBannerSettings({
      title,
      subtitle,
      ctaPrimary,
      ctaSecondary,
      imageUrls,
    });
    revalidateHomepageContent();

    return NextResponse.json(
      { ok: true, data: saved },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("PUT /api/hero-banner error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể lưu cấu hình banner hero" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}
