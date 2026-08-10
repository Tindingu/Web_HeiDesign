"use client";

import { SmartImage as Image } from "@/components/shared/smart-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroContent } from "@/components/home/types";

export function Hero({ hero }: { hero: HeroContent }) {
  const slides = useMemo(() => {
    if (hero.imageUrls && hero.imageUrls.length > 0) {
      return hero.imageUrls;
    }
    return [hero.imageUrl];
  }, [hero.imageUrl, hero.imageUrls]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isDragActiveRef = useRef(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout>();
  const SWIPE_THRESHOLD = 50;

  // Auto-play management
  useEffect(() => {
    if (slides.length <= 1 || isDragging || isHovering) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [slides.length, isDragging, isHovering]);

  const goToNext = () =>
    setActiveIndex((current) => (current + 1) % slides.length);
  const goToPrev = () =>
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);

  const onPointerDown: React.PointerEventHandler<HTMLElement> = (event) => {
    if (slides.length <= 1) return;
    const target = event.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    isDragActiveRef.current = true;
    dragStartXRef.current = event.clientX;
    dragDistanceRef.current = 0;
    setIsDragging(true);
  };

  const onPointerMove: React.PointerEventHandler<HTMLElement> = (event) => {
    if (!isDragActiveRef.current) return;
    dragDistanceRef.current = event.clientX - dragStartXRef.current;
    setDragOffset(dragDistanceRef.current);
  };

  const stopDragging = () => {
    if (!isDragActiveRef.current) return;
    const dragDistance = dragDistanceRef.current;
    isDragActiveRef.current = false;
    dragDistanceRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);

    if (dragDistance > SWIPE_THRESHOLD) {
      goToPrev();
      return;
    }
    if (dragDistance < -SWIPE_THRESHOLD) {
      goToNext();
    }
  };

  return (
    <section
      className={`relative w-full aspect-video overflow-hidden group ${
        slides.length > 1
          ? isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 will-change-transform">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={hero.title}
            fill
            priority={index === 0}
            className={`object-cover transition-all duration-500 ease-out will-change-transform ${
              index === activeIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-95"
            } ${
              index === activeIndex && isHovering 
                ? "scale-105" 
                : index === activeIndex 
                ? "scale-100"
                : "scale-95"
            }`}
            sizes="100vw"
            draggable={false}
          />
        ))}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/40 active:scale-95"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white/40 active:scale-95"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
