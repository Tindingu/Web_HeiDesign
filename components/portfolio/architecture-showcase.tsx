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

const fallbackStyles = [
  "Hiện đại",
  "Tân cổ điển",
  "Minimalism",
  "Japandi",
  "Wabi Sabi",
  "Tropical",
  "Modern Luxury",
];

export function ArchitectureShowcase({
  projects,
  styles = [],
  initialTab,
  theme = "light",
}: ArchitectureShowcaseProps) {
  const styleTabs = useMemo<StyleTab[]>(() => {
    const source = styles.length > 0 ? styles : fallbackStyles.map((name, index) => ({ id: index + 1, name }));
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
        .flatMap((project) => [project.coverImage, ...(project.gallery ?? [])].map((image) => ({
          projectSlug: project.slug,
          projectTitle: project.title,
          url: image.url,
          alt: image.alt || project.title,
          blurDataURL: image.blurDataURL,
        })))
        .filter((image) => Boolean(image.url));

      acc[tab.id] = matchedImages;
      return acc;
    }, {});
  }, [sortedProjects, styleTabs]);

  const activeImages = imagesByTab[activeTab] ?? [];
  const isLight = theme === "light";

  return (
    <section
      className={`py-20 ${
        isLight ? "bg-background text-foreground" : "bg-[#070d1f] text-white"
      }`}
    >
      <Container className="space-y-10">
        <h2 className="text-4xl font-bold uppercase tracking-wide md:text-6xl">
          Kiến Trúc Nhà Phố
        </h2>

        <div
          className={`flex flex-wrap gap-6 pb-6 ${
            isLight ? "border-b border-border/60" : "border-b border-white/20"
          }`}
        >
          {styleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 text-sm font-semibold uppercase tracking-wider transition-colors ${
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
          <div className="grid gap-4 md:grid-cols-4">
            {activeImages.map((image, index) => (
              <Link
                key={`${image.projectSlug}-${index}-${image.url}`}
                href={`/du-an/${image.projectSlug}`}
                className="group relative block overflow-hidden rounded-sm"
              >
                <div className={`relative h-64 md:h-80 ${isLight ? "bg-muted/40" : "bg-white/5"}`}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    placeholder={image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={image.blurDataURL}
                  />
                </div>
                <div className="absolute inset-0 bg-black/15 transition duration-300 group-hover:bg-black/35" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/75">
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
