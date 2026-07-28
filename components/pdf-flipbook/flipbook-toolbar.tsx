"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  GalleryHorizontal,
  Grid3X3,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ReactNode } from "react";

interface FlipbookToolbarProps {
  pageLabel: string;
  zoom: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  isFullscreen: boolean;
  thumbnailsOpen: boolean;
  downloadHref: string;
  downloadFileName?: string;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitWidth: () => void;
  onFitPage: () => void;
  onToggleFullscreen: () => void;
  onToggleThumbnails: () => void;
}

export function FlipbookToolbar({
  pageLabel,
  zoom,
  canGoPrev,
  canGoNext,
  isFullscreen,
  thumbnailsOpen,
  downloadHref,
  downloadFileName,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitWidth,
  onFitPage,
  onToggleFullscreen,
  onToggleThumbnails,
}: FlipbookToolbarProps) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 px-2">
      <div className="pointer-events-auto mx-auto flex min-h-14 items-center justify-center gap-1 rounded-full border border-[#D8C3A5]/70 bg-white/90 px-2 py-2 text-[#2A2A2A] shadow-[0_18px_50px_rgba(79,54,30,0.16)] backdrop-blur-xl md:gap-2 md:px-4">
        <ToolbarButton label="Trang trước" disabled={!canGoPrev} onClick={onPrev}>
          <ChevronLeft className="h-5 w-5" />
        </ToolbarButton>
        <div className="mx-1 min-w-[92px] rounded-full bg-[#FBF6F2] px-3 py-2 text-center text-xs font-semibold tabular-nums text-[#2A2A2A] md:min-w-[116px] md:text-sm">
          {pageLabel}
        </div>
        <ToolbarButton label="Trang sau" disabled={!canGoNext} onClick={onNext}>
          <ChevronRight className="h-5 w-5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Thu nhỏ" onClick={onZoomOut}>
          <ZoomOut className="h-5 w-5" />
        </ToolbarButton>
        <button
          type="button"
          title="Reset zoom"
          aria-label="Reset zoom"
          onClick={onResetZoom}
          className="hidden min-w-[64px] rounded-full px-3 py-2 text-xs font-semibold tabular-nums text-slate-600 transition hover:bg-[#FBF6F2] hover:text-[#B88732] md:inline-flex md:justify-center"
        >
          {Math.round(zoom * 100)}%
        </button>
        <ToolbarButton label="Phóng to" onClick={onZoomIn}>
          <ZoomIn className="h-5 w-5" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton label="Fit toàn trang" onClick={onFitPage} hideOnMobile>
          <GalleryHorizontal className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton label="Fit chiều rộng" onClick={onFitWidth} hideOnMobile>
          <Expand className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton
          label={thumbnailsOpen ? "Đóng danh sách trang" : "Mở danh sách trang"}
          active={thumbnailsOpen}
          onClick={onToggleThumbnails}
        >
          <Grid3X3 className="h-5 w-5" />
        </ToolbarButton>
        <ToolbarButton label="Reset" onClick={onResetZoom} hideOnMobile>
          <RotateCcw className="h-5 w-5" />
        </ToolbarButton>
        <a
          href={downloadHref}
          download={downloadFileName}
          title="Tải PDF"
          aria-label="Tải PDF"
          className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-[#FBF6F2] hover:text-[#B88732] focus:outline-none focus:ring-2 focus:ring-[#C8922E]"
        >
          <Download className="h-5 w-5" />
        </a>
        <ToolbarButton
          label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  disabled,
  active,
  hideOnMobile,
  onClick,
}: {
  children: ReactNode;
  label: string;
  disabled?: boolean;
  active?: boolean;
  hideOnMobile?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:pointer-events-none disabled:opacity-35 ${
        active
          ? "bg-[#C8922E] text-white"
          : "text-slate-600 hover:bg-[#FBF6F2] hover:text-[#B88732]"
      } ${hideOnMobile ? "hidden md:grid" : ""}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 hidden h-6 w-px bg-[#D8C3A5]/70 md:inline-block" />;
}
