"use client";

import Link from "next/link";
import { Facebook, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/constants";

export function FloatingContactButtons() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-2 z-40 flex flex-col gap-2 md:bottom-auto md:right-3 md:top-1/2 md:-translate-y-1/2">
      <a
        href={`tel:${siteConfig.phone}`}
        aria-label="Gọi hotline"
        title="Gọi hotline"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#52b7a4] text-white shadow-[0_8px_20px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_24px_rgba(15,23,42,0.3)] active:scale-95 md:h-12 md:w-12"
      >
        <Phone className="h-5 w-5 md:h-6 md:w-6" />
      </a>

      <a
        href={siteConfig.facebookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        title="Facebook"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2d6be4] text-white shadow-[0_8px_20px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_24px_rgba(15,23,42,0.3)] active:scale-95 md:h-12 md:w-12"
      >
        <Facebook className="h-5 w-5 md:h-6 md:w-6" />
      </a>

      <Link
        href={siteConfig.zaloUrl}
        target="_blank"
        aria-label="Chat Zalo"
        title="Chat Zalo"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2d78c8] text-[10px] font-semibold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_24px_rgba(15,23,42,0.3)] active:scale-95 md:h-12 md:w-12 md:text-[12px]"
      >
        Zalo
      </Link>
    </div>
  );
}
