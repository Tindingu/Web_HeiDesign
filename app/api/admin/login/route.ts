import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionValue,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  let username = "";
  let password = "";

  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    username = typeof body?.username === "string" ? body.username : "";
    password = typeof body?.password === "string" ? body.password : "";
  } else {
    const formData = await request.formData();
    username = String(formData.get("username") || "");
    password = String(formData.get("password") || "");
  }

  if (!validateAdminCredentials(username.trim(), password)) {
    return NextResponse.json(
      { error: "Sai tài khoản hoặc mật khẩu." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: getAdminSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
