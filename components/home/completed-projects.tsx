"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/strapi";

type CompletedProjectsProps = {
  projects: Project[];
  maxItemsPerTab?: number | null;
  showViewMoreButton?: boolean;
  initialTab?: string;
  theme?: "dark" | "light";
};

const projectTabs = [
  {
    id: "biet-thu",
    label: "BIỆT THỰ",
    aliases: ["biệt thự", "biet thu", "villa"],
  },
  {
    id: "nha-pho",
    label: "NHÀ PHỐ",
    aliases: ["nhà phố", "nha pho", "townhouse"],
  },
  {
    id: "can-ho",
    label: "CĂN HỘ",
    aliases: ["căn hộ", "can ho", "chung cư", "chung cu", "apartment"],
  },
  {
    id: "cong-trinh-dich-vu",
    label: "CÔNG TRÌNH DỊCH VỤ",
    aliases: [
      "công trình dịch vụ",
      "cong trinh dich vu",
      "khách sạn",
      "khach san",
      "spa",
      "cafe",
      "coffee",
      "nhà hàng",
      "nha hang",
      "shop",
      "showroom",
      "service",
    ],
  },
] as const;

type ProjectTabId = (typeof projectTabs)[number]["id"];

function isProjectTabId(value: string): value is ProjectTabId {
  return projectTabs.some((tab) => tab.id === value);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function CompletedProjects({
  projects,
  maxItemsPerTab = 6,
  showViewMoreButton = true,
  initialTab,
  theme = "dark",
}: CompletedProjectsProps) {
  const [activeTab, setActiveTab] = useState<ProjectTabId>(() => {
    if (initialTab && isProjectTabId(initialTab)) return initialTab;
    return projectTabs[0].id;
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
    return projectTabs.reduce<Record<ProjectTabId, Project[]>>(
      (acc, tab) => {
        const matchedProjects = sortedProjects.filter((project) => {
          const category = normalizeText(project.category || "");
          return tab.aliases.some((alias) =>
            category.includes(normalizeText(alias)),
          );
        });

        acc[tab.id] =
          typeof maxItemsPerTab === "number"
            ? matchedProjects.slice(0, maxItemsPerTab)
            : matchedProjects;
        return acc;
      },
      {
        "biet-thu": [],
        "nha-pho": [],
        "can-ho": [],
        "cong-trinh-dich-vu": [],
      },
    );
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
              {tab.label}
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
              href={`/du-an?type=${activeTab}`}
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
