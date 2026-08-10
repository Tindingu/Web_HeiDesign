import { BlogToc } from "@/components/blog/toc";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";
import { ArticleMarkdownRenderer } from "@/components/shared/article-markdown-renderer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import {
  getMarkdownArticleBodyContent,
  isMarkdownArticle,
} from "@/lib/article-rendering";
import {
  DU_AN_TARGET_OPTIONS,
  getDuAnTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";
import { readArticles } from "@/lib/article-storage";
import { buildFaqJsonLd, extractMarkdownFaqs } from "@/lib/markdown-faq";
import { extractHeadings } from "@/lib/mdx";
import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { SmartImage as Image } from "@/components/shared/smart-image";

export const revalidate = 86400;

const defaultType = DU_AN_TARGET_OPTIONS[0]?.value ?? "nha-dep";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const type = searchParams?.type ?? defaultType;
  return buildMetadata({
    title: getDuAnTargetLabel(type),
    description: "Khám phá các bài viết dự án theo từng nhóm không gian.",
    path: `/du-an/bai-viet?type=${type}`,
  });
}

export default async function DuAnArticlePage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const activeType = searchParams?.type ?? defaultType;
  const [projects, categories, styles, articles, architectureGallery] =
    await Promise.all([
      getProjects(),
      readProjectCategories(),
      readProjectStyles(),
      readArticles(),
      readArchitectureGallery(),
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
  const isV2Article = isMarkdownArticle(latestArticle);
  const parsedV2Article =
    latestArticle && isV2Article
      ? extractMarkdownFaqs(getMarkdownArticleBodyContent(latestArticle))
      : null;
  const architectureItems = architectureGallery.map((item) => ({
    styleSlug: item.styleSlug,
    projectSlug: item.projectSlug,
    projectTitle: item.projectTitle,
    slotIndex: item.slotIndex,
    orientation: item.orientation,
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
  }));
  const introHeadings = !isV2Article && latestArticle?.introContent
    ? extractHeadings(latestArticle.introContent).map((heading) => ({
        ...heading,
        id: `intro-${heading.id}`,
      }))
    : [];
  const mainHeadings = !isV2Article && latestArticle?.mainContent
    ? extractHeadings(latestArticle.mainContent).map((heading) => ({
        ...heading,
        id: `main-${heading.id}`,
      }))
    : [];
  const headings = parsedV2Article
    ? extractHeadings(parsedV2Article.content)
    : [...introHeadings, ...mainHeadings];
  const faqJsonLd = parsedV2Article
    ? buildFaqJsonLd(parsedV2Article.faqs)
    : null;
  const targetLabel = getDuAnTargetLabel(activeType);

  return (
    <main className="bg-background">
      {latestArticle && (
        <section className="bg-background pb-20 pt-8">
          <Container className="space-y-8">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Dự án", href: "/du-an" },
                { label: targetLabel, href: `/du-an/bai-viet?type=${activeType}` },
              ]}
            />

            {parsedV2Article ? (
              <article className="mx-auto max-w-5xl space-y-8">
                <header className="space-y-4">
                  <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                    {latestArticle.title}
                  </h1>
                  {latestArticle.description ? (
                    <p className="text-lg text-muted-foreground">
                      {latestArticle.description}
                    </p>
                  ) : null}
                </header>

                {latestArticle.coverImageUrl ? (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={latestArticle.coverImageUrl}
                      alt={latestArticle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      priority
                      unoptimized
                    />
                  </div>
                ) : null}

                <section className="prose prose-lg max-w-none">
                  <ArticleMarkdownRenderer
                    content={parsedV2Article.content}
                    rendererVersion="v2"
                    faqs={parsedV2Article.faqs}
                    projects={projects}
                    projectCategories={categories}
                    projectStyles={styles}
                    architectureItems={architectureItems}
                  />
                </section>
              </article>
            ) : (
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
                    <ArticleMarkdownRenderer
                      content={latestArticle.introContent}
                      headingIdPrefix="intro-"
                      rendererVersion={latestArticle.rendererVersion}
                    />
                  </section>
                )}

                {matchedArticles.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    Đang hiển thị bài viết mới nhất cho mục này.
                  </p>
                )}
              </article>
            )}
          </Container>
        </section>
      )}

      {!isV2Article && (
        <>
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
        </>
      )}

      {!isV2Article && latestArticle?.mainContent && (
        <section className="bg-background py-20">
          <Container>
            <section className="prose prose-lg mx-auto max-w-5xl max-w-none">
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
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
    </main>
  );
}
