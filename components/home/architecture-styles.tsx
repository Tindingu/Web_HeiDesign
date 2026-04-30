"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";
import type { Project } from "@/lib/strapi";

type ArchitectureStylesProps = {
  projects: Project[];
  styles?: Array<{ id: number; name: string }>;
  curatedItems?: Array<{
    styleSlug: string;
    projectSlug: string;
    projectTitle: string;
    slotIndex: number;
    orientation: "landscape" | "portrait" | "square";
    imageUrl: string;
    imageAlt: string;
  }>;
  initialTab?: string;
};

type StyleTab = {
  id: string;
  label: string;
};

type StyleImageItem = {
  projectSlug: string;
  projectTitle: string;
  url: string;
  alt: string;
  slotIndex?: number;
  orientation?: "landscape" | "portrait" | "square";
  blurDataURL?: string;
};

const masonryHeights = [
  "h-56 md:h-64",
  "h-80 md:h-[22rem]",
  "h-64 md:h-72",
  "h-72 md:h-80",
  "h-52 md:h-60",
];

function getMasonryHeight(index: number) {
  return masonryHeights[index % masonryHeights.length];
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugifyText(value: string) {
  return normalizeText(value)
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fallbackStyles = [
  "Hiện đại",
  "Tân cổ điển",
  "Minimalism",
  "Japandi",
  "Wabi Sabi",
  "Tropical",
  "Modern Luxury",
];

const CURATED_SLOT_COUNT = 12;

export function ArchitectureStyles({
  projects,
  styles = [],
  curatedItems = [],
  initialTab,
}: ArchitectureStylesProps) {
  const styleTabs = useMemo<StyleTab[]>(() => {
    const source =
      styles.length > 0
        ? styles
        : fallbackStyles.map((name, index) => ({ id: index + 1, name }));
    return source.map((style) => ({
      id: slugifyText(style.name),
      label: style.name,
    }));
  }, [styles]);

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab && styleTabs.some((tab) => tab.id === initialTab)) {
      return initialTab;
    }
    return styleTabs[0]?.id ?? "";
  });

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const featuredOrder =
        Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      if (featuredOrder !== 0) return featuredOrder;

      const dateA = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const dateB = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [projects]);

  const imagesByTab = useMemo(() => {
    return styleTabs.reduce<Record<string, StyleImageItem[]>>((acc, tab) => {
      const matchedProjects = sortedProjects.filter((project) => {
        const projectStyle = normalizeText(project.style || "");
        return projectStyle === normalizeText(tab.label);
      });

      const matchedImages = matchedProjects
        .flatMap((project) =>
          [project.coverImage, ...(project.gallery ?? [])].map((image) => ({
            projectSlug: project.slug,
            projectTitle: project.title,
            url: image.url,
            alt: image.alt || project.title,
            blurDataURL: image.blurDataURL,
          })),
        )
        .filter((image) => Boolean(image.url));

      acc[tab.id] = matchedImages;
      return acc;
    }, {});
  }, [sortedProjects, styleTabs]);

  const curatedByTab = useMemo(() => {
    return curatedItems.reduce<Record<string, StyleImageItem[]>>(
      (acc, item) => {
        const key = item.styleSlug;
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          projectSlug: item.projectSlug,
          projectTitle: item.projectTitle,
          url: item.imageUrl,
          alt: item.imageAlt || item.projectTitle,
          slotIndex: item.slotIndex,
          orientation: item.orientation,
        });
        return acc;
      },
      {},
    );
  }, [curatedItems]);

  const curatedActive = (curatedByTab[activeTab] ?? [])
    .slice()
    .sort((a, b) => (a.slotIndex ?? 0) - (b.slotIndex ?? 0));

  const activeImages =
    curatedActive.length >= CURATED_SLOT_COUNT
      ? curatedActive
      : (imagesByTab[activeTab] ?? []);

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 2,
    640: 2,
  };

  return (
    <section className="bg-[#f3f6fa] py-20 text-slate-900">
      <Container className="space-y-12">
        <h2 className="text-xl font-bold uppercase text-[#1f4569] md:text-2xl">
          KIẾN TRÚC NHÀ PHỐ
        </h2>

        <div className="flex flex-wrap gap-6 border-b border-slate-200 pb-6">
          {styleTabs.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveTab(style.id)}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeTab === style.id
                  ? "text-[#1f4569]"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {activeImages.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="-ml-2 flex w-auto sm:-ml-4"
            columnClassName="space-y-2 pl-2 bg-clip-padding sm:space-y-4 sm:pl-4"
          >
            {activeImages.map((image, index) => (
              <Link
                key={`${image.projectSlug}-${index}-${image.url}`}
                href={`/du-an/${image.projectSlug}`}
                className="group relative block overflow-hidden"
              >
                <div
                  className={`relative ${
                    image.orientation
                      ? image.orientation === "landscape"
                        ? "aspect-[4/3]"
                        : image.orientation === "portrait"
                          ? "aspect-[3/4]"
                          : "aspect-square"
                      : getMasonryHeight(index)
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                    placeholder={image.blurDataURL ? "blur" : undefined}
                    blurDataURL={image.blurDataURL}
                  />
                </div>
                <div className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/25" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/85">
                    {image.projectTitle}
                  </p>
                </div>
              </Link>
            ))}
          </Masonry>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-6 text-slate-500">
            Chưa có ảnh cho style này.
          </div>
        )}

        <div className="flex justify-end">
          <Link
            href={`/du-an?style=${activeTab}`}
            className="inline-flex items-center gap-3 text-lg font-semibold transition hover:text-[#1f4569]"
          >
            <span>XEM THÊM</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current">
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
