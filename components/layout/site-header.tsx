"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interiorSubmenu, setInteriorSubmenu] = useState(
    defaultInteriorSubmenu,
  );
  const [constructionSubmenu, setConstructionSubmenu] = useState(
    defaultConstructionSubmenu,
  );
  const topCategoriesRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const isDraggingTopRef = useRef(false);
  const topStartXRef = useRef(0);
  const topStartScrollLeftRef = useRef(0);

  useEffect(() => {
    setSearchKeyword(searchParams.get("s") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    mobileSearchInputRef.current?.focus();
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    mobileSearchInputRef.current?.blur();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
    const keyword = searchKeyword.trim();
    if (!keyword) {
      router.push("/tim-kiem");
      return;
    }
    router.push(`/tim-kiem?s=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    setActiveSubmenu(null);
  }, [pathname, searchParams]);

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
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      {/* Top Bar: Logo + Search + Category Icons */}
      <Container>
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 py-2 sm:min-h-[5rem] sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <Image
              src="/upload/logo/HEI-logo.svg"
              alt="HEI"
              width={120}
              height={120}
              priority
              className="h-10 w-auto sm:h-12"
            />
            {/* <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold tracking-wider">
                <span className="text-amber-600">HEI</span>
              </span>
              <span className="text-xs font-light text-gray-600">Design</span>
            </div> */}
          </Link>

          {/* Search Bar */}
          <div className="hidden max-w-sm flex-1 md:block lg:max-w-md">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn đang tìm gì?"
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-[#1f4569] focus:ring-2 focus:ring-[#1f4569]/15"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4 text-slate-400" />
              </button>
            </form>
          </div>

          {/* Desktop Category Icons */}
          <div
            ref={topCategoriesRef}
            className="hidden flex-1 items-center justify-center gap-4 overflow-x-auto cursor-grab scrollbar-hide active:cursor-grabbing lg:flex"
            onMouseDown={onTopCategoriesMouseDown}
            onMouseMove={onTopCategoriesMouseMove}
            onMouseLeave={stopTopCategoriesDragging}
            onMouseUp={stopTopCategoriesDragging}
          >
            {topCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex min-w-fit flex-col items-center gap-1 transition-transform transition-colors hover:-translate-y-0.5 hover:text-[#1f4569]"
              >
                <Image
                  src={cat.src}
                  alt={cat.label}
                  width={40}
                  height={40}
                  className="h-10 w-10 transition-transform group-hover:scale-110"
                />
                <span className="max-w-[60px] whitespace-nowrap text-center text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Mobile Search */}
            <button
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="rounded-full border border-slate-200 bg-white p-2.5 shadow-sm transition hover:bg-slate-50 md:hidden"
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5 text-slate-600" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition hover:bg-slate-50 lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>

      <div className="border-t border-slate-200/70 bg-white/90 backdrop-blur md:hidden">
        <Container>
          <div
            ref={topCategoriesRef}
            className="-mx-4 flex gap-3 overflow-x-auto px-4 py-3 cursor-grab scrollbar-hide active:cursor-grabbing"
            onMouseDown={onTopCategoriesMouseDown}
            onMouseMove={onTopCategoriesMouseMove}
            onMouseLeave={stopTopCategoriesDragging}
            onMouseUp={stopTopCategoriesDragging}
          >
            {topCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#1f4569]/25 hover:bg-slate-50"
              >
                <Image
                  src={cat.src}
                  alt={cat.label}
                  width={32}
                  height={32}
                  className="h-8 w-8 transition-transform group-hover:scale-110"
                />
                <span className="text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-700">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Navigation Menu */}
      <div className="border-t border-slate-200/70 bg-slate-50/70">
        <Container>
          <nav className="hidden flex-1 items-center justify-center gap-2 py-3 lg:flex xl:gap-3">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.submenu ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:text-[#1f4569] hover:shadow-sm"
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </Link>
                    {/* Submenu Dropdown */}
                    <div className="absolute left-0 top-full z-50 hidden w-56 rounded-2xl border border-slate-200 bg-white/95 pt-2 shadow-xl backdrop-blur group-hover:block">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1f4569] first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-white hover:text-[#1f4569] hover:shadow-sm"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </Container>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 backdrop-blur md:hidden">
          <Container>
            <form className="relative py-2.5" onSubmit={handleSearchSubmit}>
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn đang tìm gì?"
                className="h-10 w-full max-w-full rounded-full border border-slate-200 bg-white py-2 pl-3.5 pr-11 text-base text-slate-800 outline-none transition-all duration-200 focus:border-[#1f4569] focus:ring-2 focus:ring-[#1f4569]/15"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition-colors hover:text-[#1f4569]"
                aria-label="Tìm kiếm"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </Container>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 backdrop-blur lg:hidden">
          <Container>
            <div className="py-4">
              <nav className="space-y-1">
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
                          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
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
                                className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1f4569]"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setActiveSubmenu(null);
                                }}
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
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1f4569]"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setActiveSubmenu(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
