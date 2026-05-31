import { NextRequest, NextResponse } from "next/server";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
} from "@/lib/blog-post-storage";
import { defaultBlurDataURL } from "@/lib/constants";
import { revalidateBlogContent } from "@/lib/revalidate-public-paths";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.slug || !data.title || !data.category || !data.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existing = await getBlogPostBySlug(data.slug);
    if (existing) {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 409 });
    }

    const newPost = await createBlogPost({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt || "",
      category: data.category,
      content: data.content,
      coverImage: {
        url: data.coverImageUrl || "",
        alt: data.title,
        blurDataURL: defaultBlurDataURL,
      },
      publishedAt: data.publishedAt || new Date().toISOString(),
    });
    revalidateBlogContent(newPost);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create blog post";
    console.error("POST /api/blog-posts error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const previousPost = await getBlogPostById(id);

    const updated = await updateBlogPost(id, {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      content: data.content,
      coverImage: {
        url: data.coverImageUrl || "",
        alt: data.title,
        blurDataURL: defaultBlurDataURL,
      },
      publishedAt: data.publishedAt,
    });

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    revalidateBlogContent(updated, previousPost);
    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update blog post";
    console.error("PUT /api/blog-posts error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const previousPost = await getBlogPostById(id);
    const deleted = await deleteBlogPost(id);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    revalidateBlogContent(previousPost, previousPost);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete blog post";
    console.error("DELETE /api/blog-posts error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
