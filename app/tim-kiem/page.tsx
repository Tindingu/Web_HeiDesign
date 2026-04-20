import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { buildMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/strapi";
import { toCategorySlug } from "@/lib/post-category";

const POSTS_PER_PAGE = 30;

function normalizeVietnamese(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildPageHref(keyword: string, page: number): string {
  const params = new URLSearchParams();
  if (keyword.trim()) params.set("s", keyword.trim());
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/tim-kiem?${query}` : "/tim-kiem";
}

export const generateMetadata = () =>
  buildMetadata({
    title: "Tìm kiếm bài viết",
    description: "Tìm kiếm bài viết Kinh nghiệm hay theo từ khóa.",
    path: "/tim-kiem",
  });

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { s?: string; page?: string };
}) {
  const keyword = String(searchParams?.s || "").trim();
  const normalizedKeyword = normalizeVietnamese(keyword);
  const requestedPage = Number.parseInt(String(searchParams?.page || "1"), 10);

  const allPosts = await getPosts();
  const matchedPosts = normalizedKeyword
    ? allPosts.filter((post) => {
        const haystack = normalizeVietnamese(
          [
            post.title || "",
            post.excerpt || "",
            stripHtml(post.content || ""),
            post.category || "",
          ].join(" "),
        );
        return haystack.includes(normalizedKeyword);
      })
    : allPosts;

  const total = matchedPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? requestedPage : 1, 1),
    totalPages,
  );

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = matchedPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <main className="bg-background">
      <Container className="py-14">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tìm kiếm
          </p>
          <h1 className="text-3xl font-semibold md:text-5xl">
            {keyword ? (
              <>
                Kết quả cho: <span className="uppercase">{keyword}</span>
              </>
            ) : (
              "Tất cả bài viết Kinh nghiệm hay"
            )}
          </h1>
          <p className="text-muted-foreground">
            {total} bài viết phù hợp
            {keyword ? ` với từ khóa "${keyword}"` : ""}.
          </p>
        </div>

        {pagePosts.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border/70 p-8 text-center text-muted-foreground">
            Không tìm thấy bài viết phù hợp.
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {pagePosts.map((post) => (
                <article key={post.slug} className="space-y-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group relative block aspect-[16/10] overflow-hidden rounded-sm bg-muted"
                  >
                    <Image
                      src={post.coverImage?.url || "/upload/blog/blog-1.png"}
                      alt={post.coverImage?.alt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="space-y-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 text-2xl font-medium leading-tight hover:text-amber-600"
                    >
                      {post.title}
                    </Link>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {post.excerpt || stripHtml(post.content || "")}
                    </p>
                    <Link
                      href={`/blog/chuyen-muc/${toCategorySlug(post.category || "tin-tuc")}`}
                      className="inline-block text-sm text-muted-foreground hover:text-amber-600"
                    >
                      {post.category || "Tin tức"}
                    </Link>
                  </div>
                </article>
              ))}
            </section>

            <nav className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={buildPageHref(keyword, Math.max(1, currentPage - 1))}
                className={`rounded-md border px-3 py-2 text-sm ${
                  currentPage === 1
                    ? "pointer-events-none border-border/60 text-muted-foreground"
                    : "border-border hover:border-amber-500 hover:text-amber-600"
                }`}
              >
                Trước
              </Link>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2
                  );
                })
                .map((page, index, array) => {
                  const prev = array[index - 1];
                  const showDots = prev && page - prev > 1;
                  return (
                    <span key={page} className="flex items-center gap-2">
                      {showDots && (
                        <span className="px-1 text-sm text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Link
                        href={buildPageHref(keyword, page)}
                        className={`min-w-9 rounded-md border px-3 py-2 text-center text-sm ${
                          currentPage === page
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-border hover:border-amber-500 hover:text-amber-600"
                        }`}
                      >
                        {page}
                      </Link>
                    </span>
                  );
                })}

              <Link
                href={buildPageHref(
                  keyword,
                  Math.min(totalPages, currentPage + 1),
                )}
                className={`rounded-md border px-3 py-2 text-sm ${
                  currentPage === totalPages
                    ? "pointer-events-none border-border/60 text-muted-foreground"
                    : "border-border hover:border-amber-500 hover:text-amber-600"
                }`}
              >
                Sau
              </Link>
            </nav>
          </>
        )}
      </Container>
    </main>
  );
}
