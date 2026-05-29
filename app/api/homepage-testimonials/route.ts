import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  readHomepageTestimonials,
  saveHomepageTestimonials,
} from "@/lib/homepage-testimonial-storage";

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
    const items = await readHomepageTestimonials();
    return NextResponse.json(
      { ok: true, data: items },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("GET /api/homepage-testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải nhận xét khách hàng" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    await saveHomepageTestimonials(items);

    const savedItems = await readHomepageTestimonials();
    return NextResponse.json(
      { ok: true, data: savedItems },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("PUT /api/homepage-testimonials error", error);
    const message =
      error instanceof Error ? error.message : "Không thể lưu nhận xét";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400, headers: noCacheHeaders },
    );
  }
}
