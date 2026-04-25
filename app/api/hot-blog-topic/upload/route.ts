import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Không tìm thấy file" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "Chỉ hỗ trợ file ảnh" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${Date.now()}-${randomUUID()}.${ext}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "upload",
      "hot-topics",
    );
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({
      ok: true,
      data: { url: `/upload/hot-topics/${fileName}` },
    });
  } catch (error) {
    console.error("POST /api/hot-blog-topic/upload error", error);
    return NextResponse.json(
      { ok: false, error: "Upload ảnh thất bại" },
      { status: 500 },
    );
  }
}
