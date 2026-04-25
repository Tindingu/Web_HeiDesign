import { NextRequest, NextResponse } from "next/server";
import {
  readHomepageTestimonials,
  saveHomepageTestimonials,
} from "@/lib/homepage-testimonial-storage";

export async function GET() {
  try {
    const items = await readHomepageTestimonials();
    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    console.error("GET /api/homepage-testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải nhận xét khách hàng" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    await saveHomepageTestimonials(items);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/homepage-testimonials error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu nhận xét";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
