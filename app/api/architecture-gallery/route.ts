import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import {
  readArchitectureGallery,
  readProjectLinkOptions,
  saveArchitectureGalleryForStyle,
} from "@/lib/architecture-gallery-storage";
import { readProjectStyles } from "@/lib/taxonomy-storage";
import { ARCHITECTURE_GALLERY_SLOTS } from "@/lib/architecture-gallery";
import { revalidateArchitectureGalleryContent } from "@/lib/revalidate-public-paths";

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

    return NextResponse.json(
      {
        ok: true,
        data: {
          styles,
          projects,
          slots: ARCHITECTURE_GALLERY_SLOTS,
          grouped,
        },
      },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("GET /api/architecture-gallery error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load architecture gallery";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: noCacheHeaders },
    );
  }
}

export async function PUT(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const styleId = Number(body.styleId);
    const entries = Array.isArray(body.entries) ? body.entries : [];

    if (!styleId) {
      return NextResponse.json(
        { ok: false, error: "styleId is required" },
        { status: 400, headers: noCacheHeaders },
      );
    }

    await saveArchitectureGalleryForStyle(styleId, entries);
    const savedItems = (await readArchitectureGallery()).filter(
      (item) => item.styleId === styleId,
    );
    revalidateArchitectureGalleryContent();

    return NextResponse.json(
      {
        ok: true,
        message: "Cập nhật gallery thành công",
        data: savedItems,
      },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("PUT /api/architecture-gallery error", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to save architecture gallery";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: noCacheHeaders },
    );
  }
}
