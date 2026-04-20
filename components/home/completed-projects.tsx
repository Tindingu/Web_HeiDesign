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

const fallbackCategories = [
  "Mẫu nhà đẹp",
  "Phòng khách",
  "Phòng bếp",
  "Phòng ngủ",
  "Phòng tắm",
];

export function CompletedProjects({
  projects,
  categories = [],
  maxItemsPerTab = 6,
  showViewMoreButton = true,
  initialTab,
  theme = "dark",
}: CompletedProjectsProps) {
  const projectTabs = useMemo<ProjectTab[]>(() => {
    const mergedSource = [
      ...fallbackCategories.map((name, index) => ({ id: index + 1, name })),
      ...categories,
    ];
    const source = mergedSource.filter(
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
      className={`py-20 ${
        isLight ? "bg-background text-foreground" : "bg-[#070d1f] text-white"
      }`}
    >
      <Container className="space-y-10">
        <h2 className="text-4xl font-bold uppercase tracking-wide md:text-6xl">
          Dự Án Hoàn Thiện
        </h2>

        <div
          className={`flex flex-wrap gap-6 pb-6 ${
            isLight ? "border-b border-border/60" : "border-b border-white/20"
          }`}
        >
          {projectTabs.map((tab) => (
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
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {activeProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {activeProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/du-an/${project.slug}`}
                className="group block"
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-sm ${
                    isLight ? "bg-muted/40" : "bg-white/5"
                  }`}
                >
                  <Image
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3
                  className={`mt-3 line-clamp-2 text-xl font-medium leading-snug transition-colors ${
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
              className={`inline-flex items-center gap-4 text-lg font-semibold uppercase tracking-wide transition ${
                isLight ? "hover:text-amber-600" : "hover:text-amber-300"
              }`}
            >
              <span>XEM THÊM</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-current">
                <ArrowRight className="h-6 w-6" />
              </div>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
