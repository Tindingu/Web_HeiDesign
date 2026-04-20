import { NextResponse } from "next/server";
import { testDbConnection } from "@/lib/db/neon";

export async function GET() {
  try {
    const data = await testDbConnection();
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    );
  }
}
