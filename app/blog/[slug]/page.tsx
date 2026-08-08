import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { BlogToc } from "@/components/blog/toc";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { ArticleMarkdownRenderer } from "@/components/shared/article-markdown-renderer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { buildArticleJsonLd, buildMetadata } from "@/lib/seo";
import { extractHeadings } from "@/lib/mdx";
import { extractMarkdownFaqs, buildFaqJsonLd } from "@/lib/markdown-faq";
import { removeLeadingTitleHeading } from "@/lib/article-rendering";
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
  getPostsByCategorySlug,
} from "@/lib/strapi";
import Link from "next/link";
import { toCategorySlug } from "@/lib/post-category";
import { RelatedPostsCarousel } from "@/components/blog/related-posts-carousel";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post)
    return buildMetadata({ title: "Article", path: `/blog/${params.slug}` });

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${params.slug}`,
    image: post.coverImage.url,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const categorySlug = toCategorySlug(post.category || "tin-tuc");
  const sameCategoryPosts = (await getPostsByCategorySlug(categorySlug))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 8);
  const latestPosts = (await getPosts())
    .filter((item) => item.slug !== post.slug)
    .slice(0, 8);
  const relatedPosts =
    sameCategoryPosts.length > 0 ? sameCategoryPosts : latestPosts;

  const isV2Post = post.rendererVersion === "v2";
  const parsedV2Post = isV2Post
    ? extractMarkdownFaqs(removeLeadingTitleHeading(post.content))
    : null;
  const contentForToc = parsedV2Post?.content ?? post.content;
  const headings = extractHeadings(contentForToc);
  const jsonLd = buildArticleJsonLd(post);
  const faqJsonLd = parsedV2Post ? buildFaqJsonLd(parsedV2Post.faqs) : null;

  return (
    <main className="bg-background">
      <Container className="pb-16 pt-8">
        <div>
          <article className="space-y-6">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Kinh nghiệm hay", href: "/blog" },
                {
                  label: post.category || "Kinh nghiệm hay",
                  href: `/blog/chuyen-muc/${categorySlug}`,
                },
                { label: post.title, href: `/blog/${post.slug}` },
              ]}
              className="mb-6"
            />
            <header className="space-y-4">
              <Link
                href={`/blog/chuyen-muc/${toCategorySlug(post.category || "tin-tuc")}`}
                className="inline-block text-sm uppercase tracking-[0.2em] text-muted-foreground hover:text-amber-600"
              >
                {post.category}
              </Link>
              <h1 className="text-4xl font-semibold md:text-5xl">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            </header>
            {parsedV2Post ? (
              <ArticleMarkdownRenderer
                content={parsedV2Post.content}
                rendererVersion="v2"
                faqs={parsedV2Post.faqs}
              />
            ) : (
              <MarkdownRenderer content={post.content} />
            )}
          </article>

          {relatedPosts.length > 0 && (
            <RelatedPostsCarousel
              posts={relatedPosts}
              categorySlug={categorySlug}
            />
          )}

          <BlogToc headings={headings} />
        </div>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
