import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { UatMarkdownRenderer } from "@/components/uat/uat-markdown-renderer";
import { getUatPostBySlug } from "@/lib/uat-post-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function removeLeadingTitleHeading(markdown: string) {
  return markdown.replace(/^#\s+.+(?:\r?\n)+/, "");
}

export default async function UatArticlePreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getUatPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleContent = removeLeadingTitleHeading(post.markdown);

  return (
    <main className="bg-background">
      <Container className="py-12">
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            {post.category ? (
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                {post.category}
              </p>
            ) : null}
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            ) : null}
          </header>

          {post.coverImageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                unoptimized
              />
            </div>
          ) : null}

          {articleContent ? (
            <section className="prose prose-lg max-w-none">
              <UatMarkdownRenderer content={articleContent} />
            </section>
          ) : null}
        </article>
      </Container>
    </main>
  );
}
