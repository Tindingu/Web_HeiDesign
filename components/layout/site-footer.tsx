import Link from "next/link";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#f8fafc] text-slate-900">
      <Container className="space-y-10 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr]">
          <div className="space-y-4">
            <p className="text-2xl font-bold uppercase tracking-wide text-[#1f4569]">
              {siteConfig.name}
            </p>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bao-gia"
                className="rounded-full bg-[#1f4569] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#173855]"
              >
                Nhận báo giá
              </Link>
              <Link
                href="/du-an"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#1f4569] hover:text-[#1f4569]"
              >
                Xem dự án
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Về ICEP
            </p>
            <div className="flex flex-col gap-2 text-slate-700">
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/du-an">Dự án</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/tim-kiem">Tìm kiếm</Link>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Dịch vụ
            </p>
            <div className="flex flex-col gap-2 text-slate-700">
              <Link href="/thiet-ke-noi-that">Thiết kế nội thất</Link>
              <Link href="/thi-cong-noi-that">Thi công nội thất</Link>
              <Link href="/khong-gian">Không gian</Link>
              <Link href="/bao-gia">Báo giá</Link>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Liên hệ
            </p>
            <div className="space-y-2 text-slate-700">
              <p>
                <span className="block text-slate-400">Hotline</span>
                <a href={`tel:${siteConfig.phone}`} className="font-medium">
                  {siteConfig.phone}
                </a>
              </p>
              <p>
                <span className="block text-slate-400">Email</span>
                <a href={`mailto:${siteConfig.email}`} className="font-medium">
                  {siteConfig.email}
                </a>
              </p>
              <p>
                <span className="block text-slate-400">Khu vực</span>
                <span className="font-medium">{siteConfig.address}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/lien-he" className="transition hover:text-[#1f4569]">
              Liên hệ
            </Link>
            <Link href="/bao-gia" className="transition hover:text-[#1f4569]">
              Báo giá
            </Link>
            <Link href="/du-an" className="transition hover:text-[#1f4569]">
              Dự án
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
