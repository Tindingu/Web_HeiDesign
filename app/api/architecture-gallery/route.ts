import { NextRequest, NextResponse } from "next/server";
import {
  readArchitectureGallery,
  readProjectLinkOptions,
  saveArchitectureGalleryForStyle,
} from "@/lib/architecture-gallery-storage";
import { readProjectStyles } from "@/lib/taxonomy-storage";
import { ARCHITECTURE_GALLERY_SLOTS } from "@/lib/architecture-gallery";

export async function GET() {
  try {
    const [styles, projects, items] = await Promise.all([
      readProjectStyles(),
      readProjectLinkOptions(),
      readArchitectureGallery(),
    ]);

    const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
      const key = String(item.styleId);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return NextResponse.json({
      ok: true,
      data: {
        styles,
        projects,
        slots: ARCHITECTURE_GALLERY_SLOTS,
        grouped,
      },
    });
  } catch (error) {
    console.error("GET /api/architecture-gallery error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load architecture gallery";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const styleId = Number(body.styleId);
    const entries = Array.isArray(body.entries) ? body.entries : [];

    if (!styleId) {
      return NextResponse.json(
        { ok: false, error: "styleId is required" },
        { status: 400 },
      );
    }

    await saveArchitectureGalleryForStyle(styleId, entries);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/architecture-gallery error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to save architecture gallery";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
