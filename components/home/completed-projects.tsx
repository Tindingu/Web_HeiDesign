"use client";

import { SmartImage as Image } from "@/components/shared/smart-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/strapi";
import { Http2ServerRequest } from "http2";

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
  }, [sortedProjects, maxItemsPerTab, projectTabs]);

  const activeProjects = projectsByTab[activeTab] ?? [];
  const isLight = theme === "light";

  return (
    <section
      className={`py-8 md:py-10 ${
        isLight ? "bg-background text-foreground" : "bg-[#070d1f] text-white"
      }`}
    >
      <Container className="space-y-6 sm:space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-[#1f4569] sm:text-xl md:text-2xl">
              Dự Án Hoàn Thiện
            </h2>
          </div>
        </div>

        <div
          className={`flex gap-3 overflow-x-auto pb-3 sm:flex-wrap sm:gap-6 sm:pb-4 ${
            isLight ? "border-b border-border/60" : "border-b border-white/20"
          }`}
        >
          {projectTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] shrink-0 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                activeTab === tab.id
                  ? "bg-[#1f4569] text-white shadow-sm"
                  : isLight
                    ? "bg-white text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {activeProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/du-an/${project.slug}`}
                className="group block"
              >
                <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_rgba(15,23,42,0.14)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={project.coverImage.url}
                      alt={project.coverImage.alt || project.title}
                      fill
                      className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:brightness-[0.93] group-hover:rotate-[0.4deg]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/30 via-black/5 to-transparent transition-all duration-700 group-hover:opacity-0" />

                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                      <div className="relative h-[42%] w-[42%] max-h-[190px] max-w-[190px] translate-y-10 scale-90 opacity-0 drop-shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                        <Image
                          src="/upload/logo/trang_khong_nen.png"
                          alt="Hei Design"
                          fill
                          className="object-contain brightness-110"
                          sizes="190px"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 p-3 text-center sm:p-4">
                    <h3 className="min-h-[2rem] text-[15px] font-semibold leading-snug tracking-[0.01em] text-slate-900 transition-colors duration-300 group-hover:text-[#1f4569] sm:text-base">
                      {project.title}
                    </h3>
                  </div>
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
            Chưa có dự án cho loại hình này.
          </div>
        )}

        {showViewMoreButton && (
          <div className="flex justify-end pt-2">
            <Link
              href={`/du-an?category=${activeTab}`}
              className={`inline-flex items-center gap-3 text-base font-semibold uppercase tracking-wide transition sm:gap-4 sm:text-lg ${
                isLight ? "hover:text-amber-600" : "hover:text-amber-300"
              }`}
            >
              <span>Xem thêm</span>
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