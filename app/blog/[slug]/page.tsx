import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { BlogToc } from "@/components/blog/toc";
import { MdxRenderer } from "@/components/blog/mdx-renderer";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { extractHeadings } from "@/lib/mdx";
import {
  getPostBySlug,
  getPostSlugs,
  getPosts,
  getPostsByCategorySlug,
} from "@/lib/strapi";
import Link from "next/link";
import { toCategorySlug } from "@/lib/post-category";
import { RelatedPostsCarousel } from "@/components/blog/related-posts-carousel";

export const revalidate = 120;

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

  const headings = extractHeadings(post.content);
  const jsonLd = buildArticleJsonLd(post);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://icepdesign.vn" },
    { name: "Blog", url: "https://icepdesign.vn/blog" },
    { name: post.title, url: `https://icepdesign.vn/blog/${post.slug}` },
  ]);

  return (
    <main className="bg-background">
      <Container className="py-16">
        <div>
          <article className="space-y-6">
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
            <MdxRenderer source={post.content} />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
  );
}
