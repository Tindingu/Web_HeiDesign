"use client";

import Link from "next/link";
import { Facebook, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/constants";
import { trackMetaEvent } from "@/lib/meta-client";

export function FloatingContactButtons() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
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
      `}</style>

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
