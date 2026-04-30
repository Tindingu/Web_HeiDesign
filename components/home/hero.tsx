"use client";

import Image from "next/image";
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
  const dragStartXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isDragActiveRef = useRef(false);
  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
  };

  const stopDragging = () => {
    if (!isDragActiveRef.current) return;
    const dragDistance = dragDistanceRef.current;
    isDragActiveRef.current = false;
    dragDistanceRef.current = 0;
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
      className={`relative h-[500px] overflow-hidden md:h-[600px] lg:h-[700px] ${
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
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {slides.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={hero.title}
            fill
            priority={index === 0}
            className={`object-cover transition-[opacity,transform] duration-700 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            } ${index === activeIndex ? "hover:scale-[1.03]" : ""}`}
            sizes="100vw"
          />
        ))}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </div>

      {/* Text Content - Right Side */}
      <div className="absolute right-8 top-1/2 z-10 max-w-xl -translate-y-1/2 space-y-4 text-right md:right-16 lg:right-24">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="text-xl font-light text-white/90 drop-shadow-lg md:text-2xl lg:text-3xl">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-8 py-4">
        <div className="flex items-center justify-between">
          <a
            href="tel:0795743429"
            className="text-lg font-semibold text-white hover:text-amber-400 md:text-xl"
          >
            📞 0795.743.429
          </a>
          <p className="hidden text-sm text-white/80 md:block">
            {hero.ctaPrimary}
          </p>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="Ảnh kế tiếp"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </section>
  );
}
