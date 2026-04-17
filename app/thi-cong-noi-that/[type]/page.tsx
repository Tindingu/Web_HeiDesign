import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import { readProjectCategories, readProjectStyles } from "@/lib/taxonomy-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";
import { readArticles } from "@/lib/article-storage";
import {
  getConstructionTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";
import { Container } from "@/components/shared/container";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { BlogToc } from "@/components/blog/toc";
import { extractHeadings } from "@/lib/mdx";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}) {
  return buildMetadata({
    title: getConstructionTargetLabel(params.type),
    description: "Khám phá các mẫu thi công nội thất theo loại công trình.",
    path: `/thi-cong-noi-that/${params.type}`,
  });
}

export default async function InteriorConstructionTypePage({
  params,
}: {
  params: { type: string };
}) {
  const [projects, categories, styles, articles] = await Promise.all([
    getProjects(),
    readProjectCategories(),
    readProjectStyles(),
    readArticles(),
  ]);
  const matchedArticles = articles
    .filter(
      (article) =>
        resolveArticleSection(article) === "thi-cong-noi-that" &&
        resolveArticleType(article) === params.type,
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime(),
    );

  const latestArticle = matchedArticles[0];
  const introHeadings = latestArticle?.introContent
    ? extractHeadings(latestArticle.introContent).map((heading) => ({
        ...heading,
        id: `intro-${heading.id}`,
      }))
    : [];
  const mainHeadings = latestArticle?.mainContent
    ? extractHeadings(latestArticle.mainContent).map((heading) => ({
        ...heading,
        id: `main-${heading.id}`,
      }))
    : [];
  const headings = [...introHeadings, ...mainHeadings];

  return (
    <main className="bg-background">
      {latestArticle && (
        <section className="py-20 bg-background">
          <Container className="space-y-8">
            <article className="mx-auto max-w-5xl space-y-8">
              <header className="space-y-4">
                <h3 className="text-3xl font-bold leading-tight md:text-5xl">
                  {latestArticle.title}
                </h3>
              </header>

              {latestArticle.introContent && (
                <section className="prose prose-lg max-w-none">
                  <MarkdownRenderer
                    content={latestArticle.introContent}
                    headingIdPrefix="intro-"
                  />
                </section>
              )}
              {matchedArticles.length > 1 && (
                <p className="text-sm text-muted-foreground">
                  Đang hiển thị bài viết mới nhất cho loại hình này.
                </p>
              )}
            </article>
          </Container>
        </section>
      )}

      <CompletedProjects
        projects={projects}
        categories={categories}
        maxItemsPerTab={null}
        showViewMoreButton={false}
        initialTab={params.type}
        theme="light"
      />

      <ArchitectureShowcase
        projects={projects}
        styles={styles}
        initialTab={params.type}
        theme="light"
      />

      {latestArticle?.mainContent && (
        <section className="py-20 bg-background">
          <Container>
            <section className="mx-auto max-w-5xl prose prose-lg max-w-none">
              <MarkdownRenderer
                content={latestArticle.mainContent}
                headingIdPrefix="main-"
              />
            </section>
          </Container>
        </section>
      )}

      <BlogToc headings={headings} />
    </main>
  );
}
