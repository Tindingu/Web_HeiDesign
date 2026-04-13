import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Quản Lý Admin</h1>
          <Link href="/">
            <Button variant="outline">← Về Trang Chủ</Button>
          </Link>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex gap-4">
          <Link href="/admin/projects">
            <Button variant={getActive("/admin/projects")}>
              Quản Lý Dự Án
            </Button>
          </Link>
          <Link href="/admin/du-an">
            <Button variant={getActive("/admin/du-an")}>
              Quản Lý Bài Viết
            </Button>
          </Link>
          <Link href="/admin/kinh-nghiem">
            <Button variant={getActive("/admin/kinh-nghiem")}>
              Quản Lý Kinh Nghiệm
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}

// Helper for active state (client-side would be better)
function getActive(path: string) {
  return "outline";
}
