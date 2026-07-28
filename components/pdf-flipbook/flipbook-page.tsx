"use client";

import { forwardRef, memo, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { PdfDocumentProxy, RenderTask } from "./types";

interface FlipbookPageProps {
  pdf: PdfDocumentProxy;
  pageNumber: number;
  width: number;
  shouldRender: boolean;
  isCover?: boolean;
}

export const FlipbookPage = memo(
  forwardRef<HTMLDivElement, FlipbookPageProps>(function FlipbookPage(
    { pdf, pageNumber, width, shouldRender, isCover },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (!shouldRender || !canvasRef.current) return;

      let cancelled = false;
      let renderTask: RenderTask | null = null;

      const renderPage = async () => {
        setLoading(true);
        setError(false);

        try {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const scale = width / baseViewport.width;
          const viewport = page.getViewport({ scale });
          const canvas = canvasRef.current;
          if (!canvas) return;

          const context = canvas.getContext("2d", { alpha: false });
          if (!context) return;

          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.height = Math.floor(viewport.height * pixelRatio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, viewport.width, viewport.height);

          renderTask = page.render({
            canvasContext: context,
            viewport,
          });

          await renderTask.promise;
          if (!cancelled) {
            setLoading(false);
          }
        } catch (renderError) {
          if (!cancelled) {
            console.error(`PDF page ${pageNumber} render error:`, renderError);
            setError(true);
            setLoading(false);
          }
        }
      };

      void renderPage();

      return () => {
        cancelled = true;
        renderTask?.cancel();
      };
    }, [pageNumber, pdf, shouldRender, width]);

    return (
      <div
        ref={ref}
        className={`group relative overflow-hidden bg-white text-slate-900 shadow-[0_18px_38px_rgba(0,0,0,0.24)] ${
          isCover ? "rounded-r-[6px]" : ""
        }`}
        style={{ width, height: width * 1.414 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-black/10 to-transparent opacity-70" />
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-20 w-20 rounded-bl-[90px] bg-gradient-to-bl from-black/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        {shouldRender ? (
          <canvas ref={canvasRef} className="block h-full w-full" />
        ) : (
          <PagePlaceholder label={`Trang ${pageNumber}`} />
        )}

        {loading ? <PagePlaceholder label={`Đang tải trang ${pageNumber}`} overlay /> : null}
        {error ? <PagePlaceholder label={`Không tải được trang ${pageNumber}`} overlay /> : null}
      </div>
    );
  })
);

FlipbookPage.displayName = "FlipbookPage";

function PagePlaceholder({
  label,
  overlay,
}: {
  label: string;
  overlay?: boolean;
}) {
  return (
    <div
      className={`grid place-items-center bg-white text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 ${
        overlay ? "absolute inset-0 z-30" : "h-full w-full"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </span>
    </div>
  );
}
