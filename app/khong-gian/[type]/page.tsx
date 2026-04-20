import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";
import { readArticles } from "@/lib/article-storage";
import {
  DU_AN_TARGET_OPTIONS,
  fromKhongGianTypeSlug,
  getDuAnTargetLabel,
  resolveArticleSection,
  resolveArticleType,
  toKhongGianTypeSlug,
} from "@/lib/article-path";
import { Container } from "@/components/shared/container";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { BlogToc } from "@/components/blog/toc";
import { extractHeadings } from "@/lib/mdx";

export const revalidate = 120;

const defaultType = DU_AN_TARGET_OPTIONS[0]?.value ?? "nha-dep";

export async function generateStaticParams() {
  return DU_AN_TARGET_OPTIONS.map((option) => ({
    type: toKhongGianTypeSlug(option.value),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { type: string };
}) {
  const normalizedType = fromKhongGianTypeSlug(params.type);
  return buildMetadata({
    title: getDuAnTargetLabel(normalizedType),
    description: "Khám phá các bài viết dự án theo từng nhóm không gian.",
    path: `/khong-gian/${params.type}`,
  });
}

export default async function KhongGianTypePage({
  params,
}: {
  params: { type: string };
}) {
  const activeType = fromKhongGianTypeSlug(params.type);
  const [projects, categories, styles, articles] = await Promise.all([
    getProjects(),
    readProjectCategories(),
    readProjectStyles(),
    readArticles(),
  ]);

  const matchedArticles = articles
    .filter(
      (article) =>
        resolveArticleSection(article) === "du-an" &&
        resolveArticleType(article) === activeType,
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
        <section className="bg-background py-20">
          <Container className="space-y-8">
            <article className="mx-auto max-w-5xl space-y-8">
              <header className="space-y-4">
                <h3 className="text-3xl font-bold leading-tight md:text-5xl">
                  {latestArticle.title}
                </h3>
                {latestArticle.description && (
                  <p className="text-lg text-muted-foreground">
                    {latestArticle.description}
                  </p>
                )}
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
                  Đang hiển thị bài viết mới nhất cho mục này.
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
        initialTab={activeType}
        theme="light"
      />

      <ArchitectureShowcase
        projects={projects}
        styles={styles}
        initialTab={activeType}
        theme="light"
      />

      {latestArticle?.mainContent && (
        <section className="bg-background py-20">
          <Container>
            <section className="prose prose-lg mx-auto max-w-5xl max-w-none">
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
