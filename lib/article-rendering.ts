import type { ProjectArticle } from "@/lib/article-storage";

export function isMarkdownArticle(article?: Pick<ProjectArticle, "rendererVersion"> | null) {
  return article?.rendererVersion === "v2";
}

export function getMarkdownArticleContent(
  article: Pick<ProjectArticle, "introContent" | "mainContent">,
) {
  const intro = article.introContent?.trim() || "";
  const main = article.mainContent?.trim() || "";

  if (intro && main) {
    return `${intro}\n\n<!-- MAIN_CONTENT -->\n\n${main}`;
  }

  return intro || main;
}

export function removeLeadingTitleHeading(markdown: string) {
  return markdown.replace(/^#\s+.+(?:\r?\n)+/, "");
}

export function getMarkdownArticleBodyContent(
  article: Pick<ProjectArticle, "introContent" | "mainContent">,
) {
  return removeLeadingTitleHeading(getMarkdownArticleContent(article));
}
