import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, MapPin, Phone, Mail, YoutubeIcon } from "lucide-react";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/lib/constants";
import { TrackedLink } from "@/components/tracking/tracked-link";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.13v13.02a2.84 2.84 0 1 1-2.84-2.84 2.9 2.9 0 0 1 .88.13V9.12a6 6 0 0 0-.88-.06A5.97 5.97 0 1 0 15.82 15V8.43a7.92 7.92 0 0 0 4.64 1.5V6.81c-.29 0-.58-.04-.87-.12Z" />
    </svg>
  );
}

export function SiteFooter() {
  const messengerMatch = siteConfig.facebookUrl.match(/m\.me\/([^/?#]+)/i);
  const facebookPageHref = messengerMatch?.[1]
    ? `https://www.facebook.com/${messengerMatch[1]}`
    : siteConfig.facebookUrl;

  const facebookEmbedUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    facebookPageHref,
  )}&tabs=timeline&width=620&height=210&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`;

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-[#0a1220] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(31,69,105,0.32),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(245,158,11,0.18),transparent_32%)]" />

      <Container className="relative space-y-10 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1fr_0.68fr_0.74fr_0.88fr_1.7fr]">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/upload/logo/hei-logo.svg"
                alt="HEI Design"
                width={140}
                height={52} 
                className="h-12 w-auto rounded-sm bg-white/95 p-1 md:h-14"
              />
            </Link>

            <p className="max-w-md text-sm leading-7 text-slate-300">
              {siteConfig.description}
            </p>

            <div className="flex items-center gap-2">
              <TrackedLink
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                ariaLabel="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
                eventName="Contact"
                customData={{
                  channel: "facebook",
                  location: "footer_social",
                  content_name: "Footer Facebook contact",
                }}
              >
                <Facebook className="h-4 w-4" />
              </TrackedLink>
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
              >
                <YoutubeIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <TrackedLink
                href="/bao-gia"
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
                eventName="RequestQuoteClick"
                customData={{
                  location: "footer_primary_cta",
                  content_name: "Footer request quote",
                }}
              >
                Nhận báo giá
              </TrackedLink>
              <Link
                href="/du-an"
                className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white hover:text-white"
              >
                Xem dự án
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Về HEI
            </p>
            <div className="flex flex-col gap-2.5 text-base text-slate-200">
              <Link
                href="/gioi-thieu"
                className="transition hover:text-amber-300"
              >
                Giới thiệu
              </Link>
              <Link href="/du-an" className="transition hover:text-amber-300">
                Dự án
              </Link>
              <Link href="/blog" className="transition hover:text-amber-300">
                Blog
              </Link>
              <Link
                href="/tim-kiem"
                className="transition hover:text-amber-300"
              >
                Tìm kiếm
              </Link>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Dịch vụ
            </p>
            <div className="flex flex-col gap-2.5 text-base text-slate-200">
              <Link
                href="/thiet-ke-noi-that"
                className="transition hover:text-amber-300"
              >
                Thiết kế nội thất
              </Link>
              <Link
                href="/thi-cong-noi-that"
                className="transition hover:text-amber-300"
              >
                Thi công nội thất
              </Link>
              <Link
                href="/khong-gian"
                className="transition hover:text-amber-300"
              >
                Không gian
              </Link>
              <TrackedLink
                href="/bao-gia"
                className="transition hover:text-amber-300"
                eventName="RequestQuoteClick"
                customData={{
                  location: "footer_service_menu",
                  content_name: "Footer service quote link",
                }}
              >
                Báo giá
              </TrackedLink>
              <Link href="/thuoc-lo-ban" className="transition hover:text-amber-300">
                Thước Lỗ Ban
              </Link>
              <Link href="/phoimau-bep" className="transition hover:text-amber-300">
                Phối Màu Phòng Bếp
              </Link>
            </div>
          </div>

          <div className="space-y-5 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Liên hệ
            </p>
            <div className="space-y-5 text-slate-200">
              <p className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                <span>
                  <span className="block text-sm text-slate-400">Hotline</span>
                  <TrackedLink
                    href={`tel:${siteConfig.phone}`}
                    className="block pt-0.5 text-base font-medium transition hover:text-amber-300"
                    eventName="Contact"
                    customData={{
                      channel: "phone",
                      location: "footer_contact",
                      content_name: "Footer hotline",
                    }}
                  >
                    {siteConfig.phone}
                  </TrackedLink>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                <span>
                  <span className="block text-sm text-slate-400">Email</span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="block pt-0.5 text-base font-medium transition hover:text-amber-300"
                  >
                    {siteConfig.email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
                <span>
                  <span className="block text-sm text-slate-300">Địa chỉ</span>
                  <span className="block pt-0.5 text-base font-medium transition hover:text-amber-300">
                    {siteConfig.address}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Facebook
            </p>
            <div className="overflow-hidden border border-slate-700 bg-white shadow-lg">
              <iframe
                src={facebookEmbedUrl}
                title="Facebook page HEI Design"
                className="h-[210px] w-[700px]"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="space-y-2">
              <a
                href="https://online.gov.vn/"
                target="_blank"
                rel="noreferrer"
                aria-label="Đã thông báo Bộ Công Thương"
                className="inline-flex items-center justify-center  bg-transparent p-2"
              >
                <img
                  src="/upload/about/chungnhanbocongthuong.png"
                  alt="Đã thông báo Bộ Công Thương"
                  className="h-14 w-auto"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-700 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/lien-he" className="transition hover:text-white">
              Liên hệ
            </Link>
            <TrackedLink
              href="/bao-gia"
              className="transition hover:text-white"
              eventName="RequestQuoteClick"
              customData={{
                location: "footer_bottom",
                content_name: "Footer bottom quote link",
              }}
            >
              Báo giá
            </TrackedLink>
            <Link href="/du-an" className="transition hover:text-white">
              Dự án
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
