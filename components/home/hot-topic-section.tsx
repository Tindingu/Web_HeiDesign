"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { toCategorySlug } from "@/lib/post-category";
import type { Post } from "@/lib/strapi";
import type { HotBlogTopicSettings } from "@/lib/hot-blog-topic-storage";

type HotTopicSectionProps = {
  settings: HotBlogTopicSettings;
  posts: Post[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

const CARD_WIDTH = 288; // px — used for arrow scroll step

export function HotTopicSection({ settings, posts }: HotTopicSectionProps) {
  const topicPosts = posts.filter(
    (post) => toCategorySlug(post.category || "tin-tuc") === settings.topicSlug,
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const [dragging, setDragging] = useState(false);

  const scrollBy = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + 20) : CARD_WIDTH + 20,
      behavior: "smooth",
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current.scrollLeft;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    scrollRef.current.scrollLeft = scrollStartLeft.current - delta;
  };

  const onPointerUp = () => {
    isDragging.current = false;
    setDragging(false);
  };

  if (topicPosts.length === 0) return null;

  const validBanners = settings.bannerImageUrls.filter(
    (u) => u.trim().length > 0,
  );

  return (
    <section className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20 text-slate-900">
      {/* ── Header ────────────────────────────────────────── */}
      <Container className="mb-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            {/* <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700">
              <Flame className="h-3.5 w-3.5" />
              Chủ đề hot
            </span> */}
            {/* <h2 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              {settings.topicLabel}
            </h2> */}
          </div>
          <Link
            href={`/blog?category=${settings.topicSlug}`}
            className="flex w-full items-center justify-center gap-4 text-xl font-bold uppercase text-[#1f4569] transition hover:text-amber-600 before:h-[1px] before:w-12 before:bg-[#1f4569] after:h-[1px] after:w-12 after:bg-[#1f4569] md:before:w-32 md:after:w-32"
          >
            <span>{settings.topicLabel}</span>
          </Link>
        </div>
      </Container>

      {/* ── Banner images — contained width, stacked, no rounding ── */}
      {validBanners.length > 0 && (
        <div className="mb-10 mx-auto w-full max-w-6xl px-6">
          {validBanners.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`${settings.topicLabel} banner ${i + 1}`}
              className="h-auto w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
      )}

      {/* ── Cards — horizontal drag scroll ────────────────── */}
      <Container>
        <div className="relative">
          {/* Arrow left */}
          <button
            type="button"
            onClick={() => scrollBy("left")}
            aria-label="Cuộn sang trái"
            className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-[#1f4569] hover:text-[#1f4569] lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Arrow right */}
          <button
            type="button"
            onClick={() => scrollBy("right")}
            aria-label="Cuộn sang phải"
            className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-[#1f4569] hover:text-[#1f4569] lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ cursor: dragging ? "grabbing" : "grab" }}
            className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
          >
            {topicPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClickCapture={(e) => {
                  if (hasDragged.current) e.preventDefault();
                  hasDragged.current = false;
                }}
                draggable={false}
                className="group w-72 flex-shrink-0 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.coverImage?.url || "/upload/blog/blog-1.png"}
                    alt={post.coverImage?.alt || post.title}
                    fill
                    sizes="288px"
                    draggable={false}
                    className="object-cover transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <span>{post.category}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition group-hover:text-[#1f4569] md:text-base">
                    {post.title}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4569]">
                    <span>Xem bài</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile swipe hint */}
          {topicPosts.length > 2 && (
            <p className="mt-2 text-center text-xs text-slate-400 lg:hidden">
              Vuốt để xem thêm
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
