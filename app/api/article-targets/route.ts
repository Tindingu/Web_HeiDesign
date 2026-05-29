import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { readArticleSections, readArticleTypes } from "@/lib/taxonomy-storage";

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
    const [sections, types] = await Promise.all([
      readArticleSections(),
      readArticleTypes(),
    ]);

    const grouped = sections.map((section) => ({
      id: section.id,
      name: section.name,
      code: section.code,
      types: types
        .filter((type) => type.sectionId === section.id)
        .map((type) => ({
          id: type.id,
          name: type.name,
          code: type.code,
        })),
    }));

    return NextResponse.json(
      { ok: true, data: grouped },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    console.error("GET /api/article-targets error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch article targets" },
      { status: 500, headers: noCacheHeaders },
    );
  }
}
