import { NextRequest, NextResponse } from "next/server";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
  updateBlogPost,
} from "@/lib/blog-post-storage";
import { defaultBlurDataURL } from "@/lib/constants";

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

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 },
    );
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

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deleted = await deleteBlogPost(id);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
