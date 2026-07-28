"use client";

import Link from "next/link";
import {
  Facebook,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { trackMetaEvent } from "@/lib/meta-client";

export function FloatingContactButtons() {
  const pathname = usePathname();
  const router = useRouter();
  const [isQuoteCollapsed, setIsQuoteCollapsed] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/uat")) {
    return null;
  }

  const baseButtonClass =
    "relative inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_10px_24px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_16px_34px_rgba(15,23,42,0.38)] active:scale-95 md:h-13 md:w-13";

  const trackContact = (channel: "phone" | "facebook" | "zalo") => {
    trackMetaEvent({
      eventName: "Contact",
      customData: {
        channel,
        location: "floating_button",
        content_name: `Floating ${channel} contact`,
      },
    });
  };

  const handleQuoteClick = () => {
    trackMetaEvent({
      eventName: "RequestQuoteClick",
      customData: {
        location: "floating_quote_button",
        content_name: "Floating request quote",
      },
    });

    if (pathname === "/") {
      document
        .getElementById("nhan-bao-gia")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push("/#nhan-bao-gia");
  };

  return (
    <>
      <style jsx>{`
        @keyframes phoneRing {
          0%,
          100% {
            transform: rotate(0deg);
          }
          8% {
            transform: rotate(-14deg);
          }
          16% {
            transform: rotate(12deg);
          }
          24% {
            transform: rotate(-10deg);
          }
          32% {
            transform: rotate(8deg);
          }
          40% {
            transform: rotate(0deg);
          }
        }

        @keyframes sonarWave {
          0% {
            transform: scale(0.75);
            opacity: 0.75;
          }
          80% {
            transform: scale(1.75);
            opacity: 0;
          }
          100% {
            transform: scale(1.75);
            opacity: 0;
          }
        }

        @keyframes softBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes iconPop {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }

        .phone-icon {
          animation: phoneRing 1.6s ease-in-out infinite;
          transform-origin: center;
        }

        .sonar::before,
        .sonar::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(82, 183, 164, 0.75);
          animation: sonarWave 2s ease-out infinite;
        }

        .sonar::after {
          animation-delay: 0.8s;
        }

        .social-float {
          animation: softBounce 2.8s ease-in-out infinite;
        }

        .social-float svg,
        .social-float span {
          animation: iconPop 2.2s ease-in-out infinite;
        }

        .delay-1 {
          animation-delay: 0.25s;
        }

        .delay-2 {
          animation-delay: 0.5s;
        }

        @keyframes quotePulse {
          0%,
          100% {
            transform: translateY(0) scale(1);
            box-shadow:
              0 14px 32px rgba(185, 28, 28, 0.38),
              0 0 0 0 rgba(239, 68, 68, 0.52);
          }
          50% {
            transform: translateY(-3px) scale(1.055);
            box-shadow:
              0 22px 44px rgba(185, 28, 28, 0.5),
              0 0 0 13px rgba(239, 68, 68, 0);
          }
        }

        @keyframes quoteArrow {
          0%,
          100% {
            transform: rotate(-5deg) scale(1);
          }
          50% {
            transform: rotate(8deg) scale(1.18);
          }
        }

        @keyframes quoteShine {
          0%,
          35% {
            transform: translateX(-160%) skewX(-20deg);
          }
          70%,
          100% {
            transform: translateX(260%) skewX(-20deg);
          }
        }

        .quote-cta {
          position: relative;
          animation: quotePulse 1.75s ease-in-out infinite;
        }

        .quote-cta svg {
          animation: quoteArrow 1.1s ease-in-out infinite;
        }

        .quote-cta::after {
          content: "";
          position: absolute;
          inset: -20% auto -20% 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.55),
            transparent
          );
          animation: quoteShine 2.8s ease-in-out infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .quote-cta,
          .quote-cta svg,
          .quote-cta::after {
            animation: none;
          }
        }
      `}</style>

      <div className="fixed bottom-5 left-3 z-40 flex items-center gap-1.5 sm:bottom-7 sm:left-5">
        {isQuoteCollapsed ? (
          <button
            type="button"
            onClick={() => setIsQuoteCollapsed(false)}
            className="quote-cta inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#dc2626] text-white transition duration-300 hover:brightness-110 active:scale-95 sm:h-14 sm:w-14"
            aria-label="Mở rộng nút nhận báo giá"
            title="Mở nút nhận báo giá"
          >
            <FileText className="relative z-[1] h-5 w-5" />
          </button>
        ) : (
          <div className="quote-cta inline-flex min-h-12 w-[13.5rem] items-stretch overflow-hidden rounded-full bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#dc2626] text-white transition-[width,filter] duration-300 hover:brightness-110 sm:min-h-14 sm:w-[14.5rem]">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="relative z-[1] inline-flex min-w-0 flex-1 items-center justify-center gap-2 px-4 text-sm font-bold uppercase tracking-[0.08em] text-white active:opacity-85 sm:px-5"
              aria-label="Cuộn đến form nhận báo giá"
              title="Nhận báo giá"
            >
              <span className="relative z-[1] inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
                <FileText className="h-4 w-4" />
              </span>
              <span className="relative z-[1] whitespace-nowrap">
                Nhận báo giá
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuoteCollapsed(true)}
              className="group relative z-[1] inline-flex w-10 shrink-0 items-center justify-center border-l border-white/20 bg-transparent text-white transition duration-300 hover:bg-white/10 active:bg-white/20 sm:w-11"
              aria-label="Thu gọn nút nhận báo giá"
              title="Thu gọn"
            >
              <PanelLeftClose className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-3 z-40 flex flex-col gap-3 md:bottom-8 md:right-5">
  <a
    href={`tel:${siteConfig.phone}`}
    onClick={() => trackContact("phone")}
    aria-label="Gọi hotline"
    title="Gọi hotline"
    className={`${baseButtonClass} sonar bg-[#52b7a4]`}
  >
    <Phone className="phone-icon relative z-10 h-5 w-5 md:h-6 md:w-6" />
  </a>

  <a
    href={siteConfig.facebookUrl}
    onClick={() => trackContact("facebook")}
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
    title="Facebook"
    className={`${baseButtonClass} social-float delay-1 bg-[#2d6be4]`}
  >
    <Facebook className="h-5 w-5 md:h-6 md:w-6" />
  </a>

  <Link
    href={siteConfig.zaloUrl}
    onClick={() => trackContact("zalo")}
    target="_blank"
    aria-label="Chat Zalo"
    title="Chat Zalo"
    className={`${baseButtonClass} social-float delay-2 bg-[#2d78c8] text-[10px] font-semibold uppercase tracking-wide md:text-[12px]`}
  >
    <span>Zalo</span>
  </Link>
</div>
    </>
  );
}
