"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Loader2,
  Maximize2,
  Minus,
  MoreVertical,
  Plus,
  Search,
  Share2,
} from "lucide-react";

declare global {
  interface Window {
    jQuery?: any;
    $?: any;
    PDFJS?: any;
  }
}

const FLIPBOOK_CDN = "https://cdn.jsdelivr.net/npm/3d-flip-book@1.12.1";

export function ProfileFlipbook({ pdfUrl }: { pdfUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedScripts, setLoadedScripts] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loadedScripts < 5 || failed || !containerRef.current) return;

    const jquery = window.jQuery || window.$;
    if (!jquery?.fn?.FlipBook) {
      setFailed(true);
      return;
    }

    try {
      const container = containerRef.current;
      container.innerHTML = "";

      if (window.PDFJS && !window.PDFJS.workerSrc) {
        window.PDFJS.workerSrc = `${FLIPBOOK_CDN}/js/pdf.worker.js`;
      }

      jquery(container).FlipBook({
        pdf: pdfUrl,
        controlsProps: {
          downloadURL: pdfUrl,
        },
        template: {
          html: `${FLIPBOOK_CDN}/templates/default-book-view.html`,
          styles: [`${FLIPBOOK_CDN}/css/short-white-book-view.css`],
          links: [
            {
              rel: "stylesheet",
              href: `${FLIPBOOK_CDN}/css/font-awesome.min.css`,
            },
          ],
          script: `${FLIPBOOK_CDN}/js/default-book-view.js`,
        },
      });

      setReady(true);
    } catch {
      setFailed(true);
    }
  }, [failed, loadedScripts, pdfUrl]);

  const markLoaded = () => setLoadedScripts((current) => current + 1);

  const triggerBookControl = (patterns: string[]) => {
    const root = containerRef.current;
    if (!root) return;

    const controls = Array.from(
      root.querySelectorAll<HTMLElement>("button, a, i, span, div")
    );

    const control = controls.find((element) => {
      const signature = [
        element.getAttribute("title"),
        element.getAttribute("aria-label"),
        element.getAttribute("data-name"),
        element.className,
        element.textContent,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return patterns.some((pattern) => signature.includes(pattern));
    });

    control?.click();
  };

  return (
    <div className="relative min-h-[92svh] overflow-hidden bg-[#171717] text-white shadow-[0_-20px_80px_rgba(0,0,0,0.18)]">
      <Script
        src={`${FLIPBOOK_CDN}/js/jquery.min.js`}
        strategy="afterInteractive"
        onLoad={markLoaded}
        onError={() => setFailed(true)}
      />
      <Script
        src={`${FLIPBOOK_CDN}/js/html2canvas.min.js`}
        strategy="afterInteractive"
        onLoad={markLoaded}
        onError={() => setFailed(true)}
      />
      <Script
        src={`${FLIPBOOK_CDN}/js/three.min.js`}
        strategy="afterInteractive"
        onLoad={markLoaded}
        onError={() => setFailed(true)}
      />
      <Script
        src={`${FLIPBOOK_CDN}/js/pdf.min.js`}
        strategy="afterInteractive"
        onLoad={markLoaded}
        onError={() => setFailed(true)}
      />
      <Script
        src={`${FLIPBOOK_CDN}/js/3dflipbook.min.js`}
        strategy="afterInteractive"
        onLoad={markLoaded}
        onError={() => setFailed(true)}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.13),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.68),transparent_24%,transparent_76%,rgba(0,0,0,0.68))]" />

      <div className="relative z-20 flex h-20 items-center justify-between px-4 md:px-8">
        {/* <div className="flex items-center gap-3 rounded-full bg-black/40 px-4 py-2 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur-md">
          <BookOpen className="h-5 w-5 text-amber-200" />
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
            Profile HEI Design
          </span>
        </div> */}

        <div className="flex gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2  bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            <ExternalLink className="h-4 w-4" />
            Mở PDF
          </a>
          <a
            href={pdfUrl}
            download
            className="hidden h-10 items-center gap-2  bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 sm:inline-flex"
          >
            <Download className="h-4 w-4" />
            Tải profile
          </a>
        </div>
      </div>

      <button
        type="button"
        aria-label="Trang trước"
        onClick={() =>
          triggerBookControl(["prev", "previous", "left", "angle-left"])
        }
        className="absolute left-4 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white shadow-[0_16px_44px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:scale-105 hover:bg-black/70 md:left-7"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        type="button"
        aria-label="Trang sau"
        onClick={() =>
          triggerBookControl(["next", "right", "angle-right", "forward"])
        }
        className="absolute right-4 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white shadow-[0_16px_44px_rgba(0,0,0,0.32)] backdrop-blur-md transition hover:scale-105 hover:bg-black/70 md:right-7"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="relative z-10 mx-auto flex min-h-[calc(92svh-8rem)] w-full max-w-[1260px] items-center justify-center px-4 pb-24 md:px-12">
        {!ready && !failed ? (
          <div className="absolute inset-0 z-10 grid place-items-center text-white">
            <div className="flex items-center gap-3 rounded-2xl bg-black/50 px-5 py-4 text-sm font-semibold shadow-lg backdrop-blur">
              <Loader2 className="h-5 w-5 animate-spin text-amber-300" />
              Đang tải hiệu ứng lật trang...
            </div>
          </div>
        ) : null}

        <div
          ref={containerRef}
          className={`h-[calc(92svh-8rem)] min-h-[660px] w-full overflow-hidden ${
            failed ? "hidden" : ""
          }`}
        />

        {failed ? (
          <iframe
            src={pdfUrl}
            title="Profile HEI Design PDF"
            className="h-[calc(92svh-8rem)] min-h-[660px] w-full max-w-5xl rounded-md bg-white shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
          />
        ) : null}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-center bg-white text-slate-950 shadow-[0_-10px_28px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-5 text-slate-800">
          <button type="button" aria-label="Thu nhỏ" className="transition hover:text-amber-700">
            <Minus className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Phóng to" className="transition hover:text-amber-700">
            <Plus className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Tìm kiếm" className="transition hover:text-amber-700">
            <Search className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Chia sẻ" className="transition hover:text-amber-700">
            <Share2 className="h-5 w-5" />
          </button>
          <a href={pdfUrl} download aria-label="Tải profile" className="transition hover:text-amber-700">
            <Download className="h-5 w-5" />
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Mở toàn màn hình"
            className="transition hover:text-amber-700"
          >
            <Maximize2 className="h-5 w-5" />
          </a>
          <button type="button" aria-label="Thêm" className="transition hover:text-amber-700">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
