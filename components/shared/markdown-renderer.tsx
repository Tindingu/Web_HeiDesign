"use client";

import React from "react";
import GithubSlugger from "github-slugger";

interface MarkdownRendererProps {
  content: string;
  headingIdPrefix?: string;
}

export function MarkdownRenderer({
  content,
  headingIdPrefix = "",
}: MarkdownRendererProps) {
  // Simple markdown parser - convert markdown syntax to React elements
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  const slugger = new GithubSlugger();
  let currentList: string[] = [];
  let currentListType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (currentList.length > 0) {
      if (currentListType === "ul") {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-4 ml-6 space-y-2 list-disc"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {formatInlineMarkdown(item)}
              </li>
            ))}
          </ul>,
        );
      } else if (currentListType === "ol") {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="my-4 ml-6 space-y-2 list-decimal"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-700">
                {formatInlineMarkdown(item)}
              </li>
            ))}
          </ol>,
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      console.log("📊 Flushing table with", tableRows.length, "rows");
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {tableRows[0].map((cell, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-300 px-4 py-2 text-left font-semibold"
                  >
                    {formatInlineMarkdown(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {formatInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableRows = [];
      tableMode = false;
    }
  };

  let tableMode = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      flushList();
      flushTable();
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="mt-8 mb-4 text-4xl font-bold text-gray-900"
        >
          {line.slice(2)}
        </h1>,
      );
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      flushList();
      const headingText = line.slice(3).trim();
      const headingId = `${headingIdPrefix}${slugger.slug(headingText)}`;
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={headingId}
          className="mt-6 mb-3 text-2xl font-bold text-gray-900"
        >
          {headingText}
        </h2>,
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      flushList();
      const headingText = line.slice(4).trim();
      const headingId = `${headingIdPrefix}${slugger.slug(headingText)}`;
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          id={headingId}
          className="mt-4 mb-2 text-xl font-bold text-gray-900"
        >
          {headingText}
        </h3>,
      );
      continue;
    }

    // Table detection
    if (line.includes("|")) {
      console.log("🎯 Table line detected:", line.substring(0, 100));

      // Skip separator rows (|---|---|---|)
      if (line.match(/^\|[\s\-:]+\|[\s\-:|]+$/)) {
        console.log("⏭️ Skipping separator row");
        continue;
      }

      tableMode = true;
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell && !cell.match(/^[\s\-:]+$/));

      console.log("🎯 Cells parsed:", cells.length, cells.slice(0, 3));

      if (cells.length > 0) {
        tableRows.push(cells);
      }
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (currentListType !== "ul") {
        flushList();
        currentListType = "ul";
      }
      currentList.push(line.slice(2));
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      if (currentListType !== "ol") {
        flushList();
        currentListType = "ol";
      }
      currentList.push(line.replace(/^\d+\. /, ""));
      continue;
    }

    // Image ![alt](src) - full line image with optional caption
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^\)]+)\)$/);
    if (imageMatch) {
      flushList();
      flushTable();
      let caption = imageMatch[1];
      const src = imageMatch[2];

      const captionResult = extractCaptionFromFollowingLines(lines, i);
      if (captionResult.caption) {
        caption = captionResult.caption;
        i += captionResult.consumedLines;
      }

      // Extract caption text - remove "Hình X " prefix
      // Pattern: "Hình 1 text" or "Hình 123 text" => keep only "text"
      const captionTextMatch = caption.match(/^Hình\s+\d+\s+(.+)$/);
      if (captionTextMatch) {
        caption = captionTextMatch[1];
      }

      // Capitalize first letter
      if (caption) {
        caption = caption.charAt(0).toUpperCase() + caption.slice(1);
      }

      console.log(
        "🖼️ Image detected:",
        src.substring(0, 50),
        "caption:",
        caption.substring(0, 50),
      );
      elements.push(
        <figure key={`img-${elements.length}`} className="my-6">
          <img
            src={src}
            alt={caption || "Image"}
            className="h-auto w-full rounded-lg border border-gray-200"
            style={{ imageRendering: "auto" }}
            loading="lazy"
          />
          {caption && caption.trim() ? (
            <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
              {caption}
            </figcaption>
          ) : null}
        </figure>,
      );
      continue;
    }

    // HTML image line: <img src="..." /> with optional caption in next line
    const imageTag = parseHtmlImageTag(line);
    if (imageTag?.src) {
      flushList();
      flushTable();

      let caption = imageTag.alt || "";
      const captionResult = extractCaptionFromFollowingLines(lines, i);
      if (captionResult.caption) {
        caption = captionResult.caption;
        i += captionResult.consumedLines;
      }

      elements.push(
        <figure key={`img-html-${elements.length}`} className="my-6">
          <img
            src={imageTag.src}
            alt={caption || "Image"}
            className="h-auto w-full rounded-lg border border-gray-200"
            style={{ imageRendering: "auto" }}
            loading="lazy"
          />
          {caption && caption.trim() ? (
            <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
              {caption}
            </figcaption>
          ) : null}
        </figure>,
      );
      continue;
    }

    // YouTube link line: render embedded video player
    const youtubeVideoId = extractYouTubeVideoIdFromLine(line);
    if (youtubeVideoId) {
      flushList();
      flushTable();

      elements.push(
        <div
          key={`yt-${elements.length}`}
          className="my-6 mx-auto w-full max-w-4xl overflow-hidden rounded-lg"
        >
          <div className="relative w-full overflow-hidden rounded-lg pb-[56.25%]">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              className="absolute left-0 top-0 h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>,
      );
      continue;
    }

    // Skip caption lines (converted from Word figcaption) - don't render them separately
    if (
      line.match(/^\*Hình\s+\d+/) ||
      line.match(/^\*Chi phí|^\*Thiết kế|^\*Hình ảnh/)
    ) {
      console.log("🏷️ Caption line skipped:", line.substring(0, 50));
      continue;
    }

    // Paragraph with formatting
    flushList();
    const formattedLine = formatInlineMarkdown(line);
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-4 text-base leading-relaxed text-gray-700"
      >
        {formattedLine}
      </p>,
    );
  }

  flushList();
  flushTable();

  return <div className="prose prose-lg max-w-none">{elements}</div>;
}

function parseHtmlImageTag(line: string): { src: string; alt: string } | null {
  const trimmed = (line || "").trim();
  const decoded = trimmed
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&");
  if (!/^<img\b[^>]*\/?\s*>$/i.test(decoded)) {
    return null;
  }

  const srcMatch = decoded.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
  const altMatch = decoded.match(/\balt\s*=\s*["']([^"']*)["']/i);

  if (!srcMatch?.[1]) {
    return null;
  }

  return {
    src: normalizeImageSource(srcMatch[1].trim()),
    alt: (altMatch?.[1] || "").trim(),
  };
}

function extractYouTubeVideoIdFromLine(line: string): string | null {
  const raw = (line || "").trim();
  if (!raw) return null;

  // Support bare URLs, <url>, and markdown links [text](url)
  let candidate = raw;

  const markdownLinkMatch = raw.match(/^\[[^\]]*\]\((https?:\/\/[^\s\)]+)\)$/i);
  if (markdownLinkMatch?.[1]) {
    candidate = markdownLinkMatch[1].trim();
  }

  const autoLinkMatch = candidate.match(/^<(https?:\/\/[^>]+)>$/i);
  if (autoLinkMatch?.[1]) {
    candidate = autoLinkMatch[1].trim();
  }

  // watch?v=VIDEO_ID
  const watchMatch = candidate.match(
    /^https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com)\/watch\?[^\s]*v=([a-zA-Z0-9_-]{11})/i,
  );
  if (watchMatch?.[1]) return watchMatch[1];

  // youtu.be/VIDEO_ID
  const shortMatch = candidate.match(
    /^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
  );
  if (shortMatch?.[1]) return shortMatch[1];

  // youtube.com/embed/VIDEO_ID
  const embedMatch = candidate.match(
    /^https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com)\/embed\/([a-zA-Z0-9_-]{11})/i,
  );
  if (embedMatch?.[1]) return embedMatch[1];

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = candidate.match(
    /^https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com)\/shorts\/([a-zA-Z0-9_-]{11})/i,
  );
  if (shortsMatch?.[1]) return shortsMatch[1];

  return null;
}

function extractCaptionLine(rawLine?: string): string | null {
  const line = (rawLine || "").trim();
  if (!line) return null;

  if (/^caption::/i.test(line)) {
    return line.replace(/^caption::\s*/i, "").trim();
  }

  const withoutStars = line.replace(/^\*+|\*+$/g, "").trim();
  if (!withoutStars) return null;

  // If the original line is emphasized and placed right after an image,
  // treat it as a caption (backward compatibility with older converted data).
  if (/^\*.*\*$/.test(line)) {
    return withoutStars;
  }

  // Accept both "Hình 1. ..." and "Hinh 1 ..." styles.
  const captionMatch = withoutStars.match(
    /^(hinh|hình|anh|ảnh|figure)\s+\d+([\.:\-)\s]+.*)$/i,
  );
  if (!captionMatch) return null;

  return withoutStars;
}

function extractCaptionFromFollowingLines(
  lines: string[],
  currentIndex: number,
): { caption: string | null; consumedLines: number } {
  // Allow one or two empty spacer lines between image and caption.
  for (let offset = 1; offset <= 3; offset++) {
    const candidate = lines[currentIndex + offset];
    if (candidate === undefined) break;

    const trimmed = candidate.trim();
    if (!trimmed) {
      continue;
    }

    const caption = extractCaptionLine(candidate);
    if (caption) {
      return { caption, consumedLines: offset };
    }

    // Stop when the next non-empty line is not a caption.
    break;
  }

  return { caption: null, consumedLines: 0 };
}

function normalizeImageSource(raw: string): string {
  if (!raw) return "";
  let value = raw.trim();

  // Recover from malformed values like !!![](https://...)
  const markdownWrappedUrl = value.match(/!?\[.*?\]\((https?:\/\/[^\)\s]+)\)/i);
  if (markdownWrappedUrl?.[1]) {
    value = markdownWrappedUrl[1].trim();
  }

  // Remove leading punctuation that can appear in corrupted input.
  value = value.replace(/^[!\s]+/, "");

  return value;
}

// Format inline markdown (bold, italic, links, images, etc.)
function formatInlineMarkdown(text: string): React.ReactNode {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  // Regex for bold, italic, images, links, autolinks, code
  // Supports both [text](url) and [text] (url) formats often produced from Word conversions.
  const regex =
    /!\[(.*?)\]\s*\((.*?)\)|\*\*(.*?)\*\*|__(.*?)__|\*(.*?)\*|_(.*?)_|\[(.*?)\]\s*\((.*?)\)|<(https?:\/\/[^>\s]+)>|`(.*?)`/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2]) {
      // Image ![alt](url)
      elements.push(
        <img
          key={`img-${match.index}`}
          src={match[2]}
          alt={match[1] || "Image"}
          className="inline-block max-w-full h-auto rounded-lg my-2"
          loading="lazy"
        />,
      );
    } else if (match[3]) {
      // Bold **text**
      elements.push(
        <strong key={`bold-${match.index}`} className="font-bold">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      // Bold __text__
      elements.push(
        <strong key={`bold-${match.index}`} className="font-bold">
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      // Italic *text*
      elements.push(
        <em key={`italic-${match.index}`} className="italic">
          {match[5]}
        </em>,
      );
    } else if (match[6]) {
      // Italic _text_
      elements.push(
        <em key={`italic-${match.index}`} className="italic">
          {match[6]}
        </em>,
      );
    } else if (match[7] && match[8]) {
      // Link [text](url)
      const href = match[8].trim();
      elements.push(
        <a
          key={`link-${match.index}`}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-amber-600 hover:text-amber-700 underline decoration-amber-600"
        >
          {match[7]}
        </a>,
      );
    } else if (match[9]) {
      // Autolink <https://...>
      const href = match[9].trim();
      elements.push(
        <a
          key={`auto-link-${match.index}`}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="text-amber-600 hover:text-amber-700 underline decoration-amber-600"
        >
          {href}
        </a>,
      );
    } else if (match[10]) {
      // Code `text`
      elements.push(
        <code
          key={`code-${match.index}`}
          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
        >
          {match[10]}
        </code>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}
