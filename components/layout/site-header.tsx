"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const topCategories = [
  {
    label: "MẪU NHÀ ĐẸP",
    src: "/upload/iconheading/nha-dep.png",
    href: "/khong-gian/mau-nha-dep",
  },
  {
    label: "PHÒNG KHÁCH",
    src: "/upload/iconheading/phong-khach.png",
    href: "/khong-gian/phong-khach",
  },
  {
    label: "PHÒNG BẾP",
    src: "/upload/iconheading/phong-bep.png",
    href: "/khong-gian/phong-bep",
  },
  {
    label: "PHÒNG NGỦ",
    src: "/upload/iconheading/phong-ngu.png",
    href: "/khong-gian/phong-ngu",
  },
  {
    label: "PHÒNG TẮM",
    src: "/upload/iconheading/phong-tam.png",
    href: "/khong-gian/phong-tam",
  },
];

const defaultInteriorSubmenu = [
  {
    label: "Thiết kế nội thất biệt thự",
    href: "/thiet-ke-noi-that/biet-thu",
  },
  {
    label: "Thiết kế nội thất chung cư",
    href: "/thiet-ke-noi-that/chung-cu",
  },
  {
    label: "Thiết kế nội thất nhà phố",
    href: "/thiet-ke-noi-that/nha-pho",
  },
  {
    label: "Thiết kế nội thất penthouse, duplex",
    href: "/thiet-ke-noi-that/penthouse",
  },
  {
    label: "Thiết kế nội thất văn phòng",
    href: "/thiet-ke-noi-that/van-phong",
  },
  {
    label: "Thiết kế nội thất khách sạn",
    href: "/thiet-ke-noi-that/khach-san",
  },
  {
    label: "Thiết kế nội thất nhà hàng",
    href: "/thiet-ke-noi-that/nha-hang",
  },
  {
    label: "Thiết kế nội thất quán cafe",
    href: "/thiet-ke-noi-that/cafe",
  },
  {
    label: "Thiết kế nội thất showroom",
    href: "/thiet-ke-noi-that/showroom",
  },
];

const defaultConstructionSubmenu = [
  {
    label: "Thị công nội thất biệt thự",
    href: "/thi-cong-noi-that/biet-thu",
  },
  {
    label: "Thị công nội thất chung cư",
    href: "/thi-cong-noi-that/chung-cu",
  },
  {
    label: "Thị công nội thất nhà phố",
    href: "/thi-cong-noi-that/nha-pho",
  },
  {
    label: "Thị công nội thất văn phòng",
    href: "/thi-cong-noi-that/van-phong",
  },
];

const baseMenuItems = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Thiết Kế Nội Thất",
    href: "/thiet-ke-noi-that",
    submenu: defaultInteriorSubmenu,
  },
  {
    label: "Thị Công Nội Thất",
    href: "/thi-cong-noi-that",
    submenu: defaultConstructionSubmenu,
  },
  { label: "Dự án", href: "/du-an" },

  { label: "Kinh Nghiệm Hay", href: "/blog" },
  { label: "Liên hệ", href: "/lien-he" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
];

export function SiteHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interiorSubmenu, setInteriorSubmenu] = useState(
    defaultInteriorSubmenu,
  );
  const [constructionSubmenu, setConstructionSubmenu] = useState(
    defaultConstructionSubmenu,
  );
  const topCategoriesRef = useRef<HTMLDivElement>(null);
  const isDraggingTopRef = useRef(false);
  const topStartXRef = useRef(0);
  const topStartScrollLeftRef = useRef(0);

  useEffect(() => {
    setSearchKeyword(searchParams.get("s") || "");
  }, [searchParams]);

  const handleSearchSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    const keyword = searchKeyword.trim();
    if (!keyword) {
      router.push("/tim-kiem");
      return;
    }
    router.push(`/tim-kiem?s=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const response = await fetch("/api/article-targets", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok || !payload?.ok || !Array.isArray(payload.data)) {
          return;
        }

        const sectionMap = new Map<
          string,
          Array<{ label: string; href: string }>
        >();
        for (const section of payload.data) {
          if (!section?.code || !Array.isArray(section.types)) continue;
          sectionMap.set(
            section.code,
            section.types.map((type: { name: string; code: string }) => ({
              label: type.name,
              href: `/${section.code}/${type.code}`,
            })),
          );
        }

        const fromDbInterior = sectionMap.get("thiet-ke-noi-that") || [];
        const fromDbConstruction = sectionMap.get("thi-cong-noi-that") || [];

        if (fromDbInterior.length > 0) setInteriorSubmenu(fromDbInterior);
        if (fromDbConstruction.length > 0)
          setConstructionSubmenu(fromDbConstruction);
      } catch {
        // Keep fallback menu if API is unavailable.
      }
    };

    void loadTargets();
  }, []);

  const menuItems = useMemo(() => {
    return baseMenuItems.map((item) => {
      if (item.href === "/thiet-ke-noi-that") {
        return { ...item, submenu: interiorSubmenu };
      }
      if (item.href === "/thi-cong-noi-that") {
        return { ...item, submenu: constructionSubmenu };
      }
      return item;
    });
  }, [constructionSubmenu, interiorSubmenu]);

  const onTopCategoriesMouseDown: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    const rail = topCategoriesRef.current;
    if (!rail) return;
    isDraggingTopRef.current = true;
    topStartXRef.current = event.pageX - rail.offsetLeft;
    topStartScrollLeftRef.current = rail.scrollLeft;
  };

  const onTopCategoriesMouseMove: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (!isDraggingTopRef.current) return;
    const rail = topCategoriesRef.current;
    if (!rail) return;
    event.preventDefault();
    const x = event.pageX - rail.offsetLeft;
    const walk = (x - topStartXRef.current) * 1.2;
    rail.scrollLeft = topStartScrollLeftRef.current - walk;
  };

  const stopTopCategoriesDragging = () => {
    isDraggingTopRef.current = false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar: Logo + Search + Category Icons */}
      <Container>
        <div className="flex h-20 items-center justify-between gap-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex min-w-fit items-center gap-2">
            <Image
              src="/upload/logo/icep-logo.svg"
              alt="ICEP"
              width={120}
              height={120}
              priority
              className="h-12 w-auto"
            />
            {/* <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold tracking-wider">
                <span className="text-amber-600">HEI</span>
              </span>
              <span className="text-xs font-light text-gray-600">Design</span>
            </div> */}
          </Link>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-sm md:block lg:max-w-md">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn đang tìm gì?"
                className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-gray-400" />
              </button>
            </form>
          </div>

          {/* Category Icons - Horizontal */}
          <div
            ref={topCategoriesRef}
            className="hidden flex-1 items-center justify-center gap-4 overflow-x-auto lg:flex scrollbar-hide cursor-grab active:cursor-grabbing"
            onMouseDown={onTopCategoriesMouseDown}
            onMouseMove={onTopCategoriesMouseMove}
            onMouseLeave={stopTopCategoriesDragging}
            onMouseUp={stopTopCategoriesDragging}
          >
            {topCategories.map((cat) => {
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="group flex min-w-fit flex-col items-center gap-1 transition-colors hover:text-amber-600"
                >
                  <Image
                    src={cat.src}
                    alt={cat.label}
                    width={40}
                    height={40}
                    className="h-10 w-10 transition-transform group-hover:scale-110"
                  />
                  <span className="text-[8px] font-medium uppercase tracking-wide text-center whitespace-nowrap max-w-[60px]">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <button
              onClick={() => handleSearchSubmit()}
              className="rounded-full p-2 hover:bg-gray-100 md:hidden"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Main Navigation Menu */}
      <div className="border-t border-gray-100 bg-gray-50/30">
        <Container>
          <nav className="hidden flex-1 items-center justify-start gap-1 lg:flex py-3">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.submenu ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white hover:text-amber-600 whitespace-nowrap"
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </Link>
                    {/* Submenu Dropdown */}
                    <div className="absolute left-0 top-full hidden w-56 rounded-lg bg-white shadow-lg group-hover:block pt-2 z-50">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-amber-50 hover:text-amber-600 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white hover:text-amber-600 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </Container>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <Container>
            <nav className="space-y-1 py-4">
              {menuItems.map((item) => (
                <div key={item.href}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveSubmenu(
                            activeSubmenu === item.label ? null : item.label,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeSubmenu === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeSubmenu === item.label && (
                        <div className="space-y-1 pl-4">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-amber-600"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-amber-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
