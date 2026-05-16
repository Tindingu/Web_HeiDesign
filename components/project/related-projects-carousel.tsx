"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ruler,
} from "lucide-react";
import { Project } from "@/lib/strapi";

interface RelatedProjectsCarouselProps {
  projects: Project[];
}

export function RelatedProjectsCarousel({
  projects,
}: RelatedProjectsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isGliding, setIsGliding] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const totalDragDistanceRef = useRef(0);
  const velocityRef = useRef(0);
  const dragFrameRef = useRef<number | null>(null);
  const momentumFrameRef = useRef<number | null>(null);
  const pendingScrollLeftRef = useRef(0);
  const didDragRef = useRef(false);
  const MIN_DRAG_DISTANCE = 5;
  const cloneCount = Math.min(projects.length, 3);
  const carouselProjects =
    projects.length > 1
      ? [
          ...projects.slice(-cloneCount),
          ...projects,
          ...projects.slice(0, cloneCount),
        ]
      : projects;

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (projects.length > 1) {
      setCanScrollLeft(true);
      setCanScrollRight(true);
      return;
    }

    setCanScrollLeft(false);
    setCanScrollRight(false);
  }, [projects.length]);

  const getRealRange = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || projects.length <= 1) return null;

    const firstRealCard = container.children[cloneCount] as HTMLElement;
    const firstCloneAfterReal = container.children[
      cloneCount + projects.length
    ] as HTMLElement;

    if (!firstRealCard || !firstCloneAfterReal) return null;

    return {
      end: firstCloneAfterReal.offsetLeft,
      start: firstRealCard.offsetLeft,
    };
  }, [cloneCount, projects.length]);

  const syncInfinitePosition = useCallback(() => {
    const container = scrollContainerRef.current;
    const range = getRealRange();
    if (!container || !range) return;

    const { start, end } = range;

    if (container.scrollLeft >= end) {
      container.scrollLeft = start + (container.scrollLeft - end);
    } else if (container.scrollLeft < start) {
      container.scrollLeft = end - (start - container.scrollLeft);
    }
  }, [getRealRange]);

  const handleScroll = useCallback(() => {
    syncInfinitePosition();
    checkScroll();
  }, [checkScroll, syncInfinitePosition]);

  const stopMomentum = () => {
    if (momentumFrameRef.current === null) return;

    window.cancelAnimationFrame(momentumFrameRef.current);
    momentumFrameRef.current = null;
    setIsGliding(false);
  };

  const updateScrollLeft = (nextScrollLeft: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    pendingScrollLeftRef.current = nextScrollLeft;

    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = window.requestAnimationFrame(() => {
      const activeContainer = scrollContainerRef.current;
      if (activeContainer) {
        activeContainer.scrollLeft = pendingScrollLeftRef.current;
        syncInfinitePosition();
      }
      dragFrameRef.current = null;
    });
  };

  const startMomentum = () => {
    const container = scrollContainerRef.current;
    if (!container || Math.abs(velocityRef.current) < 0.08) return;

    setIsGliding(true);

    const animate = () => {
      const activeContainer = scrollContainerRef.current;
      if (!activeContainer) {
        momentumFrameRef.current = null;
        setIsGliding(false);
        return;
      }

      activeContainer.scrollLeft -= velocityRef.current * 16;
      syncInfinitePosition();
      velocityRef.current *= 0.92;

      if (Math.abs(velocityRef.current) < 0.04) {
        momentumFrameRef.current = null;
        setIsGliding(false);
        return;
      }

      momentumFrameRef.current = window.requestAnimationFrame(animate);
    };

    momentumFrameRef.current = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, handleScroll]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const range = getRealRange();
    container.scrollTo({ left: range?.start ?? 0, behavior: "auto" });
    checkScroll();
  }, [checkScroll, getRealRange, projects.length]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.querySelector("a");
    const cardWidth = firstCard
      ? (firstCard as HTMLElement).getBoundingClientRect().width
      : 0;
    const containerStyles = window.getComputedStyle(container);
    const gap = parseFloat(
      containerStyles.columnGap || containerStyles.gap || "0",
    );
    const scrollAmount = cardWidth + gap;
    const newScrollLeft =
      container.scrollLeft +
      (direction === "left" ? -scrollAmount : scrollAmount);

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    window.setTimeout(syncInfinitePosition, 420);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    stopMomentum();
    didDragRef.current = false;
    totalDragDistanceRef.current = 0;
    velocityRef.current = 0;
    pointerIdRef.current = e.pointerId;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    container.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || pointerIdRef.current !== e.pointerId) return;

    const now = performance.now();
    const deltaX = e.clientX - lastPointerXRef.current;
    const deltaTime = Math.max(now - lastPointerTimeRef.current, 1);
    totalDragDistanceRef.current += deltaX;
    velocityRef.current = deltaX / deltaTime;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    if (Math.abs(totalDragDistanceRef.current) > MIN_DRAG_DISTANCE) {
      didDragRef.current = true;
    }

    updateScrollLeft(container.scrollLeft - deltaX);
  };

  const stopDragging = (e?: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (container && pointerIdRef.current !== null) {
      try {
        container.releasePointerCapture(pointerIdRef.current);
      } catch {
        // Pointer capture may already be released by the browser.
      }
    }

    pointerIdRef.current = null;
    setIsDragging(false);
    checkScroll();
    startMomentum();
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    didDragRef.current = false;
  };

  if (projects.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {/* <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            Portfolio
          </p> */}
          <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">
            Các Dự Án Nổi Bật Khác
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Khám phá thêm những không gian đã hoàn thiện bởi Hei Design.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:text-amber-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-gray-200 disabled:hover:text-gray-800 disabled:hover:shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-950 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex flex-1 cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 select-none active:cursor-grabbing sm:gap-5 lg:gap-6"
        style={{
          scrollBehavior: isDragging || isGliding ? "auto" : "smooth",
          scrollSnapType: isDragging || isGliding ? "none" : "x mandatory",
          scrollbarWidth: "none",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onClickCapture={handleClickCapture}
      >
        {carouselProjects.map((project, index) => (
          <Link
            key={`${project.id}-${index}`}
            href={`/du-an/${project.slug}`}
            className="group relative min-w-[82%] basis-[82%] flex-shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_20px_40px_rgba(15,23,42,0.13)] sm:min-w-[calc((100%-1.25rem)/2)] sm:basis-[calc((100%-1.25rem)/2)] lg:min-w-[calc((100%-3rem)/3)] lg:basis-[calc((100%-3rem)/3)]"
            draggable="false"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src={project.coverImage.url}
                alt={project.coverImage.alt || project.title}
                fill
                className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/45 via-gray-950/5 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-900 shadow-sm backdrop-blur">
                {project.category}
              </span>
              <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-950 shadow-md transition-all group-hover:bg-amber-600 group-hover:text-white">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex min-h-[7.75rem] flex-col justify-between gap-3">
                <div>
                  <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-snug text-gray-950 transition-colors group-hover:text-amber-700">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="mt-2 line-clamp-1 text-sm leading-6 text-gray-600">
                      {project.summary}
                    </p>
                  )}
                </div>

                <div className="flex min-h-[1.75rem] flex-wrap gap-2 text-xs font-medium text-gray-600">
                  {project.projectDetails?.area && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      <Ruler className="h-3.5 w-3.5 text-amber-600" />
                      {project.projectDetails.area}
                    </span>
                  )}
                  {project.projectDetails?.location && (
                    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                      <span className="truncate">
                        {project.projectDetails.location}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
