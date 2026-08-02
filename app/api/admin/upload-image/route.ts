import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

/**
 * POST /api/admin/upload-image
 * Upload image to Cloudinary (requires valid admin session)
 * Expects FormData with "file" field
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "HEI-design/uploads";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Upload to Cloudinary
    const cloudinaryFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    cloudinaryFormData.append("file", blob, file.name);
    cloudinaryFormData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET || "HEI-design",
    );
    cloudinaryFormData.append("folder", folder);

    const cloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dfazfoh2l";
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryFormData,
      },
    );

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.json();
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to upload image" },
        { status: 500 },
      );
    }

    const result = await cloudinaryResponse.json();

    return NextResponse.json({
      ok: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
