"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import type { Testimonial } from "@/lib/strapi";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [trackIndex, setTrackIndex] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout>();
  const activeTouchIdRef = useRef<number | null>(null);
  const animatingRef = useRef(false);

  const total = testimonials.length;
  const loopedTestimonials = useMemo(() => {
    if (total <= 1) return testimonials;
    return [
      testimonials[total - 1],
      ...testimonials,
      testimonials[0],
    ];
  }, [testimonials, total]);

  useEffect(() => {
    setIndex(0);
    setTrackIndex(total > 1 ? 1 : 0);
    setDragOffset(0);
    animatingRef.current = false;
    setIsAnimating(false);
    setTransitionEnabled(true);
  }, [total]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    if (isDragging || isPaused || isAnimating || animatingRef.current) return;

    const timer = setInterval(() => {
      animatingRef.current = true;
      setIsAnimating(true);
      setTransitionEnabled(true);
      setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
      setTrackIndex((currentTrack) => currentTrack + 1);
    }, 4200);
    return () => clearInterval(timer);
  }, [testimonials.length, isAnimating, isDragging, isPaused]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const goPrev = () => {
    if (total <= 1 || isAnimating || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setIndex((currentIndex) => (currentIndex - 1 + total) % total);
    setTrackIndex((currentTrack) => currentTrack - 1);
  };

  const goNext = () => {
    if (total <= 1 || isAnimating || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setIndex((currentIndex) => (currentIndex + 1) % total);
    setTrackIndex((currentTrack) => currentTrack + 1);
  };

  const goTo = (nextIndex: number) => {
    if (isAnimating || animatingRef.current || nextIndex === index) return;
    setPauseTimer();
    animatingRef.current = true;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setIndex(nextIndex);
    setTrackIndex(nextIndex + 1);
  };

  const handleTrackTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (total <= 1) return;

    if (trackIndex === 0) {
      setTransitionEnabled(false);
      setTrackIndex(total);
      animatingRef.current = false;
      setIsAnimating(false);
      return;
    }

    if (trackIndex === total + 1) {
      setTransitionEnabled(false);
      setTrackIndex(1);
      animatingRef.current = false;
      setIsAnimating(false);
      return;
    }

    animatingRef.current = false;
    setIsAnimating(false);
  };

  useEffect(() => {
    if (transitionEnabled) return;

    const frame = requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [transitionEnabled]);

  if (!testimonials.length) return null;

  const clampOffset = (value: number) => {
    const max = 240;
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
    if (isAnimating || animatingRef.current) return;

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
    } else {
      setTransitionEnabled(true);
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
    <section className="border-y border-slate-200 bg-[#f8f9fa] py-12 sm:py-14 md:py-16 text-slate-900">
      <Container className="space-y-8">
        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
            NHẬN XÉT KHÁCH HÀNG
          </h2>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />

            <button
              type="button"
              onClick={() => {
                setPauseTimer();
                goPrev();
              }}
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
                if (pauseTimeoutRef.current)
                  clearTimeout(pauseTimeoutRef.current);
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
                onTransitionEnd={handleTrackTransitionEnd}
                style={{
                  transform: `translateX(calc(${-trackIndex * 100}% + ${dragOffset}px))`,
                  transition: isDragging || !transitionEnabled
                    ? "none"
                    : "transform 760ms cubic-bezier(0.25, 0.8, 0.25, 1)",
                  willChange: "transform",
                }}
              >
                {loopedTestimonials.map((testimonial, loopIdx) => {
                  const realIdx =
                    total <= 1 ? loopIdx : (loopIdx - 1 + total) % total;
                  const prev = testimonials[(realIdx - 1 + total) % total];
                  const next = testimonials[(realIdx + 1) % total];

                  return (
                    <div
                      key={`${testimonial.name}-${loopIdx}`}
                      className="min-w-full px-1"
                    >
                      <div className="grid items-center gap-2 sm:grid-cols-[1fr_1.35fr_1fr] sm:gap-4">
                        <div className="mx-auto hidden h-44 w-32 overflow-hidden rounded-xl border border-slate-200 opacity-70 transition duration-500 hover:opacity-90 hover:shadow-md sm:block md:h-60 md:w-40">
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

                        <div className="mx-auto h-64 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-lg sm:h-80 sm:w-64 md:h-[360px] md:w-72">
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

                        <div className="mx-auto hidden h-44 w-32 overflow-hidden rounded-xl border border-slate-200 opacity-70 transition duration-500 hover:opacity-90 hover:shadow-md sm:block md:h-60 md:w-40">
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
              onClick={() => {
                setPauseTimer();
                goNext();
              }}
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
                onClick={() => goTo(idx)}
                aria-label={`Chuyển tới nhận xét ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
