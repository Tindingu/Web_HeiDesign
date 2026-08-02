"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import {
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  extractYouTubeId,
} from "@/lib/youtube";
import type { HomepageVideoItem } from "@/lib/homepage-video-storage";

type VideoSectionProps = {
  videos: HomepageVideoItem[];
  title?: string;
  subtitle?: string;
};

export function VideoSection({
  videos,
  title = "HEI CHANNEL",
  subtitle = "See more at Youtube",
}: VideoSectionProps) {
  const visibleVideos = useMemo(
    () =>
      videos.filter(
        (video) => video.isActive && extractYouTubeId(video.youtubeUrl),
      ),
    [videos],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const activeVideo = visibleVideos[activeIndex] ?? visibleVideos[0];

  useEffect(() => {
    if (!visibleVideos.length) return;
    setActiveIndex(0);
  }, [visibleVideos.length]);

  if (!activeVideo) return null;

  const videoId =
    activeVideo.youtubeId || extractYouTubeId(activeVideo.youtubeUrl);
  if (!videoId) return null;

  const embedUrl = buildYouTubeEmbedUrl(videoId);

  const scrollByStep = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.max(rail.clientWidth * 0.8, 320);
    rail.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    isDraggingRef.current = true;
    startXRef.current = event.pageX - rail.offsetLeft;
    startScrollLeftRef.current = rail.scrollLeft;
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDraggingRef.current) return;
    const rail = railRef.current;
    if (!rail) return;
    event.preventDefault();
    const x = event.pageX - rail.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    rail.scrollLeft = startScrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="overflow-x-clip bg-[#f8f9fa] py-10 text-slate-900 md:py-12">
      <Container>
        <div className="mx-auto max-w-[1060px]">
          <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-4 pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Video
              </p>
              <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
                {title}
              </h2>
              {/* <p className="text-sm text-slate-500">{subtitle}</p> */}
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 pt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#b08645] transition hover:text-[#1f4569]"
              >
                <span>Xem thêm tại Youtube</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition group-hover:border-[#1f4569]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="overflow-hidden rounded-lg border border-slate-300/70 bg-black shadow-sm">
                <div className="relative aspect-[16/9] w-full">
                  <iframe
                    src={embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Video khác
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => scrollByStep("left")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
                    aria-label="Lướt thumbnail sang trái"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollByStep("right")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
                    aria-label="Lướt thumbnail sang phải"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div
                ref={railRef}
                className="flex w-full max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseLeave={stopDragging}
                onMouseUp={stopDragging}
              >
                {visibleVideos.map((video, index) => {
                  const thumb =
                    video.thumbnailUrl ||
                    buildYouTubeThumbnailUrl(video.youtubeId);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={video.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group shrink-0 basis-[45%] sm:basis-[calc((100%-0.5rem)/2)] md:basis-[calc((100%-1rem)/3)] lg:basis-[calc((100%-1.5rem)/4)] overflow-hidden rounded border text-left transition ${
                        isActive
                          ? "border-[#1f4569] shadow-sm"
                          : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <img
                          src={thumb}
                          alt={video.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/25" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700">
                            <Play
                              className="ml-0.5 h-3.5 w-3.5"
                              fill="currentColor"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-slate-200/80 bg-white px-2 py-2">
                        <p className="line-clamp-2 text-[11px] font-medium leading-4 text-slate-700">
                          {video.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

type ShortVideoSectionProps = {
  videos: HomepageVideoItem[];
  title?: string;
  subtitle?: string;
};

export function ShortVideoSection({
  videos,
  title = "SHORT VIDEO",
  subtitle = "Xem thêm tại Youtube Shorts",
}: ShortVideoSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const visibleVideos = useMemo(
    () =>
      videos.filter(
        (video) => video.isActive && extractYouTubeId(video.youtubeUrl),
      ),
    [videos],
  );

  if (visibleVideos.length === 0) return null;

  const scrollByStep = (direction: "left" | "right") => {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.max(rail.clientWidth, 320);
    rail.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const rail = railRef.current;
    if (!rail) return;
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    startXRef.current = event.pageX - rail.offsetLeft;
    startScrollLeftRef.current = rail.scrollLeft;
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDraggingRef.current) return;
    const rail = railRef.current;
    if (!rail) return;
    event.preventDefault();
    const x = event.pageX - rail.offsetLeft;
    const walk = (x - startXRef.current) * 1.15;
    dragDistanceRef.current = Math.max(dragDistanceRef.current, Math.abs(walk));
    rail.scrollLeft = startScrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  return (
    <section className="overflow-x-clip bg-[#f8f9fa] py-12 text-slate-900 md:py-14">
      <Container>
        <div className="group mx-auto grid max-w-[1060px] gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
          <div className="space-y-5 lg:pt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Youtube Shorts
            </p>
            <h2 className="text-2xl font-bold uppercase text-[#1f4569] md:text-3xl">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
            <a
              href={visibleVideos[0]?.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition duration-300 hover:border-[#c8922e] hover:bg-[#c8922e] hover:text-white"
              aria-label="Xem thêm tại Youtube Shorts"
            >
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div className="relative min-w-0">
            {visibleVideos.length > 4 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollByStep("left")}
                  className="absolute left-0 top-[42%] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 opacity-0 shadow-md transition duration-300 hover:border-[#c8922e] hover:text-[#c8922e] group-hover:opacity-100 lg:flex"
                  aria-label="Lướt short video sang trái"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByStep("right")}
                  className="absolute right-0 top-[42%] z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 opacity-0 shadow-md transition duration-300 hover:border-[#c8922e] hover:text-[#c8922e] group-hover:opacity-100 lg:flex"
                  aria-label="Lướt short video sang phải"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div
              ref={railRef}
              className="flex snap-x snap-mandatory cursor-grab gap-2.5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] active:cursor-grabbing sm:gap-4 [&::-webkit-scrollbar]:hidden"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseLeave={stopDragging}
              onMouseUp={stopDragging}
            >
              {visibleVideos.map((video) => {
                const videoId =
                  video.youtubeId || extractYouTubeId(video.youtubeUrl);
                const thumb =
                  video.thumbnailUrl ||
                  (videoId ? buildYouTubeThumbnailUrl(videoId) : "");

                return (
                  <article
                    key={video.id}
                    className="group/card min-w-0 shrink-0 basis-[calc((100%-0.625rem)/2)] snap-start sm:basis-[calc((100%-1rem)/2)] md:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-3rem)/4)]"
                  >
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded bg-neutral-900 shadow-sm">
                      {videoId ? (
                        <iframe
                          src={buildYouTubeEmbedUrl(videoId)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full border-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-neutral-200">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={video.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block line-clamp-3 text-[11px] font-semibold leading-4 text-slate-700 transition hover:text-[#c8922e] sm:mt-3 sm:text-sm sm:leading-6"
                    >
                      {video.title}
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
