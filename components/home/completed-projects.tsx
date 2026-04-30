"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/strapi";

type CompletedProjectsProps = {
  projects: Project[];
  categories?: Array<{ id: number; name: string }>;
  maxItemsPerTab?: number | null;
  showViewMoreButton?: boolean;
  initialTab?: string;
  theme?: "dark" | "light";
};

type ProjectTab = {
  id: string;
  label: string;
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

const categorySlugAliases: Record<string, string> = {
  "mau-nha-dep": "nha-dep",
  "phong-khach": "phong-khach",
  "phong-bep": "phong-bep",
  "phong-ngu": "phong-ngu",
  "phong-tam": "phong-tam",
};

function resolveTabId(label: string) {
  const normalized = slugifyText(label);
  return categorySlugAliases[normalized] || normalized;
}

export function CompletedProjects({
  projects,
  categories = [],
  maxItemsPerTab = 6,
  showViewMoreButton = true,
  initialTab,
  theme = "dark",
}: CompletedProjectsProps) {
  const projectTabs = useMemo<ProjectTab[]>(() => {
    const source = categories.filter(
      (category, index, array) =>
        index === array.findIndex((item) => item.name === category.name),
    );
    return source.map((category) => ({
      id: resolveTabId(category.name),
      label: category.name,
    }));
  }, [categories]);

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab && projectTabs.some((tab) => tab.id === initialTab)) {
      return initialTab;
    }
    return projectTabs[0]?.id ?? "";
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

  const projectsByTab = useMemo(() => {
    return projectTabs.reduce<Record<string, Project[]>>((acc, tab) => {
      const matchedProjects = sortedProjects.filter((project) => {
        const category = normalizeText(project.category || "");
        return category === normalizeText(tab.label);
      });

      acc[tab.id] =
        typeof maxItemsPerTab === "number"
          ? matchedProjects.slice(0, maxItemsPerTab)
          : matchedProjects;
      return acc;
    }, {});
  }, [sortedProjects, maxItemsPerTab]);

  const activeProjects = projectsByTab[activeTab] ?? [];
  const isLight = theme === "light";

  return (
    <section
      className={`py-12 sm:py-20 ${
        isLight ? "bg-background text-foreground" : "bg-[#070d1f] text-white"
      }`}
    >
      <Container className="space-y-8 sm:space-y-10">
        <h2 className="text-lg font-bold uppercase text-[#1f4569] sm:text-xl md:text-2xl">
          Dự Án Hoàn Thiện
        </h2>

        <div
          className={`grid grid-cols-2 gap-2 pb-5 sm:flex sm:flex-wrap sm:gap-6 sm:pb-6 ${
            isLight ? "border-b border-border/60" : "border-b border-white/20"
          }`}
        >
          {projectTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[42px] rounded-xl border px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors sm:min-h-0 sm:rounded-none sm:border-0 sm:px-0 sm:py-0 sm:pb-1 sm:text-sm sm:tracking-wider ${
                activeTab === tab.id
                  ? isLight
                    ? "border-amber-500 bg-amber-50 text-amber-600"
                    : "border-amber-400/60 bg-amber-500/10 text-amber-300"
                  : isLight
                    ? "border-border/70 bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
              }`}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-5 md:grid-cols-3 md:gap-6">
            {activeProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/du-an/${project.slug}`}
                className="group block"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg ${
                    isLight ? "bg-muted/40" : "bg-white/5"
                  }`}
                >
                  <Image
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <h3
                  className={`mt-2 line-clamp-2 text-xs font-medium leading-snug transition-colors sm:mt-3 sm:text-lg md:text-xl ${
                    isLight
                      ? "text-foreground group-hover:text-amber-600"
                      : "text-white group-hover:text-amber-300"
                  }`}
                >
                  {project.title}
                </h3>
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
            Chưa có dự án cho loại hình này.
          </div>
        )}

        {showViewMoreButton && (
          <div className="flex justify-end">
            <Link
              href={`/du-an?category=${activeTab}`}
              className={`inline-flex items-center gap-3 text-base font-semibold uppercase tracking-wide transition sm:gap-4 sm:text-lg ${
                isLight ? "hover:text-amber-600" : "hover:text-amber-300"
              }`}
            >
              <span>XEM THÊM</span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-current sm:h-14 sm:w-14">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
