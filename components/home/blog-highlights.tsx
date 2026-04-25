"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { toCategorySlug } from "@/lib/post-category";
import type { Post } from "@/lib/strapi";

type BlogHighlightsProps = {
  posts: Post[];
  title?: string;
  description?: string;
};

type BlogTopic = {
  label: string;
  slug: string;
  count: number;
};

function formatPublishedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getTopics(posts: Post[]) {
  const map = new Map<string, BlogTopic>();

  for (const post of posts) {
    const label = post.category || "Tin tức";
    const slug = toCategorySlug(label || "tin-tuc");
    const existing = map.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(slug, { label, slug, count: 1 });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function BlogHighlights({
  posts,
  title = "Blog nổi bật",
  description = "",
}: BlogHighlightsProps) {
  const topics = useMemo(() => getTopics(posts), [posts]);
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [activePostSlug, setActivePostSlug] = useState<string>(
    posts[0]?.slug ?? "",
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopSetRef = useRef<HTMLDivElement>(null);
  const syncFrameRef = useRef<number | null>(null);

  const filteredPosts = useMemo(() => {
    if (activeTopic === "all") return posts;
    return posts.filter(
      (post) => toCategorySlug(post.category || "tin-tuc") === activeTopic,
    );
  }, [posts, activeTopic]);

  const leadPost = useMemo(() => {
    return (
      filteredPosts.find((post) => post.slug === activePostSlug) ??
      filteredPosts[0]
    );
  }, [filteredPosts, activePostSlug]);

  const listPosts = filteredPosts;
  const enableLoop = listPosts.length > 1;

  useEffect(() => {
    const firstPost = filteredPosts[0];
    if (!firstPost) return;

    setActivePostSlug(firstPost.slug);
    const container = scrollRef.current;
    if (container) {
      if (enableLoop && loopSetRef.current) {
        const loopHeight = loopSetRef.current.offsetHeight;
        container.scrollTo({ top: loopHeight, behavior: "auto" });
      } else {
        container.scrollTo({ top: 0, behavior: "auto" });
      }
    }
  }, [filteredPosts, enableLoop]);

  const syncLeadFromScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-post-slug]");
    if (cards.length === 0) return;

    const containerTop = container.getBoundingClientRect().top;
    let topCardSlug = cards[0].dataset.postSlug;
    let bestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const distance = card.getBoundingClientRect().top - containerTop;
      if (distance >= -8 && distance < bestDistance) {
        bestDistance = distance;
        topCardSlug = card.dataset.postSlug;
      }
    });

    if (topCardSlug) {
      setActivePostSlug(topCardSlug);
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (enableLoop && loopSetRef.current) {
      const loopHeight = loopSetRef.current.offsetHeight;
      if (loopHeight > 0) {
        if (container.scrollTop < loopHeight * 0.5) {
          container.scrollTop += loopHeight;
        } else if (container.scrollTop > loopHeight * 1.5) {
          container.scrollTop -= loopHeight;
        }
      }
    }

    if (syncFrameRef.current !== null) {
      cancelAnimationFrame(syncFrameRef.current);
    }
    syncFrameRef.current = requestAnimationFrame(() => {
      syncLeadFromScroll();
      syncFrameRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (syncFrameRef.current !== null) {
        cancelAnimationFrame(syncFrameRef.current);
      }
    };
  }, []);

  if (filteredPosts.length === 0) return null;

  return (
    <section className="border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20 text-slate-900">
      <Container className="space-y-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Blog & Inspiration
            </p>
            <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
              {title}
            </h2>
            {description ? (
              <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-3 self-start text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4569] transition hover:text-amber-600"
          >
            <span>Xem toàn bộ blog</span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm transition hover:border-[#1f4569]">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-3 rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTopic("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTopic === "all"
                  ? "bg-[#1f4569] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả
            </button>
            {topics.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                onClick={() => setActiveTopic(topic.slug)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTopic === topic.slug
                    ? "bg-[#1f4569] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {topic.label}
                <span className="ml-2 text-xs opacity-70">{topic.count}</span>
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          {leadPost && (
            <Link
              href={`/blog/${leadPost.slug}`}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={leadPost.coverImage?.url || "/upload/blog/blog-1.png"}
                  alt={leadPost.coverImage?.alt || leadPost.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  draggable={false}
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  placeholder={
                    leadPost.coverImage?.blurDataURL ? "blur" : "empty"
                  }
                  blurDataURL={leadPost.coverImage?.blurDataURL}
                />
              </div>

              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-3 text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {leadPost.category}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em]">
                    {formatPublishedDate(leadPost.publishedAt)}
                  </span>
                </div>

                <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-slate-900 transition group-hover:text-[#1f4569] md:text-3xl">
                  {leadPost.title}
                </h3>

                <div className="mt-4 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1f4569]">
                  <span>Đọc bài viết</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white transition group-hover:border-[#1f4569]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[560px] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.300)_transparent] lg:max-h-[620px]"
          >
            {enableLoop ? (
              <div className="space-y-4">
                {[0, 1, 2].map((copyIndex) => (
                  <div
                    key={`loop-copy-${copyIndex}`}
                    ref={copyIndex === 0 ? loopSetRef : undefined}
                    className="space-y-4"
                  >
                    {listPosts.map((post) => (
                      <div
                        key={`${copyIndex}-${post.slug}`}
                        data-post-slug={post.slug}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group grid grid-cols-[96px_1fr] gap-3 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                            <Image
                              src={
                                post.coverImage?.url ||
                                "/upload/blog/blog-1.png"
                              }
                              alt={post.coverImage?.alt || post.title}
                              fill
                              sizes="96px"
                              draggable={false}
                              className="object-cover transition duration-500 group-hover:scale-[1.05]"
                              placeholder={
                                post.coverImage?.blurDataURL ? "blur" : "empty"
                              }
                              blurDataURL={post.coverImage?.blurDataURL}
                            />
                          </div>

                          <div className="flex min-w-0 flex-col justify-between py-1 pr-1">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                <span>{post.category}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300" />
                                <span>
                                  {formatPublishedDate(post.publishedAt)}
                                </span>
                              </div>
                              <h3
                                className={`line-clamp-2 text-base font-semibold leading-snug transition md:text-lg ${activePostSlug === post.slug ? "text-[#1f4569]" : "text-slate-900 group-hover:text-[#1f4569]"}`}
                              >
                                {post.title}
                              </h3>
                            </div>

                            <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4569]">
                              <span>Xem bài</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {listPosts.map((post) => (
                  <div key={post.slug} data-post-slug={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid grid-cols-[96px_1fr] gap-3 rounded-[20px] border border-slate-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                        <Image
                          src={
                            post.coverImage?.url || "/upload/blog/blog-1.png"
                          }
                          alt={post.coverImage?.alt || post.title}
                          fill
                          sizes="96px"
                          draggable={false}
                          className="object-cover transition duration-500 group-hover:scale-[1.05]"
                          placeholder={
                            post.coverImage?.blurDataURL ? "blur" : "empty"
                          }
                          blurDataURL={post.coverImage?.blurDataURL}
                        />
                      </div>

                      <div className="flex min-w-0 flex-col justify-between py-1 pr-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            <span>{post.category}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{formatPublishedDate(post.publishedAt)}</span>
                          </div>
                          <h3
                            className={`line-clamp-2 text-base font-semibold leading-snug transition md:text-lg ${activePostSlug === post.slug ? "text-[#1f4569]" : "text-slate-900 group-hover:text-[#1f4569]"}`}
                          >
                            {post.title}
                          </h3>
                        </div>

                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4569]">
                          <span>Xem bài</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {listPosts.length === 0 && (
              <div className="rounded-[22px] border border-slate-200 bg-white p-6 text-slate-500">
                Chưa có thêm bài viết để hiển thị.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-600">
            {/* Khi cuộn danh sách bên phải, bài đầu tiên đang hiện sẽ được đưa lên
            khung lớn để đọc nhanh hơn. */}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f4569] transition hover:text-amber-600"
          >
            <span>Đi tới blog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
