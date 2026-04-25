"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FolderKanban,
  FileText,
  Newspaper,
  Tags,
  Images,
  Youtube,
  Flame,
  MessageSquareQuote,
} from "lucide-react";

type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: AdminNavItem[] = [
  { href: "/admin/projects", label: "Dự án", icon: FolderKanban },
  { href: "/admin/du-an", label: "Bài viết dự án", icon: FileText },
  { href: "/admin/kinh-nghiem", label: "Kinh nghiệm", icon: Newspaper },
  {
    href: "/admin/kien-truc-nha-pho",
    label: "Gallery kiến trúc",
    icon: Images,
  },
  { href: "/admin/video", label: "Video trang chủ", icon: Youtube },
  {
    href: "/admin/nhan-xet-khach-hang",
    label: "Nhận xét khách hàng",
    icon: MessageSquareQuote,
  },
  { href: "/admin/chu-de-hot", label: "Chủ đề hot", icon: Flame },
  { href: "/admin/categories", label: "Category & Style", icon: Tags },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-2 px-6 py-3">
        <div className="mr-2 hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 md:flex">
          <LayoutGrid className="h-3.5 w-3.5" />
          Admin Modules
        </div>
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
