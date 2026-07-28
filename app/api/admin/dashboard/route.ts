import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { getAdminDashboardData } from "@/lib/admin-dashboard-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  noStore();

  try {
    const data = await getAdminDashboardData();
    return NextResponse.json(
      { ok: true, data },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Không thể đồng bộ dữ liệu dashboard",
      },
      {
        status: 500,
        headers: noCacheHeaders,
      },
    );
  }
}
