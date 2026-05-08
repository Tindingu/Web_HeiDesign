"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageAsset } from "@/lib/strapi";

interface ProjectGalleryGridProps {
  images: ImageAsset[];
}

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;

export function ProjectGalleryGrid({ images }: ProjectGalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [revealStartIndex, setRevealStartIndex] = useState(0);

  const visibleImages = images.slice(0, visibleCount);
  const hasMoreImages = visibleCount < images.length;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleLoadMore = () => {
    setRevealStartIndex(visibleCount);
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_STEP, images.length));
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen, lightboxIndex]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    setRevealStartIndex(0);
  }, [images.length]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleImages.map((image, idx) => {
          const isNewlyRevealed =
            idx >= revealStartIndex && revealStartIndex > 0;

          return (
            <button
              key={`${image.url}-${idx}`}
              onClick={() => openLightbox(idx)}
              className={`group relative aspect-[4/3] overflow-hidden  bg-gray-100 shadow-md transition-all hover:shadow-xl ${
                isNewlyRevealed ? "hei-gallery-reveal" : ""
              }`}
              style={
                isNewlyRevealed
                  ? {
                      animationDelay: `${(idx - revealStartIndex) * 70}ms`,
                    }
                  : undefined
              }
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading={idx < 2 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

              {/* Overlay text on hover */}
              {image.alt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 p-4 opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                  <p className="text-center text-sm font-medium text-white">
                    {image.alt}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasMoreImages && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
          >
            Xem thêm ({images.length - visibleCount} ảnh)
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={lightboxPrev}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          {/* Next button */}
          <button
            onClick={lightboxNext}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Image container */}
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Image info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <div className="mb-2 rounded-full bg-black/60 px-4 py-2 text-white">
              {lightboxIndex + 1} / {images.length}
            </div>
            {images[lightboxIndex].alt && (
              <p className="max-w-2xl text-sm text-white/80">
                {images[lightboxIndex].alt}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
