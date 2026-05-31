import { NextRequest, NextResponse } from "next/server";
import {
  type ArticleTypeItem,
  type TaxonomyItem,
  createBlogCategory,
  createProjectCategory,
  createProjectStyle,
  createArticleType,
  deleteArticleType,
  deleteBlogCategory,
  deleteProjectCategory,
  deleteProjectStyle,
  readArticleSections,
  readArticleTypes,
  readBlogCategories,
  readProjectCategories,
  readProjectStyles,
  updateArticleType,
  updateBlogCategory,
  updateProjectCategory,
  updateProjectStyle,
} from "@/lib/taxonomy-storage";
import { revalidateTaxonomyContent } from "@/lib/revalidate-public-paths";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TaxonomyKind =
  | "blog-category"
  | "project-category"
  | "project-style"
  | "article-type";

function parseKind(value: string | null): TaxonomyKind | null {
  if (value === "blog-category") return value;
  if (value === "project-category") return value;
  if (value === "project-style") return value;
  if (value === "article-type") return value;
  return null;
}

async function findTaxonomyItem(kind: TaxonomyKind, id: number) {
  if (kind === "blog-category") {
    return (await readBlogCategories()).find((item) => item.id === id) ?? null;
  }
  if (kind === "project-category") {
    return (await readProjectCategories()).find((item) => item.id === id) ?? null;
  }
  if (kind === "project-style") {
    return (await readProjectStyles()).find((item) => item.id === id) ?? null;
  }
  return (await readArticleTypes()).find((item) => item.id === id) ?? null;
}

function revalidateCreatedTaxonomy(
  kind: TaxonomyKind,
  item: TaxonomyItem | ArticleTypeItem,
) {
  revalidateTaxonomyContent(kind, item);
}

function revalidateUpdatedTaxonomy(
  kind: TaxonomyKind,
  item: TaxonomyItem | ArticleTypeItem,
  previousItem: TaxonomyItem | ArticleTypeItem | null,
) {
  revalidateTaxonomyContent(kind, item, previousItem);
}

function revalidateDeletedTaxonomy(
  kind: TaxonomyKind,
  previousItem: TaxonomyItem | ArticleTypeItem | null,
) {
  revalidateTaxonomyContent(kind, previousItem, previousItem);
}

export async function GET() {
  try {
    const [
      blogCategories,
      projectCategories,
      projectStyles,
      articleSections,
      articleTypes,
    ] = await Promise.all([
      readBlogCategories(),
      readProjectCategories(),
      readProjectStyles(),
      readArticleSections(),
      readArticleTypes(),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        blogCategories,
        projectCategories,
        projectStyles,
        articleSections,
        articleTypes,
      },
    });
  } catch (error) {
    console.error("GET /api/taxonomies error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch taxonomies" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const kind = parseKind(body.kind);
    if (!kind) {
      return NextResponse.json(
        { ok: false, error: "Invalid taxonomy kind" },
        { status: 400 },
      );
    }

    if (kind === "blog-category") {
      if (!body.name) {
        return NextResponse.json(
          { ok: false, error: "name is required" },
          { status: 400 },
        );
      }
      const item = await createBlogCategory(String(body.name));
      revalidateCreatedTaxonomy(kind, item);
      return NextResponse.json({ ok: true, data: item }, { status: 201 });
    }

    if (kind === "project-category") {
      if (!body.name) {
        return NextResponse.json(
          { ok: false, error: "name is required" },
          { status: 400 },
        );
      }
      const item = await createProjectCategory(String(body.name));
      revalidateCreatedTaxonomy(kind, item);
      return NextResponse.json({ ok: true, data: item }, { status: 201 });
    }

    if (kind === "project-style") {
      if (!body.name) {
        return NextResponse.json(
          { ok: false, error: "name is required" },
          { status: 400 },
        );
      }
      const item = await createProjectStyle(String(body.name));
      revalidateCreatedTaxonomy(kind, item);
      return NextResponse.json({ ok: true, data: item }, { status: 201 });
    }

    if (!body.name || !body.sectionId) {
      return NextResponse.json(
        { ok: false, error: "name and sectionId are required" },
        { status: 400 },
      );
    }

    const item = await createArticleType({
      name: String(body.name),
      code: body.code ? String(body.code) : undefined,
      sectionId: Number(body.sectionId),
    });
    revalidateCreatedTaxonomy(kind, item);
    return NextResponse.json({ ok: true, data: item }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create taxonomy";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const kind = parseKind(body.kind);
    const id = Number(body.id);

    if (!kind || !id) {
      return NextResponse.json(
        { ok: false, error: "kind and id are required" },
        { status: 400 },
      );
    }

    const previousItem = await findTaxonomyItem(kind, id);

    if (kind === "blog-category") {
      const updated = await updateBlogCategory(id, String(body.name || ""));
      if (!updated) {
        return NextResponse.json(
          { ok: false, error: "Not found" },
          { status: 404 },
        );
      }
      revalidateUpdatedTaxonomy(kind, updated, previousItem);
      return NextResponse.json({ ok: true, data: updated });
    }

    if (kind === "project-category") {
      const updated = await updateProjectCategory(id, String(body.name || ""));
      if (!updated) {
        return NextResponse.json(
          { ok: false, error: "Not found" },
          { status: 404 },
        );
      }
      revalidateUpdatedTaxonomy(kind, updated, previousItem);
      return NextResponse.json({ ok: true, data: updated });
    }

    if (kind === "project-style") {
      const updated = await updateProjectStyle(id, String(body.name || ""));
      if (!updated) {
        return NextResponse.json(
          { ok: false, error: "Not found" },
          { status: 404 },
        );
      }
      revalidateUpdatedTaxonomy(kind, updated, previousItem);
      return NextResponse.json({ ok: true, data: updated });
    }

    const updated = await updateArticleType(id, {
      name: String(body.name || ""),
      code: body.code ? String(body.code) : undefined,
      sectionId: Number(body.sectionId),
    });

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 },
      );
    }

    revalidateUpdatedTaxonomy(kind, updated, previousItem);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update taxonomy";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const kind = parseKind(search.get("kind"));
    const id = Number(search.get("id"));

    if (!kind || !id) {
      return NextResponse.json(
        { ok: false, error: "kind and id are required" },
        { status: 400 },
      );
    }

    const previousItem = await findTaxonomyItem(kind, id);

    let deleted = false;
    if (kind === "blog-category") deleted = await deleteBlogCategory(id);
    if (kind === "project-category") deleted = await deleteProjectCategory(id);
    if (kind === "project-style") deleted = await deleteProjectStyle(id);
    if (kind === "article-type") deleted = await deleteArticleType(id);

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 },
      );
    }

    revalidateDeletedTaxonomy(kind, previousItem);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete taxonomy";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
