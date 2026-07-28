"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { FlipbookPage } from "./flipbook-page";
import { FlipbookToolbar } from "./flipbook-toolbar";
import { useFlipbookSize } from "./use-flipbook-size";
import { useFullscreen } from "./use-fullscreen";
import type {
  FlipBookRef,
  FlipEvent,
  FlipOrientation,
  PdfDocumentProxy,
  PdfFlipbookProps,
  PdfJsModule,
  PdfLoadingTask,
} from "./types";

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export function PdfFlipbook({
  file,
  title = "Profile HEI Design",
  downloadFileName = "Profile-HEI-Design.pdf",
}: PdfFlipbookProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const { isMobile, pageWidth, pageHeight } = useFlipbookSize(stageRef);
  const { isFullscreen, toggleFullscreen } = useFullscreen(shellRef);

  const [numPages, setNumPages] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<PdfDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orientation, setOrientation] = useState<FlipOrientation>("landscape");
  const [zoom, setZoom] = useState(1);
  const [thumbnailsOpen, setThumbnailsOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PdfLoadingTask | null = null;

    const loadPdf = async () => {
      setLoadError(null);
      setPdfDocument(null);
      setNumPages(0);

      try {
        const pdfjsModule = (await import(
          "pdfjs-dist/legacy/build/pdf.mjs"
        )) as PdfJsModule;

        pdfjsModule.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;
        loadingTask = pdfjsModule.getDocument({
          url: file,
          useWorkerFetch: false,
          isEvalSupported: false,
        });

        const pdf = await loadingTask.promise;
        if (cancelled) {
          await pdf.destroy?.();
          return;
        }

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(0);
      } catch (error) {
        if (!cancelled) {
          console.error("PDF flipbook load error:", error);
          const detail =
            error instanceof Error && error.message ? ` (${error.message})` : "";
          setLoadError(
            `Không tải được tài liệu PDF. Vui lòng thử lại hoặc tải file trực tiếp.${detail}`
          );
        }
      }
    };

    void loadPdf();

    return () => {
      cancelled = true;
      loadingTask?.destroy?.();
    };
  }, [file]);

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, index) => index + 1),
    [numPages]
  );

  const isSinglePageMode = isMobile || orientation === "portrait";
  const pageLabel = useMemo(() => {
    if (!numPages) return "0 / 0";
    if (
      isSinglePageMode ||
      currentPage === 0 ||
      currentPage >= numPages - 1
    ) {
      return `${currentPage + 1} / ${numPages}`;
    }

    return `${currentPage + 1}-${Math.min(
      currentPage + 2,
      numPages
    )} / ${numPages}`;
  }, [currentPage, isSinglePageMode, numPages]);

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < numPages - 1;

  const pageFlip = useCallback(() => flipBookRef.current?.pageFlip(), []);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    pageFlip()?.flipPrev();
  }, [canGoPrev, pageFlip]);

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    pageFlip()?.flipNext();
  }, [canGoNext, pageFlip]);

  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!numPages) return;
      const nextPage = Math.min(Math.max(pageIndex, 0), numPages - 1);
      pageFlip()?.turnToPage(nextPage);
      setCurrentPage(nextPage);
      setThumbnailsOpen(false);
    },
    [numPages, pageFlip]
  );

  const changeZoom = useCallback((nextZoom: number) => {
    setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom)));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(zoom + ZOOM_STEP);
      }
      if (event.key === "-") {
        event.preventDefault();
        changeZoom(zoom - ZOOM_STEP);
      }
      if (event.key === "0") {
        event.preventDefault();
        setZoom(1);
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
      if (event.key === "Escape") {
        setThumbnailsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeZoom, goNext, goPrev, toggleFullscreen, zoom]);

  const visiblePages = useMemo(() => {
    const range = new Set<number>([1, numPages]);
    for (let offset = -4; offset <= 5; offset += 1) {
      const pageNumber = currentPage + 1 + offset;
      if (pageNumber >= 1 && pageNumber <= numPages) {
        range.add(pageNumber);
      }
    }
    return range;
  }, [currentPage, numPages]);

  return (
    <section
      ref={shellRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[#2B2725] text-slate-950"
      aria-label={title}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,#4A403A_0%,#2B2725_42%,#1F1C1A_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#1F1C1A_0%,rgba(31,28,26,0.18)_22%,rgba(31,28,26,0)_50%,rgba(31,28,26,0.18)_78%,#1F1C1A_100%)]" />

      <div className="absolute left-4 top-4 z-40   px-4 py-3 text-sm font-semibold tabular-nums text-white shadow-[0_16px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl md:left-6">
        {pageLabel}
      </div>

      <div className="absolute right-4 top-4 z-40 flex items-center gap-2 md:right-6">
        {/* <div className="hidden   px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#3A312D] shadow-[0_16px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:block">
          {title}
        </div> */}
        <a
          href={file}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-[#F8F5F1] px-4 py-3 text-sm font-semibold text-[#3A312D] shadow-[0_16px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:bg-white"
        >
          Mở PDF
        </a>
      </div>

      <button
        type="button"
        aria-label="Trang trước"
        disabled={!canGoPrev}
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-40 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#2F2A27] shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-lg transition hover:scale-105 hover:bg-[#F8F5F1] disabled:pointer-events-none disabled:opacity-30 md:left-7"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        type="button"
        aria-label="Trang sau"
        disabled={!canGoNext}
        onClick={goNext}
        className="absolute right-3 top-1/2 z-40 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#2F2A27] shadow-[0_18px_50px_rgba(0,0,0,0.26)] backdrop-blur-lg transition hover:scale-105 hover:bg-[#F8F5F1] disabled:pointer-events-none disabled:opacity-30 md:right-7"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div
        ref={stageRef}
        className="relative z-10 flex h-[100dvh] items-center justify-center overflow-auto px-4 pb-28 pt-24 [perspective:2600px] md:px-20 md:pb-24 md:pt-24"
      >
        {loadError ? (
          <ErrorState
            message={loadError}
            file={file}
            downloadFileName={downloadFileName}
          />
        ) : null}

        {!loadError && !pdfDocument ? <LoadingState /> : null}

        {pdfDocument && numPages === 0 ? (
          <ErrorState
            message="Chưa có tài liệu PDF để hiển thị."
            file={file}
            downloadFileName={downloadFileName}
          />
        ) : null}

        {pdfDocument && numPages > 0 ? (
          <div
            className="origin-center transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:transition-none"
            style={{
              transform: `scale(${zoom}) rotateX(0.8deg)`,
            }}
          >
            <div className="relative">
              <div className="pointer-events-none absolute -bottom-8 left-1/2 h-14 w-[92%] -translate-x-1/2 rounded-[50%] bg-[#6B4A22]/25 blur-2xl" />
              {!isMobile ? (
                <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-12 -translate-x-1/2 bg-gradient-to-r from-black/22 via-black/7 to-transparent blur-[1px]" />
              ) : null}
              <HTMLFlipBook
                key={`${pageWidth}-${pageHeight}-${isMobile ? "m" : "d"}`}
                ref={flipBookRef}
                width={pageWidth}
                height={pageHeight}
                minWidth={250}
                maxWidth={isMobile ? pageWidth : pageWidth * 2}
                minHeight={354}
                maxHeight={pageHeight}
                size="fixed"
                startPage={0}
                drawShadow
                flippingTime={920}
                usePortrait={isMobile}
                startZIndex={10}
                autoSize={false}
                maxShadowOpacity={0.72}
                showCover
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={28}
                showPageCorners
                disableFlipByClick={false}
                className="pdf-flipbook"
                style={{
                  margin: "0 auto",
                  filter: "drop-shadow(0 30px 52px rgba(0,0,0,0.44))",
                }}
                onFlip={(event: FlipEvent) => setCurrentPage(event.data)}
                onChangeOrientation={(event: { data: FlipOrientation }) =>
                  setOrientation(event.data)
                }
              >
                {pages.map((pageNumber) => (
                  <FlipbookPage
                    key={pageNumber}
                    pdf={pdfDocument}
                    pageNumber={pageNumber}
                    width={pageWidth}
                    shouldRender={visiblePages.has(pageNumber)}
                    isCover={pageNumber === 1 || pageNumber === numPages}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        ) : null}
      </div>

      {thumbnailsOpen && numPages > 0 ? (
        <div
          className="absolute inset-0 z-50 bg-[#FBF6F2]/65 backdrop-blur-sm"
          onClick={() => setThumbnailsOpen(false)}
        >
          <aside
            className="h-full w-[min(360px,86vw)] overflow-y-auto border-r border-[#D8C3A5]/60 bg-white/95 p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#B88732]">
              Danh sách trang
            </p>
            <div className="grid grid-cols-3 gap-2">
              {pages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => goToPage(pageNumber - 1)}
                  className={`rounded-xl px-3 py-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                    currentPage + 1 === pageNumber
                      ? "bg-amber-300 text-slate-950"
                      : "bg-[#FBF6F2] text-slate-700 hover:bg-[#F0E4D4] hover:text-slate-950"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          </aside>
        </div>
      ) : null}

      <FlipbookToolbar
        pageLabel={pageLabel}
        zoom={zoom}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        isFullscreen={isFullscreen}
        thumbnailsOpen={thumbnailsOpen}
        downloadHref={file}
        downloadFileName={downloadFileName}
        onPrev={goPrev}
        onNext={goNext}
        onZoomIn={() => changeZoom(zoom + ZOOM_STEP)}
        onZoomOut={() => changeZoom(zoom - ZOOM_STEP)}
        onResetZoom={() => setZoom(1)}
        onFitWidth={() => changeZoom(isMobile ? 1.04 : 1.16)}
        onFitPage={() => setZoom(1)}
        onToggleFullscreen={() => void toggleFullscreen()}
        onToggleThumbnails={() => setThumbnailsOpen((open) => !open)}
      />
    </section>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-[58vh] place-items-center text-[#2A2A2A]">
      <div className="flex items-center gap-3 rounded-2xl border border-[#D8C3A5]/70 bg-white/85 px-5 py-4 text-sm font-semibold shadow-[0_18px_50px_rgba(79,54,30,0.14)] backdrop-blur-xl">
        <Loader2 className="h-5 w-5 animate-spin text-[#C8922E]" />
        Đang tải tài liệu...
      </div>
    </div>
  );
}

function ErrorState({
  message,
  file,
  downloadFileName,
}: {
  message: string | null;
  file: string;
  downloadFileName: string;
}) {
  return (
    <div className="grid min-h-[58vh] place-items-center px-4 text-[#2A2A2A]">
      <div className="max-w-md rounded-3xl border border-[#D8C3A5]/70 bg-white/90 p-6 text-center shadow-[0_22px_60px_rgba(79,54,30,0.16)] backdrop-blur-xl">
        <AlertTriangle className="mx-auto h-10 w-10 text-[#C8922E]" />
        <h2 className="mt-4 text-xl font-semibold">Không thể mở flipbook</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {message || "Đã có lỗi khi tải tài liệu PDF."}
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Thử lại
          </button>
          <a
            href={file}
            download={downloadFileName}
            className="rounded-full bg-[#C8922E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#B88732]"
          >
            Tải PDF
          </a>
        </div>
      </div>
    </div>
  );
}
