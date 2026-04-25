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
  title = "DECOX CHANNEL",
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
    <section className="bg-[#efefef] py-10 text-slate-900 md:py-12">
      <Container>
        <div className="mx-auto max-w-[1060px]">
          <div className="grid items-start gap-6 lg:grid-cols-[220px_1fr]">
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

            <div className="space-y-3">
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
                className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
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
                      className={`group shrink-0 basis-[calc((100%-0.5rem)/2)] md:basis-[calc((100%-1rem)/3)] lg:basis-[calc((100%-1.5rem)/4)] overflow-hidden rounded border text-left transition ${
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
