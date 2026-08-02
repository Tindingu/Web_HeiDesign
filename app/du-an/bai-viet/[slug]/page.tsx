import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ArticleMarkdownRenderer } from "@/components/shared/article-markdown-renderer";
import { getArticleBySlug, readArticles } from "@/lib/article-storage";
import { buildMetadata, buildProjectArticleJsonLd } from "@/lib/seo";
import {
  buildTargetTypePath,
  getTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import Image from "next/image";

export const revalidate = 86400;

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
        </article>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </main>
  );
}
