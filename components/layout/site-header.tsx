"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Search, Menu, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
  description?: string;
  submenu?: MenuItem[];
};

const topCategories = [
  {
    label: "MẪU NHÀ ĐẸP",
    src: "/upload/iconheading/nha-dep.svg",
    href: "/khong-gian/mau-nha-dep",
  },
  {
    label: "PHÒNG KHÁCH",
    src: "/upload/iconheading/phong-khach.svg",
    href: "/khong-gian/phong-khach",
  },
  {
    label: "PHÒNG BẾP",
    src: "/upload/iconheading/phong-bep.svg",
    href: "/khong-gian/phong-bep",
  },
  {
    label: "PHÒNG NGỦ",
    src: "/upload/iconheading/phong-ngu.svg",
    href: "/khong-gian/phong-ngu",
  },
  {
    label: "PHÒNG TẮM",
    src: "/upload/iconheading/phong-tam.svg",
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
    label: "Thi công nội thất biệt thự",
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

const designUtilitySubmenu: MenuItem[] = [
  {
    label: "Phối màu nội thất",
    href: "/phoimau-bep",
    description: "Thử màu và vật liệu cho từng không gian",
    submenu: [
      {
        label: "Phối màu phòng bếp",
        href: "/phoimau-bep",
        description: "Demo đã hoạt động",
      },
      {
        label: "Phối màu phòng khách",
        href: "/phoimau-phong-khach",
        description: "Đang phát triển",
      },
      {
        label: "Phối màu phòng ngủ",
        href: "/phoimau-phong-ngu",
        description: "Đang phát triển",
      },
    ],
  },
  {
    label: "Thước Lỗ Ban",
    href: "/thuoc-lo-ban",
    description: "Tra cứu kích thước phong thủy",
  },
   {
    label: "Báo giá",
    href: "/bao-gia",
    description: "Tra cứu báo giá dịch vụ",
  }
];

const baseMenuItems: MenuItem[] = [
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
  {
    label: "Tiện ích thiết kế",
    href: "/phoimau-bep",
    submenu: designUtilitySubmenu,
  },
  { label: "Liên hệ", href: "/lien-he" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isProjectPage = pathname?.startsWith("/du-an");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState<string | null>(
    null,
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [interiorSubmenu, setInteriorSubmenu] = useState<MenuItem[]>(
    defaultInteriorSubmenu,
  );
  const [constructionSubmenu, setConstructionSubmenu] = useState<MenuItem[]>(
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
    setActiveNestedSubmenu(null);
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
    setActiveNestedSubmenu(null);
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

        const sectionMap = new Map<string, MenuItem[]>();
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

  const renderDesktopSubmenu = (item: MenuItem) => {
    if (!item.submenu) return null;

    if (item.label !== "Tiện ích thiết kế") {
      return (
        <div className="absolute left-0 top-full z-50 hidden w-60 rounded-[1.15rem] border border-[#D8C3A5]/70 bg-[#FBF6F2] p-2 shadow-[0_18px_45px_rgba(31,31,31,0.12)] backdrop-blur group-hover:block">
          {item.submenu.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-white hover:text-[#B88732]"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      );
    }

    return (
      <div className="absolute left-0 top-full z-50 hidden w-72 rounded-[1.15rem] border border-[#D8C3A5]/70 bg-[#FBF6F2] p-2 shadow-[0_18px_45px_rgba(31,31,31,0.12)] backdrop-blur group-hover:block">
        {item.submenu.map((sub) =>
          sub.submenu ? (
            <div key={sub.href} className="group/nested relative after:absolute after:left-full after:top-0 after:h-full after:w-3">
              <Link
                href={sub.href}
                className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-white hover:text-[#B88732]"
              >
                <span>{sub.label}</span>
                <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-[#B88732]" />
              </Link>

              <div className="absolute left-[calc(100%+0.5rem)] top-0 z-50 hidden w-60 rounded-[1.15rem] border border-[#D8C3A5]/70 bg-[#FBF6F2] p-2 shadow-[0_18px_45px_rgba(31,31,31,0.12)] backdrop-blur group-hover/nested:block">
                {sub.submenu.map((nested) => (
                  <Link
                    key={nested.href}
                    href={nested.href}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-white hover:text-[#B88732]"
                  >
                    {nested.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={sub.href}
              href={sub.href}
              className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-white hover:text-[#B88732]"
            >
              {sub.label}
            </Link>
          ),
        )}
      </div>
    );
  };

  return (
    <header
      className={`z-50 border-b border-[#D8C3A5]/80 border-t border-t-[#C8922E]/70 bg-[#FBF6F2] shadow-[0_10px_28px_rgba(31,31,31,0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#FBF6F2] ${
        isProjectPage ? "relative" : "sticky top-0"
      }`}
    >
      {/* Top Bar: Logo + Search + Category Icons */}
      <Container className="max-w-[88rem]">
        <div className="flex min-h-[6.25rem] items-center justify-between gap-5 py-3 sm:min-h-[6.5rem] sm:gap-7 lg:gap-9">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 pr-2">
            <Image
              src="/upload/logo/hei-logo.svg"
              alt="HEI"
              width={120}
              height={120}
              priority
              className="h-12 w-auto sm:h-14 lg:h-[3.75rem]"
            />
            {/* <div className="hidden flex-col md:flex">
              <span className="text-xl font-bold tracking-wider">
                <span className="text-amber-600">HEI</span>
              </span>
              <span className="text-xs font-light text-gray-600">Design</span>
            </div> */}
          </Link>

          {/* Search Bar */}
          <div className="hidden max-w-sm flex-[0.9_1_20rem] md:block lg:max-w-[32rem]">
            <form className="relative" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn đang tìm gì?"
                className="h-12 w-full rounded-full border border-[#D8C3A5] bg-white/80 pl-5 pr-12 text-[15px] font-medium text-[#1F1F1F] outline-none transition-all placeholder:text-[#7B6B57] focus:border-[#C8922E] focus:bg-white focus:ring-2 focus:ring-[#C8922E]/15"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 transition-colors hover:bg-[#FBF6F2]"
                aria-label="TÃ¬m kiáº¿m"
              >
                <Search className="h-4 w-4 text-[#B88732]" />
              </button>
            </form>
          </div>

          {/* Desktop Category Icons */}
          <div
            ref={topCategoriesRef}
            className="hidden min-w-0 flex-[1.35_1_33rem] cursor-grab items-center justify-center gap-3 overflow-x-auto scrollbar-hide active:cursor-grabbing lg:flex xl:gap-4"
            onMouseDown={onTopCategoriesMouseDown}
            onMouseMove={onTopCategoriesMouseMove}
            onMouseLeave={stopTopCategoriesDragging}
            onMouseUp={stopTopCategoriesDragging}
          >
            {topCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex min-w-[5.15rem] flex-col items-center justify-start gap-2 rounded-xl px-1 py-1.5 text-center transition-all hover:-translate-y-0.5"
              >
                <Image
                  src={cat.src}
                  alt={cat.label}
                  width={60}
                  height={60}
                  className="h-14 w-14 bg-transparent object-contain transition-transform group-hover:scale-105 xl:h-16 xl:w-16"
                />
                <span className="whitespace-nowrap text-center text-[11px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#2A2A2A] transition-colors group-hover:text-[#B88732]">
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
              className="rounded-full border border-[#D8C3A5] bg-white/80 p-2.5 shadow-sm transition hover:border-[#C8922E] hover:bg-white md:hidden"
              aria-label="Tìm kiếm"
            >
              <Search className="h-5 w-5 text-[#B88732]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }}
              className="rounded-full border border-[#D8C3A5] bg-white/80 p-2.5 shadow-sm transition hover:border-[#C8922E] hover:bg-white lg:hidden"
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5 text-[#2A2A2A]" />
            </button>
          </div>
        </div>
      </Container>

      <div className="border-t border-[#D8C3A5]/70 bg-[#FBF6F2] backdrop-blur md:hidden">
        <Container>
          <div
            ref={topCategoriesRef}
            className="-mx-4 flex cursor-grab gap-3 overflow-x-auto px-4 py-3 scrollbar-hide active:cursor-grabbing"
            onMouseDown={onTopCategoriesMouseDown}
            onMouseMove={onTopCategoriesMouseMove}
            onMouseLeave={stopTopCategoriesDragging}
            onMouseUp={stopTopCategoriesDragging}
          >
            {topCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex w-[5.4rem] shrink-0 flex-col items-center gap-1.5 rounded-xl border border-[#D8C3A5]/75 bg-[#FBF6F2] px-2 py-2.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#C8922E]"
              >
                <Image
                  src={cat.src}
                  alt={cat.label}
                  width={32}
                  height={32}
                  className="h-9 w-9 bg-transparent object-contain transition-transform group-hover:scale-105"
                />
                <span className="text-[10px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#2A2A2A] group-hover:text-[#B88732]">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Navigation Menu */}
      <div className="border-t border-[#D8C3A5]/70 bg-[#FBF6F2]">
        <Container>
          <nav className="hidden flex-1 items-center justify-center gap-1.5 py-3.5 lg:flex xl:gap-2.5">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.submenu ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[14px] font-semibold text-[#1F1F1F] transition-all hover:bg-white/75 hover:text-[#B88732] hover:shadow-sm xl:px-4 xl:text-[15px]"
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 text-[#B88732]" />
                    </Link>
                    {renderDesktopSubmenu(item)}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="whitespace-nowrap rounded-full px-3 py-2.5 text-[14px] font-semibold text-[#1F1F1F] transition-all hover:bg-white/75 hover:text-[#B88732] hover:shadow-sm xl:px-4 xl:text-[15px]"
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
        <div className="border-t border-[#D8C3A5]/70 bg-[#FBF6F2] backdrop-blur md:hidden">
          <Container>
            <form className="relative py-2.5" onSubmit={handleSearchSubmit}>
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Bạn đang tìm gì?"
                className="h-11 w-full max-w-full rounded-full border border-[#D8C3A5] bg-white/85 py-2 pl-4 pr-11 text-base font-medium text-[#1F1F1F] outline-none transition-all duration-200 placeholder:text-[#7B6B57] focus:border-[#C8922E] focus:bg-white focus:ring-2 focus:ring-[#C8922E]/15"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#B88732] transition-colors hover:bg-[#FBF6F2]"
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
        <div className="border-t border-[#D8C3A5]/70 bg-[#FBF6F2] backdrop-blur lg:hidden">
          <Container>
            <div className="py-4">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.href}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveSubmenu((current) => {
                              setActiveNestedSubmenu(null);
                              return current === item.label ? null : item.label;
                            })
                          }
                          className="flex w-full items-center justify-between rounded-xl border border-[#D8C3A5]/75 bg-white/85 px-4 py-3 text-sm font-semibold text-[#1F1F1F] shadow-sm transition hover:border-[#C8922E] hover:bg-white hover:text-[#B88732]"
                        >
                          {item.label}
                          <ChevronDown
                            className={`h-4 w-4 text-[#B88732] transition-transform ${
                              activeSubmenu === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeSubmenu === item.label && (
                          <div className="mt-1 space-y-1 rounded-2xl border border-[#D8C3A5]/45 bg-[#FBF6F2] p-2">
                            {item.submenu.map((sub) =>
                              sub.submenu ? (
                                <div key={sub.href}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveNestedSubmenu((current) =>
                                        current === sub.label
                                          ? null
                                          : sub.label,
                                      )
                                    }
                                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#2A2A2A] transition hover:bg-white hover:text-[#B88732]"
                                  >
                                    <span>{sub.label}</span>
                                    <ChevronDown
                                      className={`h-4 w-4 text-[#B88732] transition-transform ${
                                        activeNestedSubmenu === sub.label
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    />
                                  </button>
                                  {activeNestedSubmenu === sub.label && (
                                    <div className="ml-3 mt-1 space-y-1 border-l border-[#D8C3A5] pl-3">
                                      {sub.submenu.map((nested) => (
                                        <Link
                                          key={nested.href}
                                          href={nested.href}
                                          className="block rounded-lg px-3 py-2 text-sm font-medium text-[#4A4035] transition hover:bg-white hover:text-[#B88732]"
                                          onClick={() => {
                                            setMobileMenuOpen(false);
                                            setActiveSubmenu(null);
                                            setActiveNestedSubmenu(null);
                                          }}
                                        >
                                          {nested.label}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#4A4035] transition hover:bg-white hover:text-[#B88732]"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveSubmenu(null);
                                    setActiveNestedSubmenu(null);
                                  }}
                                >
                                  {sub.label}
                                </Link>
                              ),
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1F1F1F] transition hover:bg-white hover:text-[#B88732]"
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
