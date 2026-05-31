import { NextRequest, NextResponse } from "next/server";
import {
  deleteArticle,
  getArticleById,
  upsertArticleByTargetType,
  updateArticle,
} from "@/lib/article-storage";
import { revalidateArticleContent } from "@/lib/revalidate-public-paths";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const targetSection = String(data.targetSection || "").trim() as
      | "thiet-ke-noi-that"
      | "thi-cong-noi-that"
      | "du-an";
    const targetType = String(data.targetType || "").trim();

    if (!targetSection) {
      return NextResponse.json(
        { error: "targetSection is required" },
        { status: 400 },
      );
    }

    if (!targetType) {
      return NextResponse.json(
        { error: "targetType is required" },
        { status: 400 },
      );
    }

    const newArticle = await upsertArticleByTargetType(
      targetSection,
      targetType,
      {
        slug: data.slug,
        title: data.title,
        description: data.description,
        category: data.category,
        coverImageUrl: data.coverImageUrl,
        introContent: data.introContent,
        mainContent: data.mainContent,
      },
    );
    revalidateArticleContent(newArticle);

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    console.error("POST /api/articles error", error);
    const message =
      error instanceof Error ? error.message : "Failed to create article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const previousArticle = await getArticleById(parseInt(id));
    const updated = await updateArticle(parseInt(id), {
      slug: data.slug,
      targetSection: data.targetSection,
      targetType: data.targetType,
      title: data.title,
      description: data.description,
      category: data.category,
      coverImageUrl: data.coverImageUrl,
      introContent: data.introContent,
      mainContent: data.mainContent,
    });

    if (!updated) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidateArticleContent(updated, previousArticle);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/articles error", error);
    const message =
      error instanceof Error ? error.message : "Failed to update article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const previousArticle = await getArticleById(parseInt(id));
    const deleted = await deleteArticle(parseInt(id));

    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    revalidateArticleContent(previousArticle, previousArticle);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/articles error", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
