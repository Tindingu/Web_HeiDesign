"use client";

import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { MarkdownRendererV2 } from "@/components/shared/markdown-renderer-v2";

interface ArticleMarkdownRendererProps {
  content: string;
  headingIdPrefix?: string;
  rendererVersion?: string | null;
}

export function ArticleMarkdownRenderer({
  content,
  headingIdPrefix = "",
  rendererVersion,
}: ArticleMarkdownRendererProps) {
  if (rendererVersion === "v2") {
    return (
      <MarkdownRendererV2
        content={content}
        headingIdPrefix={headingIdPrefix}
      />
    );
  }

  return (
    <MarkdownRenderer content={content} headingIdPrefix={headingIdPrefix} />
  );
}
