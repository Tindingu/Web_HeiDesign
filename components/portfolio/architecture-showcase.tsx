"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/strapi";

type ArchitectureShowcaseProps = {
  projects: Project[];
  styles?: Array<{ id: number; name: string }>;
  initialTab?: string;
  theme?: "dark" | "light";
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
  blurDataURL?: string;
};

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

export function ArchitectureShowcase({
  projects,
  styles = [],
  initialTab,
  theme = "light",
}: ArchitectureShowcaseProps) {
  const styleTabs = useMemo<StyleTab[]>(() => {
    const source = styles.length > 0 ? styles : [];
    const unique = source.filter(
      (style, index, array) =>
        index === array.findIndex((s) => s.name === style.name),
    );
    return unique.map((style) => ({
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

  const activeImages = imagesByTab[activeTab] ?? [];
  const isLight = theme === "light";
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});

  return (
    <section
      className={`py-20 ${
        isLight ? "bg-background text-foreground" : "bg-[#070d1f] text-white"
      }`}
    >
      <Container className="space-y-10">
        <h2 className="text-2xl font-bold uppercase tracking-wide sm:text-3xl md:text-6xl">
          Kiến Trúc Nhà Phố
        </h2>

        <div
          className={`flex flex-wrap gap-x-4 gap-y-3 pb-6 sm:gap-6 ${
            isLight ? "border-b border-border/60" : "border-b border-white/20"
          }`}
        >
          {styleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap pb-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors sm:text-sm sm:tracking-wider ${
                activeTab === tab.id
                  ? "text-amber-500"
                  : isLight
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {activeImages.map((image, index) => (
              <Link
                key={`${image.projectSlug}-${index}-${image.url}`}
                href={`/du-an/${image.projectSlug}`}
                className="group relative block overflow-hidden"
              >
                <div
                  className={`relative aspect-[3/4] sm:h-64 sm:aspect-auto md:h-80 ${isLight ? "bg-muted/40" : "bg-white/5"}`}
                >
                  {brokenImages[`${image.projectSlug}-${index}`] ? (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-xs text-gray-400">
                        Ảnh không tải được
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      unoptimized
                      onError={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [`${image.projectSlug}-${index}`]: true,
                        }))
                      }
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw"
                      placeholder={image.blurDataURL ? "blur" : undefined}
                      blurDataURL={image.blurDataURL}
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/15 transition duration-300 group-hover:bg-black/35" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-left sm:p-4">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/75 sm:text-xs sm:tracking-[0.2em]">
                    {image.projectTitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className={`rounded-sm p-6 ${
              isLight
                ? "border border-border/60 bg-muted/20 text-muted-foreground"
                : "border border-white/15 bg-white/[0.03] text-white/70"
            }`}
          >
            Chưa có ảnh cho style này.
          </div>
        )}
      </Container>
    </section>
  );
}
