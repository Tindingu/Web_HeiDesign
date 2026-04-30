"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { Project } from "@/lib/strapi";

export function GalleryCarousel({ project }: { project: Project }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMainDragging, setIsMainDragging] = useState(false);
  const [mainDragOffset, setMainDragOffset] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const mainDragStartXRef = useRef(0);
  const mainDragDistanceRef = useRef(0);
  const isMainDragActiveRef = useRef(false);
  const mainPointerIdRef = useRef<number | null>(null);
  const isDraggingThumbRef = useRef(false);
  const thumbDragStartXRef = useRef(0);
  const thumbDragStartScrollLeftRef = useRef(0);
  const thumbDidDragRef = useRef(false);
  const MAIN_SWIPE_THRESHOLD = 50;

  // Combine cover image + gallery
  const allImages = [project.coverImage, ...project.gallery];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollThumbnailIntoView(index);
  };

  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[index] as HTMLElement;
      if (thumbnail) {
        thumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const onThumbMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rail = thumbnailsRef.current;
    if (!rail) return;
    isDraggingThumbRef.current = true;
    thumbDidDragRef.current = false;
    thumbDragStartXRef.current = event.pageX - rail.offsetLeft;
    thumbDragStartScrollLeftRef.current = rail.scrollLeft;
  };

  const onThumbMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDraggingThumbRef.current) return;
    const rail = thumbnailsRef.current;
    if (!rail) return;
    event.preventDefault();
    const x = event.pageX - rail.offsetLeft;
    const walk = (x - thumbDragStartXRef.current) * 1.1;
    if (Math.abs(walk) > 5) {
      thumbDidDragRef.current = true;
    }
    rail.scrollLeft = thumbDragStartScrollLeftRef.current - walk;
  };

  const stopThumbDragging = () => {
    isDraggingThumbRef.current = false;
  };

  const onMainPointerDown: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (allImages.length <= 1) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    isMainDragActiveRef.current = true;
    mainPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    mainDragStartXRef.current = event.clientX;
    mainDragDistanceRef.current = 0;
    setMainDragOffset(0);
    setIsMainDragging(true);
  };

  const onMainPointerMove: React.PointerEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (!isMainDragActiveRef.current) return;
    const delta = event.clientX - mainDragStartXRef.current;
    mainDragDistanceRef.current = delta;
    setMainDragOffset(delta * 0.35);
  };

  const stopMainDragging = (target?: HTMLDivElement | null) => {
    if (!isMainDragActiveRef.current) return;
    if (target && mainPointerIdRef.current !== null) {
      try {
        target.releasePointerCapture(mainPointerIdRef.current);
      } catch {
        // no-op
      }
    }

    const dragDistance = mainDragDistanceRef.current;
    isMainDragActiveRef.current = false;
    mainPointerIdRef.current = null;
    mainDragDistanceRef.current = 0;
    setIsMainDragging(false);
    setMainDragOffset(0);

    if (dragDistance > MAIN_SWIPE_THRESHOLD) {
      goToPrevious();
      return;
    }
    if (dragDistance < -MAIN_SWIPE_THRESHOLD) {
      goToNext();
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
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

  return (
    <>
      <div className="relative w-full overflow-x-clip bg-gray-100">
        <Container className="py-6 sm:py-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
            {/* Main Carousel */}
            <div className="min-w-0 space-y-4">
              <div
                className={`relative aspect-[4/5] overflow-hidden rounded-lg bg-white shadow-lg sm:aspect-[16/10] ${
                  allImages.length > 1
                    ? isMainDragging
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : ""
                }`}
                onPointerDown={onMainPointerDown}
                onPointerMove={onMainPointerMove}
                onPointerUp={(event) => stopMainDragging(event.currentTarget)}
                onPointerCancel={(event) =>
                  stopMainDragging(event.currentTarget)
                }
              >
                <Image
                  src={allImages[currentIndex].url}
                  alt={allImages[currentIndex].alt}
                  fill
                  priority
                  className={`object-contain transition-transform hover:scale-[1.02] ${
                    isMainDragging ? "duration-75" : "duration-500"
                  }`}
                  style={{ transform: `translateX(${mainDragOffset}px)` }}
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 70vw"
                />

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Zoom Button */}
                <button
                  onClick={() => openLightbox(currentIndex)}
                  className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90 p-3 shadow-lg transition-all hover:bg-white hover:scale-110"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="h-5 w-5 text-gray-800" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white">
                  {currentIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="relative">
                  <div
                    ref={thumbnailsRef}
                    className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 cursor-grab active:cursor-grabbing"
                    onMouseDown={onThumbMouseDown}
                    onMouseMove={onThumbMouseMove}
                    onMouseUp={stopThumbDragging}
                    onMouseLeave={stopThumbDragging}
                  >
                    {allImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={(event) => {
                          if (thumbDidDragRef.current) {
                            event.preventDefault();
                            thumbDidDragRef.current = false;
                            return;
                          }
                          goToSlide(idx);
                        }}
                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-3 transition-all md:h-24 md:w-24 ${
                          idx === currentIndex
                            ? "border-amber-500 ring-2 ring-amber-500 ring-offset-2"
                            : "border-gray-300 hover:border-amber-400"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Info Sidebar */}
            <div className="min-w-0 rounded-lg bg-white p-5 shadow-lg sm:p-6">
              <div className="mb-4">
                <p className="text-sm uppercase tracking-wider text-amber-600 font-semibold">
                  {project.category}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <p className="mt-3 text-gray-600">{project.summary}</p>
              </div>

              <div className="mt-6 space-y-4 border-t pt-6">
                {project.projectDetails && (
                  <>
                    {project.projectDetails.area && (
                      <div className="flex min-w-0 justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                          Diện tích:
                        </span>
                        <span className="text-right text-sm font-medium text-gray-900">
                          {project.projectDetails.area}
                        </span>
                      </div>
                    )}
                    {project.projectDetails.duration && (
                      <div className="flex min-w-0 justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                          Thời gian:
                        </span>
                        <span className="text-right text-sm font-medium text-gray-900">
                          {project.projectDetails.duration}
                        </span>
                      </div>
                    )}
                    {project.projectDetails.scope && (
                      <div className="flex min-w-0 justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                          Phạm vi:
                        </span>
                        <span className="text-right text-sm font-medium text-gray-900">
                          {project.projectDetails.scope}
                        </span>
                      </div>
                    )}
                    {project.projectDetails.client && (
                      <div className="flex min-w-0 justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                          Khách hàng:
                        </span>
                        <span className="text-right text-sm font-medium text-gray-900">
                          {project.projectDetails.client}
                        </span>
                      </div>
                    )}
                    {project.projectDetails.location && (
                      <div className="flex min-w-0 justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                          Địa điểm:
                        </span>
                        <span className="text-right text-sm font-medium text-gray-900">
                          {project.projectDetails.location}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={lightboxPrev}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={lightboxNext}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={allImages[lightboxIndex].url}
              alt={allImages[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  );
}
