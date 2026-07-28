"use client";

import type { ReactNode } from "react";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";

interface MarkdownRendererV2Props {
  content: string;
  headingIdPrefix?: string;
}

type ImageCaptionBlock = {
  alt: string;
  src: string;
  caption: string;
};

function cleanupCaption(value: string) {
  return value
    .trim()
    .replace(/^caption::\s*/i, "")
    .replace(/^[_*]+|[_*]+$/g, "")
    .trim();
}

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

export function MarkdownRendererV2({
  content,
  headingIdPrefix = "",
}: MarkdownRendererV2Props) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  const buffer: string[] = [];

  const flushBuffer = () => {
    const markdown = buffer.join("\n").trim();
    if (markdown) {
      nodes.push(
        <MarkdownRenderer
          key={`md-${nodes.length}`}
          content={markdown}
          headingIdPrefix={headingIdPrefix}
        />,
      );
    }
    buffer.length = 0;
  };

  for (let index = 0; index < lines.length; index += 1) {
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
      <figure key={`img-v2-${nodes.length}`} className="my-6">
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

  return <div className="prose prose-lg max-w-none">{nodes}</div>;
}
