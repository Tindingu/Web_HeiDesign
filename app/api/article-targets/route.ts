import { NextResponse } from "next/server";
import { readArticleSections, readArticleTypes } from "@/lib/taxonomy-storage";

export async function GET() {
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

    return NextResponse.json({ ok: true, data: grouped });
  } catch (error) {
    console.error("GET /api/article-targets error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch article targets" },
      { status: 500 },
    );
  }
}
