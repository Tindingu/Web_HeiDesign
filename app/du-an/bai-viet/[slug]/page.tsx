import { notFound } from "next/navigation";
import { ArticleMarkdownRenderer } from "@/components/shared/article-markdown-renderer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import {
  getMarkdownArticleBodyContent,
  isMarkdownArticle,
} from "@/lib/article-rendering";
import {
  buildTargetTypePath,
  getTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";
import { getArticleBySlug, readArticles } from "@/lib/article-storage";
import { buildFaqJsonLd, extractMarkdownFaqs } from "@/lib/markdown-faq";
import { buildMetadata, buildProjectArticleJsonLd } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import Image from "next/image";

export const revalidate = 86400;

const mainContentMarkerPattern = /<!--\s*MAIN_CONTENT\s*-->/i;

export async function generateStaticParams() {
  const articles = await readArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return buildMetadata({
      title: "Bài viết",
      path: `/du-an/bai-viet/${params.slug}`,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/du-an/bai-viet/${article.slug}`,
    image: article.coverImageUrl,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const isV2Article = isMarkdownArticle(article);
  const parsedV2Article = isV2Article
    ? extractMarkdownFaqs(getMarkdownArticleBodyContent(article))
    : null;
  const needsMarkerData =
    parsedV2Article?.content &&
    mainContentMarkerPattern.test(parsedV2Article.content);
  const markerData = needsMarkerData
    ? await Promise.all([
        getProjects(),
        readProjectCategories(),
        readProjectStyles(),
        readArchitectureGallery(),
      ])
    : null;
  const architectureItems =
    markerData?.[3].map((item) => ({
      styleSlug: item.styleSlug,
      projectSlug: item.projectSlug,
      projectTitle: item.projectTitle,
      slotIndex: item.slotIndex,
      orientation: item.orientation,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
    })) ?? [];
  const section = resolveArticleSection(article);
  const type = resolveArticleType(article);
  const sectionLabel =
    section === "thi-cong-noi-that"
      ? "Thi công nội thất"
      : section === "du-an"
        ? "Dự án"
        : "Thiết kế nội thất";
  const sectionHref = section === "du-an" ? "/du-an" : `/${section}`;
  const targetLabel = getTargetLabel(section, type);
  const targetHref = buildTargetTypePath(section, type);
  const articleJsonLd = buildProjectArticleJsonLd(
    article,
    `/du-an/bai-viet/${article.slug}`,
  );
  const faqJsonLd = parsedV2Article
    ? buildFaqJsonLd(parsedV2Article.faqs)
    : null;

  return (
    <main className="bg-background">
      <Container className="pb-12 pt-8">
        <article className="mx-auto max-w-4xl space-y-8">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: sectionLabel, href: sectionHref },
              { label: targetLabel, href: targetHref },
              { label: article.title, href: `/du-an/bai-viet/${article.slug}` },
            ]}
          />

          {parsedV2Article ? (
            <>
              <header className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                  {article.title}
                </h1>
                {article.description ? (
                  <p className="text-lg text-muted-foreground">
                    {article.description}
                  </p>
                ) : null}
              </header>

              {article.coverImageUrl ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
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
                  projects={markerData?.[0] ?? []}
                  projectCategories={markerData?.[1] ?? []}
                  projectStyles={markerData?.[2] ?? []}
                  architectureItems={architectureItems}
                />
              </section>
            </>
          ) : (
            <>
              <header className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                  {article.category}
                </p>
                <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                  {article.title}
                </h1>
                {article.description && (
                  <p className="text-lg text-muted-foreground">
                    {article.description}
                  </p>
                )}
              </header>

              {article.coverImageUrl && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              )}

              {article.introContent && (
                <section className="prose prose-lg max-w-none">
                  <ArticleMarkdownRenderer
                    content={article.introContent}
                    rendererVersion={article.rendererVersion}
                  />
                </section>
              )}

              {article.mainContent && (
                <section className="prose prose-lg max-w-none">
                  <ArticleMarkdownRenderer
                    content={article.mainContent}
                    rendererVersion={article.rendererVersion}
                  />
                </section>
              )}
            </>
          )}
        </article>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
    </main>
  );
}
