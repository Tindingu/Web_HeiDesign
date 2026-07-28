import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type CloudinaryResource = {
  asset_id?: string;
  public_id: string;
  secure_url: string;
  format?: string;
  filename?: string;
  original_filename?: string;
  display_name?: string;
  asset_folder?: string;
  folder?: string;
};

function noCacheHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}

function getCloudinaryConfig() {
  const cloudName =
    process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY;
  const apiSecret =
    process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary env. Please set CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET.",
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function authHeader(apiKey: string, apiSecret: string) {
  return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;
}

function normalizeFolder(folder: string) {
  return folder
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\\/g, "/");
}

async function searchByFolder(folder: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader(apiKey, apiSecret),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: `resource_type:image AND folder="${folder}"`,
          max_results: 500,
          next_cursor: nextCursor,
          with_field: ["context", "metadata"],
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudinary Search API failed: ${text}`);
    }

    const payload = await response.json();
    resources.push(...((payload.resources || []) as CloudinaryResource[]));
    nextCursor = payload.next_cursor;
  } while (nextCursor);

  return resources;
}

async function listByPrefix(folder: string) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const resources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;
  const prefix = `${folder}/`;

  do {
    const params = new URLSearchParams({
      prefix,
      max_results: "500",
    });
    if (nextCursor) params.set("next_cursor", nextCursor);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${params}`,
      {
        headers: {
          Authorization: authHeader(apiKey, apiSecret),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Cloudinary Admin API failed: ${text}`);
    }

    const payload = await response.json();
    resources.push(...((payload.resources || []) as CloudinaryResource[]));
    nextCursor = payload.next_cursor;
  } while (nextCursor);

  return resources.filter((resource) => {
    const publicFolder = resource.public_id.split("/").slice(0, -1).join("/");
    return publicFolder === folder;
  });
}

export async function POST(request: NextRequest) {
  noStore();

  try {
    const body = await request.json();
    const folder = normalizeFolder(String(body.folder || ""));

    if (!folder) {
      return NextResponse.json(
        { ok: false, error: "folder is required" },
        { status: 400, headers: noCacheHeaders() },
      );
    }

    let resources: CloudinaryResource[] = [];
    try {
      resources = await searchByFolder(folder);
    } catch {
      resources = await listByPrefix(folder);
    }

    return NextResponse.json(
      {
        ok: true,
        data: resources.map((resource) => ({
          assetId: resource.asset_id || "",
          publicId: resource.public_id,
          secureUrl: resource.secure_url,
          format: resource.format || "",
          filename: resource.filename || "",
          originalFilename: resource.original_filename || "",
          displayName: resource.display_name || "",
          folder: resource.asset_folder || resource.folder || folder,
        })),
      },
      { headers: noCacheHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Cloudinary assets",
      },
      { status: 500, headers: noCacheHeaders() },
    );
  }
}
