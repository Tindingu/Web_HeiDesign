import { NextRequest, NextResponse } from "next/server";
import {
  readHeroBannerSettings,
  saveHeroBannerSettings,
} from "@/lib/hero-banner-storage";

export async function GET() {
  try {
    const settings = await readHeroBannerSettings();
    return NextResponse.json({
      ok: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET /api/hero-banner error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải cấu hình banner hero" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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
        { status: 400 },
      );
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng thêm ít nhất một ảnh banner" },
        { status: 400 },
      );
    }

    const saved = await saveHeroBannerSettings({
      title,
      subtitle,
      ctaPrimary,
      ctaSecondary,
      imageUrls,
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error("PUT /api/hero-banner error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể lưu cấu hình banner hero" },
      { status: 500 },
    );
  }
}
