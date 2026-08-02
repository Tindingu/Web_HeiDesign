"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ArchitectureStyles } from "@/components/home/architecture-styles";
import { CompletedProjects } from "@/components/home/completed-projects";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import type { MarkdownFaqItem } from "@/lib/markdown-faq";
import type { Project } from "@/lib/strapi";

interface UatMarkdownRendererProps {
  content: string;
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

type ImageCaptionBlock = {
  alt: string;
  src: string;
  caption: string;
};

function parseImageLine(line: string): ImageCaptionBlock | null {
  const match = line
    .trim()
    .match(/^!\[([^\]]*)\]\(([^\)]+)\)(?:\s+(.+))?$/);

  if (!match) return null;

  return {
    alt: match[1].trim(),
    src: match[2].trim(),
    caption: cleanupCaption(match[3] || ""),
  };
}

function cleanupCaption(value: string) {
  return value
    .trim()
    .replace(/^caption::\s*/i, "")
    .replace(/^[_*]+|[_*]+$/g, "")
    .trim();
}

function parseCaptionLine(line?: string) {
  const trimmed = (line || "").trim();
  if (!trimmed) return "";

  if (/^caption::/i.test(trimmed)) {
    return cleanupCaption(trimmed);
  }

  if (
    (/^\*.*\*$/.test(trimmed) || /^_.*_$/.test(trimmed)) &&
    cleanupCaption(trimmed)
  ) {
    return cleanupCaption(trimmed);
  }

  return "";
}

function findFollowingCaption(lines: string[], imageLineIndex: number) {
  for (let offset = 1; offset <= 3; offset += 1) {
    const candidate = lines[imageLineIndex + offset];
    if (candidate === undefined) break;

    if (!candidate.trim()) continue;

    const caption = parseCaptionLine(candidate);
    if (caption) {
      return { caption, consumedLines: offset };
    }

    break;
  }

  return { caption: "", consumedLines: 0 };
}

function isMainContentMarker(line: string) {
  return /^<!--\s*MAIN_CONTENT\s*-->$/i.test(line.trim());
}

function UatFaqAccordion({ faqs }: { faqs: MarkdownFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  return (
    <section className="mt-14 border-t border-gray-200 pt-10">
      <h2 className="mb-8 text-3xl font-semibold tracking-tight text-gray-800">
       FAQ - Các câu hỏi thường gặp!
      </h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={`${item.question}-${index}`} className="py-5">
              <button
                type="button"
                className="group flex w-full items-center gap-4 text-left"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center text-2xl font-semibold leading-none text-[#9ABDC0] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown className="h-6 w-6 stroke-[3]" />
                </span>
                <span className="text-xl font-semibold leading-snug text-gray-600 transition-colors duration-200 group-hover:text-gray-800 md:text-2xl">
                  {item.question}
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="ml-11 mt-5 max-w-5xl text-lg leading-8 text-gray-700">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function UatMarkdownRenderer({
  content,
  faqs = [],
  projects = [],
  projectCategories = [],
  projectStyles = [],
  architectureItems = [],
}: UatMarkdownRendererProps) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  const buffer: string[] = [];

  const flushBuffer = () => {
    const markdown = buffer.join("\n").trim();
    if (markdown) {
      nodes.push(
        <MarkdownRenderer
          key={`md-${nodes.length}`}
          content={markdown}
        />,
      );
    }
    buffer.length = 0;
  };

  for (let index = 0; index < lines.length; index += 1) {
    if (isMainContentMarker(lines[index])) {
      flushBuffer();
      nodes.push(
        <div key={`uat-main-marker-${nodes.length}`} className="not-prose my-12">
          <CompletedProjects
            projects={projects}
            categories={projectCategories}
            maxItemsPerTab={null}
            showViewMoreButton={false}
            theme="light"
          />
          <ArchitectureStyles
            projects={projects}
            styles={projectStyles}
            curatedItems={architectureItems}
            theme="light"
          />
        </div>,
      );
      continue;
    }

    const image = parseImageLine(lines[index]);

    if (!image) {
      buffer.push(lines[index]);
      continue;
    }

    const followingCaption = image.caption
      ? { caption: image.caption, consumedLines: 0 }
      : findFollowingCaption(lines, index);

    if (!followingCaption.caption) {
      buffer.push(lines[index]);
      continue;
    }

    flushBuffer();
    nodes.push(
      <figure key={`uat-img-${nodes.length}`} className="my-6">
        <img
          src={image.src}
          alt={image.alt || "Image"}
          className="h-auto w-full rounded-lg border border-gray-200"
          style={{ imageRendering: "auto" }}
          loading="lazy"
        />
        <figcaption className="mt-3 text-center text-sm italic text-gray-600">
          {followingCaption.caption}
        </figcaption>
      </figure>,
    );
    index += followingCaption.consumedLines;
  }

  flushBuffer();

  return (
    <div className="prose prose-lg max-w-none">
      {nodes}
      <UatFaqAccordion faqs={faqs} />
    </div>
  );
}
