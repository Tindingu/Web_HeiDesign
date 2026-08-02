import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

const siteUrl = "https://heidesign.vn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function toAbsoluteUrl(href?: string) {
  if (!href) return siteUrl;
  if (/^https?:\/\//i.test(href)) return href;
  return `${siteUrl}${href.startsWith("/") ? href : `/${href}`}`;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const visibleItems = items.filter((item) => item.label.trim());
  const jsonLd = buildBreadcrumbJsonLd(
    visibleItems.map((item) => ({
      name: item.label,
      url: toAbsoluteUrl(item.href),
    })),
  );

  if (visibleItems.length === 0) return null;

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={`flex min-w-0 items-center border-y border-[#D7B46A]/70 py-4 text-sm font-medium text-[#1f4569] ${className}`}
      >
        <ol className="flex min-w-0 flex-wrap items-center gap-2">
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const label = item.label;

            return (
              <li
                key={`${label}-${index}`}
                className="flex min-w-0 items-center gap-2"
              >
                {index > 0 && (
                  <ChevronRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-[#B88732]"
                  />
                )}

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="inline-flex min-w-0 items-center text-[#1f4569] transition hover:text-[#B88732]"
                  >
                    <span className="truncate">{label}</span>
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="min-w-0 truncate text-[#1f4569]"
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
