import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPostCategories, getPostsByCategorySlug } from "@/lib/strapi";
import { Container } from "@/components/shared/container";
import { PostCard } from "@/components/blog/post-card";
import { toCategoryLabel } from "@/lib/post-category";

export const revalidate = 120;

export async function generateStaticParams() {
  const categories = await getPostCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const label = toCategoryLabel(params.category);
  return buildMetadata({
    title: `${label} | Kinh nghiệm hay`,
    description: `Tổng hợp bài viết chuyên mục ${label.toLowerCase()} cho thiết kế và thi công nội thất.`,
    path: `/blog/chuyen-muc/${params.category}`,
  });
}

export default async function BlogCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const [posts, categories] = await Promise.all([
    getPostsByCategorySlug(params.category),
    getPostCategories(),
  ]);

  const activeCategory = categories.find(
    (item) => item.slug === params.category,
  );
  if (!activeCategory) notFound();

  return (
    <main className="bg-background">
      <Container className="py-16 space-y-10">
        <div className="space-y-4">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Về trang Kinh nghiệm hay
          </Link>
          <h1 className="text-4xl font-semibold md:text-5xl">
            {activeCategory.label}
          </h1>
          <p className="text-lg text-muted-foreground">
            Chuyên mục có {activeCategory.count} bài viết.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-8 text-muted-foreground">
            Chưa có bài viết cho chuyên mục này.
          </div>
        )}
      </Container>
    </main>
  );
}
