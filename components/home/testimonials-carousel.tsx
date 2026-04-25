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
  if (!testimonials.length) return null;

  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);

  const total = testimonials.length;

  const goPrev = () =>
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
  const goNext = () => setIndex((currentIndex) => (currentIndex + 1) % total);

  const clampOffset = (value: number) => {
    const max = 180;
    if (value > max) return max;
    if (value < -max) return -max;
    return value;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    event.preventDefault();
    pointerIdRef.current = event.pointerId;
    viewportRef.current.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setIsPaused(true);
    dragStartXRef.current = event.clientX;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = event.clientX - dragStartXRef.current;
    setDragOffset(clampOffset(delta));
  };

  const finishDrag = () => {
    if (!isDragging) return;
    const width = viewportRef.current?.clientWidth ?? 1;
    const threshold = Math.min(120, width * 0.16);

    if (dragOffset > threshold) {
      goPrev();
    } else if (dragOffset < -threshold) {
      goNext();
    }

    setIsDragging(false);
    setDragOffset(0);
    pointerIdRef.current = null;
    setIsPaused(false);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    if (isDragging || isPaused) return;

    const timer = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [testimonials.length, isDragging, isPaused]);

  return (
    <section className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20 text-slate-900">
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
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-[#1f4569] hover:text-[#1f4569] md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={viewportRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              onPointerLeave={finishDrag}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="overflow-hidden px-4 py-8 md:px-16"
              role="region"
              aria-label="Carousel để kéo xem nhận xét"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
            >
              <div
                className="flex"
                style={{
                  transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
                  transition: isDragging
                    ? "none"
                    : "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
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
                      <div className="grid items-center gap-4 sm:grid-cols-[1fr_1.35fr_1fr]">
                        <div className="mx-auto hidden h-52 w-36 overflow-hidden rounded-xl border border-slate-200 opacity-70 sm:block md:h-60 md:w-40">
                          {prev?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={prev.imageUrl}
                              alt={prev.name}
                              className="h-full w-full select-none object-cover"
                              loading="lazy"
                              draggable={false}
                              style={{
                                pointerEvents: "auto",
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-100" />
                          )}
                        </div>

                        <div className="mx-auto h-72 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-80 sm:w-64 md:h-[360px] md:w-72">
                          {testimonial?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={testimonial.imageUrl}
                              alt={testimonial.name}
                              className="h-full w-full select-none object-cover"
                              loading="eager"
                              draggable={false}
                              style={{
                                pointerEvents: "auto",
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.2em] text-slate-400">
                              Khách hàng
                            </div>
                          )}
                        </div>

                        <div className="mx-auto hidden h-52 w-36 overflow-hidden rounded-xl border border-slate-200 opacity-70 sm:block md:h-60 md:w-40">
                          {next?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={next.imageUrl}
                              alt={next.name}
                              className="h-full w-full select-none object-cover"
                              loading="lazy"
                              draggable={false}
                              style={{
                                pointerEvents: "auto",
                                userSelect: "none",
                              }}
                            />
                          ) : (
                            <div className="h-full w-full bg-slate-100" />
                          )}
                        </div>
                      </div>

                      <div className="mx-auto mt-6 max-w-4xl text-center">
                        <p className="text-xl font-semibold text-slate-900 md:text-2xl">
                          {testimonial.name}
                        </p>
                        <p className="mt-3 text-base italic leading-relaxed text-slate-600 md:text-lg">
                          “{testimonial.quote}”
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
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-[#1f4569] hover:text-[#1f4569] md:flex"
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
