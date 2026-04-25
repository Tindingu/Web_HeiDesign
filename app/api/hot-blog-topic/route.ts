import { NextRequest, NextResponse } from "next/server";
import { readBlogCategories } from "@/lib/taxonomy-storage";
import {
  clearHotBlogTopicSettings,
  readHotBlogTopicSettings,
  saveHotBlogTopicSettings,
} from "@/lib/hot-blog-topic-storage";
import { toCategorySlug } from "@/lib/post-category";

export async function GET() {
  try {
    const [settings, categories] = await Promise.all([
      readHotBlogTopicSettings(),
      readBlogCategories(),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        settings,
        availableTopics: categories.map((item) => ({
          label: item.name,
          slug: toCategorySlug(item.name),
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/hot-blog-topic error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể tải cấu hình chủ đề hot" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const topicSlug = String(body.topicSlug || "").trim();
    const topicLabel = String(body.topicLabel || "").trim();
    const rawUrls = Array.isArray(body.bannerImageUrls)
      ? body.bannerImageUrls
      : [];
    const bannerImageUrls = rawUrls
      .map((u: unknown) => String(u ?? "").trim())
      .filter((u: string) => u.length > 0);

    if (!topicSlug || !topicLabel) {
      return NextResponse.json(
        { ok: false, error: "Vui lòng chọn chủ đề" },
        { status: 400 },
      );
    }

    const saved = await saveHotBlogTopicSettings({
      topicSlug,
      topicLabel,
      bannerImageUrls,
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (error) {
    console.error("PUT /api/hot-blog-topic error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể lưu cấu hình chủ đề hot" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await clearHotBlogTopicSettings();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/hot-blog-topic error", error);
    return NextResponse.json(
      { ok: false, error: "Không thể xóa cấu hình" },
      { status: 500 },
    );
  }
}
