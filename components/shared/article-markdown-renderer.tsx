"use client";

import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { MarkdownRendererV2 } from "@/components/shared/markdown-renderer-v2";
import type { MarkdownFaqItem } from "@/lib/markdown-faq";
import type { Project } from "@/lib/strapi";

interface ArticleMarkdownRendererProps {
  content: string;
  headingIdPrefix?: string;
  rendererVersion?: string | null;
  faqs?: MarkdownFaqItem[];
  projects?: Project[];
  projectCategories?: Array<{ id: number; name: string }>;
  projectStyles?: Array<{ id: number; name: string }>;
  architectureItems?: Array<{
    styleSlug: string;
    projectSlug: string;
    projectTitle: string;
    slotIndex: number;
    orientation: "landscape" | "portrait" | "square";
    imageUrl: string;
    imageAlt: string;
  }>;
}

export function ArticleMarkdownRenderer({
  content,
  headingIdPrefix = "",
  rendererVersion,
  faqs,
  projects,
  projectCategories,
  projectStyles,
  architectureItems,
}: ArticleMarkdownRendererProps) {
  if (rendererVersion === "v2") {
    return (
      <MarkdownRendererV2
        content={content}
        headingIdPrefix={headingIdPrefix}
        faqs={faqs}
        projects={projects}
        projectCategories={projectCategories}
        projectStyles={projectStyles}
        architectureItems={architectureItems}
      />
    );
  }

  return (
    <MarkdownRenderer content={content} headingIdPrefix={headingIdPrefix} />
  );
}
