"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import type { PortfolioFilters, Project } from "@/lib/strapi";
import { usePortfolioStore } from "@/store/portfolio-store";

export function PortfolioExplorer({
  projects,
  filters,
}: {
  projects: Project[];
  filters: PortfolioFilters;
}) {
  const {
    style,
    category,
    budget,
    page,
    perPage,
    setStyle,
    setCategory,
    setBudget,
    setPage,
    reset,
  } = usePortfolioStore();

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (style && project.style !== style) return false;
      if (category && project.category !== category) return false;
      if (budget && project.budget !== budget) return false;
      return true;
    });
  }, [projects, style, category, budget]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <section className="py-16">
      <Container className="space-y-10">
        <SectionHeading
          label="Dự án"
          title="Kho dự án"
          description="Lọc theo phong cách, loại hình và ngân sách mà không cần tải lại trang."
        />

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/30 p-5 md:grid-cols-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Phong cách
            </p>
            <select
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
              value={style ?? ""}
              onChange={(event) => setStyle(event.target.value || null)}
            >
              <option value="">Tất cả</option>
              {filters.styles.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Loại hình
            </p>
            <select
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
              value={category ?? ""}
              onChange={(event) => setCategory(event.target.value || null)}
            >
              <option value="">Tất cả</option>
              {filters.categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Ngân sách
            </p>
            <select
              className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
              value={budget ?? ""}
              onChange={(event) => setBudget(event.target.value || null)}
            >
              <option value="">Tất cả</option>
              {filters.budgets.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={reset}>
              Đặt lại
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {pageItems.map((project) => (
            <Link
              key={project.slug}
              href={`/du-an/${project.slug}`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-muted/30"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={project.coverImage.url}
                  alt={project.coverImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  placeholder="blur"
                  blurDataURL={project.coverImage.blurDataURL}
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {project.style} · {project.budget}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
