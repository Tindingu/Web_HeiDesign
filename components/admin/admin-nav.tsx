"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Flame,
  FolderKanban,
  Gauge,
  Home,
  Images,
  LayoutGrid,
  Link2,
  Maximize2,
  MessageSquareQuote,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Tags,
  Youtube,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

type AdminNavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: AdminNavItem[] = [
  {
    href: "/admin/home",
    label: "Dashboard",
    description: "Tổng quan toàn website",
    icon: Gauge,
  },
  {
    href: "/admin/banner-trang-chu",
    label: "Banner trang chủ",
    description: "Quản lý banner hero",
    icon: Maximize2,
  },
  {
    href: "/admin/projects",
    label: "Dự án",
    description: "Hồ sơ dự án thi công",
    icon: FolderKanban,
  },
  {
    href: "/admin/du-an",
    label: "Bài viết dự án",
    description: "Bài SEO theo danh mục",
    icon: FileText,
  },
  {
    href: "/admin/kinh-nghiem",
    label: "Kinh nghiệm",
    description: "Bài blog kinh nghiệm",
    icon: Newspaper,
  },
  {
    href: "/admin/kien-truc-nha-pho",
    label: "Gallery kiến trúc",
    description: "Ảnh kiến trúc nhà phố",
    icon: Images,
  },
  {
    href: "/admin/video",
    label: "Video trang chủ",
    description: "YouTube và short video",
    icon: Youtube,
  },
  {
    href: "/admin/nhan-xet-khach-hang",
    label: "Nhận xét khách hàng",
    description: "Feedback hiển thị homepage",
    icon: MessageSquareQuote,
  },
  {
    href: "/admin/chu-de-hot",
    label: "Chủ đề hot",
    description: "Topic nổi bật ở trang chủ",
    icon: Flame,
  },
  {
    href: "/admin/categories",
    label: "Category & Style",
    description: "Taxonomy dự án/blog",
    icon: Tags,
  },
  {
    href: "/admin/cloudinary-md-tool",
    label: "Cloudinary MD",
    description: "Replace URL ảnh Markdown",
    icon: Link2,
  },
];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

export function AdminNav({
  collapsed,
  expanded,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: {
  collapsed: boolean;
  expanded: boolean;
  onToggle: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed inset-y-0 left-0 z-40 hidden shrink-0 overflow-y-auto overflow-x-hidden border-r border-slate-200 bg-white/96 shadow-[12px_0_30px_rgba(15,23,42,0.06)] backdrop-blur [scrollbar-width:none] transition-[width] duration-300 ease-out [&::-webkit-scrollbar]:hidden lg:block ${
        expanded ? "w-[292px]" : "w-[86px]"
      }`}
    >
      <div className="flex min-h-screen flex-col">
        <div className="flex h-[86px] shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-amber-300 shadow-lg shadow-slate-950/10">
              <LayoutGrid className="h-5 w-5" />
            </div> */}
            <div
              className={`min-w-0 transition-all duration-300 ease-out ${
                expanded
                  ? "w-40 translate-x-0 opacity-100"
                  : "pointer-events-none w-0 translate-x-3 opacity-0"
              }`}
            >
              <p className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Admin
              </p>
              <p className="truncate text-sm font-bold text-slate-950">
                Modules
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 ${
              expanded ? "opacity-100" : "mx-auto"
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={expanded ? undefined : item.label}
                className={`group flex h-[50px] items-center   px-3 text-sm transition duration-200 ${
                  expanded ? "gap-3" : "justify-center gap-0"
                } ${
                  active
                    ? "border-amber-200 bg-amber-50 text-amber-800 shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                    active
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span
                  className={`min-w-0 overflow-hidden transition-all duration-300 ease-out ${
                    expanded
                      ? "w-48 translate-x-0 opacity-100"
                      : "pointer-events-none w-0 translate-x-3 opacity-0"
                  }`}
                >
                  <span className="block truncate font-semibold">
                    {item.label}
                  </span>
                  {/* <span className="block truncate text-xs text-slate-400">
                    {item.description}
                  </span> */}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-200 p-3">
          <div className="space-y-2">
            <Link
              href="/"
              title={expanded ? undefined : "Về trang chủ"}
              className={`flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 ${
                expanded ? "justify-start gap-3" : "justify-center"
              }`}
            >
              <Home className="h-4 w-4 shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  expanded ? "w-36 opacity-100" : "w-0 opacity-0"
                }`}
              >
                Về trang chủ
              </span>
            </Link>

            <LogoutButton
              iconOnly={!expanded}
              className={`h-11 rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm transition hover:bg-slate-800 hover:text-white ${
                expanded ? "w-full justify-start px-4" : "w-full px-0"
              }`}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
