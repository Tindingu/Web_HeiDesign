"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/lib/strapi";
import { PostCard } from "@/components/blog/post-card";

type RelatedPostsCarouselProps = {
  posts: Post[];
  categorySlug: string;
  title?: string;
  viewMoreLabel?: string;
  showTopBorder?: boolean;
};

function getCardsPerPage(width: number) {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

export function RelatedPostsCarousel({
  posts,
  categorySlug,
  title = "Bài viết cùng chủ đề",
  viewMoreLabel = "Xem thêm",
  showTopBorder = true,
}: RelatedPostsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const nextScrollLeftRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const [cardsPerPage, setCardsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const MIN_DRAG_DISTANCE = 6;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(posts.length / cardsPerPage)),
    [posts.length, cardsPerPage],
  );

  const hasOverflow = posts.length > cardsPerPage;

  // responsive
  useEffect(() => {
    const onResize = () => setCardsPerPage(getCardsPerPage(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getPageWidth = () => {
    const container = scrollRef.current;
    if (!container) return 0;

    const firstItem = container.firstElementChild as HTMLElement | null;
    if (!firstItem) return 0;

    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");

    return (firstItem.offsetWidth + gap) * cardsPerPage;
  };

  // ❌ KHÔNG LOOP nữa
  const scrollToPage = (targetPage: number, smooth = true) => {
    const container = scrollRef.current;
    if (!container) return;

    const pageWidth = getPageWidth();
    if (!pageWidth) return;

    const nextPage = Math.max(0, Math.min(targetPage, totalPages - 1));

    container.scrollTo({
      left: pageWidth * nextPage,
      behavior: smooth ? "smooth" : "auto",
    });

    setCurrentPage(nextPage);
  };

  const goPrev = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  // sync scroll → page
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isDraggingRef.current) return;

      const pageWidth = getPageWidth();
      if (!pageWidth) return;

      const page = Math.round(container.scrollLeft / pageWidth);
      const bounded = Math.max(0, Math.min(page, totalPages - 1));

      setCurrentPage(bounded);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardsPerPage, totalPages]);

  // auto scroll (dừng ở cuối)
  useEffect(() => {
    if (posts.length <= cardsPerPage) return;
    if (isInteracting) return;

    const id = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= totalPages - 1) return prev; // ❌ không loop
        const next = prev + 1;
        scrollToPage(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(id);
  }, [posts.length, cardsPerPage, totalPages, isInteracting]);

  // reset khi resize/data change
  useEffect(() => {
    scrollToPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardsPerPage, posts.length]);

  // drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;

    setIsInteracting(true);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const container = scrollRef.current;
    if (!container) return;

    e.preventDefault();

    const distance = e.clientX - dragStartXRef.current;
    if (Math.abs(distance) >= MIN_DRAG_DISTANCE) {
      hasDraggedRef.current = true;
    }

    nextScrollLeftRef.current = dragStartScrollLeftRef.current - distance;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      const activeContainer = scrollRef.current;
      if (activeContainer) {
        activeContainer.scrollLeft = nextScrollLeftRef.current;
      }
      rafIdRef.current = null;
    });
  };

  const stopDrag = () => {
    const container = scrollRef.current;
    const pageWidth = getPageWidth();
    if (container && pageWidth) {
      const nearestPage = Math.round(container.scrollLeft / pageWidth);
      const boundedPage = Math.max(0, Math.min(nearestPage, totalPages - 1));
      scrollToPage(boundedPage);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setIsInteracting(false);
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      className={
        showTopBorder ? "mt-16 border-t border-border/60 pt-10" : "space-y-6"
      }
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>

        <Link
          href={`/blog/chuyen-muc/${categorySlug}`}
          className="text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          {viewMoreLabel}
        </Link>
      </div>

      <div className="group relative flex items-center gap-3">
        {hasOverflow && (
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="absolute left-0 z-10 rounded-full border border-border/70 bg-background/90 p-2 text-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none md:-translate-x-1/2 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex flex-1 gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none ${
            isDragging
              ? "snap-none cursor-grabbing"
              : "snap-x snap-mandatory cursor-grab"
          }`}
          onDragStart={(event) => event.preventDefault()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {posts.map((post) => (
            <div
              key={post.slug}
              className="shrink-0 snap-start basis-[88%] sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
              onClickCapture={(event) => {
                if (hasDraggedRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  hasDraggedRef.current = false;
                }
              }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {hasOverflow && (
          <button
            onClick={goNext}
            disabled={currentPage === totalPages - 1}
            className="absolute right-0 z-10 rounded-full border border-border/70 bg-background/90 p-2 text-foreground transition hover:bg-muted disabled:opacity-30 disabled:pointer-events-none md:translate-x-1/2 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-end gap-4">
        <Link
          href={`/blog/chuyen-muc/${categorySlug}`}
          className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wide hover:text-amber-600"
        >
          Xem thêm
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/50">
            <ArrowRight className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
