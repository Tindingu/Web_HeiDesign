import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureStyles } from "@/components/home/architecture-styles";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import { readArticles } from "@/lib/article-storage";
import {
  getConstructionTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";
import { Container } from "@/components/shared/container";
import { ArticleMarkdownRenderer } from "@/components/shared/article-markdown-renderer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BlogToc } from "@/components/blog/toc";
import { extractHeadings } from "@/lib/mdx";

export const revalidate = 86400;

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
  const architectureGallery = await readArchitectureGallery();
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
  const targetLabel = getConstructionTargetLabel(params.type);

  return (
    <main className="bg-background">
      {latestArticle && (
        <section className="py-20 bg-background">
          <Container className="space-y-8">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Thi công nội thất", href: "/thi-cong-noi-that" },
                { label: targetLabel, href: `/thi-cong-noi-that/${params.type}` },
              ]}
            />
            <article className="mx-auto max-w-5xl space-y-8">
              <header className="space-y-4">
                <h3 className="text-3xl font-bold leading-tight md:text-5xl">
                  {latestArticle.title}
                </h3>
              </header>

              {latestArticle.introContent && (
                <section className="prose prose-lg max-w-none">
                  <ArticleMarkdownRenderer
                    content={latestArticle.introContent}
                    headingIdPrefix="intro-"
                    rendererVersion={latestArticle.rendererVersion}
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
        theme="light"
      />

      <ArchitectureStyles
        projects={projects}
        styles={styles}
        curatedItems={architectureGallery.map((item) => ({
          styleSlug: item.styleSlug,
          projectSlug: item.projectSlug,
          projectTitle: item.projectTitle,
          slotIndex: item.slotIndex,
          orientation: item.orientation,
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
        }))}
      />

      {latestArticle?.mainContent && (
        <section className="py-20 bg-background">
          <Container>
            <section className="mx-auto max-w-5xl prose prose-lg max-w-none">
              <ArticleMarkdownRenderer
                content={latestArticle.mainContent}
                headingIdPrefix="main-"
                rendererVersion={latestArticle.rendererVersion}
              />
            </section>
          </Container>
        </section>
      )}

      <BlogToc headings={headings} />
    </main>
  );
}
