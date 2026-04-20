import { buildMetadata } from "@/lib/seo";
import { getPostCategories, getPosts } from "@/lib/strapi";
import { Container } from "@/components/shared/container";
import Link from "next/link";
import { toCategorySlug } from "@/lib/post-category";
import { RelatedPostsCarousel } from "@/components/blog/related-posts-carousel";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Kinh nghiệm hay",
    description:
      "Tin tức, kinh nghiệm và hướng dẫn chuyên sâu về thiết kế, thi công nội thất theo từng chuyên mục.",
    path: "/blog",
  });

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPosts(),
    getPostCategories(),
  ]);

  return (
    <main className="bg-background">
      <Container className="py-16">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold md:text-5xl">
            Kinh nghiệm hay
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Kho kiến thức nội thất theo chuyên mục để người dùng và Google dễ
            dàng tìm đúng nội dung.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/chuyen-muc/${category.slug}`}
                className="rounded-full border border-border/70 px-4 py-2 text-sm font-medium transition hover:border-amber-500 hover:text-amber-600"
              >
                {category.label} ({category.count})
              </Link>
            ))}
          </div>
        )}

        <section className="mt-12 space-y-14">
          {categories.map((category) => {
            const categoryPosts = posts.filter(
              (post) =>
                toCategorySlug(post.category || "tin-tuc") === category.slug,
            );
            if (categoryPosts.length === 0) return null;

            return (
              <div key={category.slug} className="space-y-6">
                <RelatedPostsCarousel
                  posts={categoryPosts.slice(0, 8)}
                  categorySlug={category.slug}
                  title={category.label}
                  viewMoreLabel=""
                  showTopBorder={false}
                />
              </div>
            );
          })}
        </section>
      </Container>
    </main>
  );
}
