"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { Testimonial } from "@/lib/strapi";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();
  const activeTouchIdRef = useRef<number | null>(null);

  const total = testimonials.length;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    if (isDragging || isPaused) return;

    const timer = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [testimonials.length, isDragging, isPaused]);

  if (!testimonials.length) return null;

  const goPrev = () =>
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
  const goNext = () => setIndex((currentIndex) => (currentIndex + 1) % total);

  const clampOffset = (value: number) => {
    const max = 180;
    if (value > max) return max;
    if (value < -max) return -max;
    return value;
  };

  const setPauseTimer = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    setIsPaused(true);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  const beginDrag = (clientX: number, pointerId?: number) => {
    if (!viewportRef.current) return;

    if (typeof pointerId === "number") {
      pointerIdRef.current = pointerId;
      viewportRef.current.setPointerCapture(pointerId);
    }

    dragStartXRef.current = clientX;
    setDragOffset(0);
    setIsDragging(true);
    setPauseTimer();
  };

  const updateDrag = (clientX: number) => {
    if (!isDragging) return;

    const delta = clientX - dragStartXRef.current;
    setDragOffset(clampOffset(delta));
  };

  const endDrag = (finalOffset = dragOffset) => {
    if (!isDragging) return;

    const width = viewportRef.current?.clientWidth ?? 1;
    const threshold = Math.min(120, width * 0.16);

    if (finalOffset > threshold) {
      goPrev();
    } else if (finalOffset < -threshold) {
      goNext();
    }

    setIsDragging(false);
    setDragOffset(0);
    pointerIdRef.current = null;
    activeTouchIdRef.current = null;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    event.preventDefault();
    beginDrag(event.clientX, event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId) return;
    updateDrag(event.clientX);
  };

  const finishDrag = () => {
    endDrag();
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!viewportRef.current || event.touches.length !== 1) return;

    const touch = event.touches[0];
    activeTouchIdRef.current = touch.identifier;
    beginDrag(touch.clientX);
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (activeTouchIdRef.current === null) return;

    const touch = Array.from(event.touches).find(
      (item) => item.identifier === activeTouchIdRef.current,
    );
    if (!touch) return;

    event.preventDefault();
    updateDrag(touch.clientX);
  };

  const onTouchEnd = () => {
    endDrag();
  };

  return (
    <section className="border-y border-slate-200 bg-[#f8f9fa] py-20 text-slate-900">
      <Container className="space-y-10">
        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
            NHẬN XÉT KHÁCH HÀNG
          </h2>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />

            <button
              type="button"
              onClick={goPrev}
              aria-label="Xem nhận xét trước"
              className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-[#1f4569] hover:text-[#1f4569] md:left-4 md:h-11 md:w-11"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={viewportRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseEnter={() => setPauseTimer()}
              onMouseLeave={() => {
                if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
                setIsPaused(false);
              }}
              className="overflow-hidden px-2 py-8 md:px-16 select-none"
              role="region"
              aria-label="Carousel để kéo xem nhận xét"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "pan-y",
                WebkitUserSelect: "none",
              }}
            >
              <div
                className="flex"
                style={{
                  transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
                  transition: isDragging
                    ? "none"
                    : "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: isDragging ? "transform" : "auto",
                }}
              >
                {testimonials.map((testimonial, idx) => {
                  const prev = testimonials[(idx - 1 + total) % total];
                  const next = testimonials[(idx + 1) % total];

                  return (
                    <div
                      key={`${testimonial.name}-${idx}`}
                      className="min-w-full px-1"
                    >
                      <div className="grid items-center gap-2 sm:grid-cols-[1fr_1.35fr_1fr] sm:gap-4">
                        <div className="mx-auto hidden h-44 w-32 overflow-hidden rounded-xl border border-slate-200 opacity-70 sm:block md:h-60 md:w-40">
                          {prev?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={prev.imageUrl}
                              alt={prev.name}
                              className="pointer-events-none h-full w-full select-none object-cover"
                              loading="lazy"
                              draggable={false}
                              style={{
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-100" />
                          )}
                        </div>

                        <div className="mx-auto h-64 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-80 sm:w-64 md:h-[360px] md:w-72">
                          {testimonial?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              className="pointer-events-none h-full w-full select-none object-cover"
                              loading="eager"
                              draggable={false}
                              style={{
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.2em] text-slate-400">
                              Khách hàng
                            </div>
                          )}
                        </div>

                        <div className="mx-auto hidden h-44 w-32 overflow-hidden rounded-xl border border-slate-200 opacity-70 sm:block md:h-60 md:w-40">
                          {next?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={next.imageUrl}
                              alt={next.name}
                              className="pointer-events-none h-full w-full select-none object-cover"
                              loading="lazy"
                              draggable={false}
                              style={{
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-100" />
                          )}
                        </div>
                      </div>

                      <div className="mx-auto mt-4 max-w-4xl text-center sm:mt-6">
                        <p className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
                          {testimonial.name}
                        </p>
                        <p className="mt-2 text-sm italic leading-relaxed text-slate-600 sm:mt-3 sm:text-base md:text-lg">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label="Xem nhận xét tiếp"
              className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-[#1f4569] hover:text-[#1f4569] md:right-4 md:h-11 md:w-11"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                className={`h-2 w-2 rounded-full transition ${
                  index === idx ? "bg-[#1f4569]" : "bg-slate-300"
                }`}
                onClick={() => setIndex(idx)}
                aria-label={`Chuyển tới nhận xét ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
