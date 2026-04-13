import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/strapi";
import { toCategorySlug } from "@/lib/post-category";

type PostCardProps = {
  post: Post;
  variant?: "default" | "horizontal";
};

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const isHorizontal = variant === "horizontal";
  const coverImageUrl = post.coverImage?.url || "/upload/blog/blog-1.png";
  const coverImageAlt = post.coverImage?.alt || post.title;
  const coverImageBlur = post.coverImage?.blurDataURL;
  return (
    <article
      className={
        isHorizontal
          ? "group overflow-hidden"
          : "group overflow-hidden rounded-sm border border-border/60 bg-muted/30"
      }
    >
      <Link
        href={`/blog/${post.slug}`}
        className={
          isHorizontal
            ? "relative block aspect-[4/3] overflow-hidden rounded-sm"
            : "relative block aspect-[16/10]"
        }
      >
        <Image
          src={coverImageUrl}
          alt={coverImageAlt}
          fill
          sizes={
            isHorizontal
              ? "(max-width: 768px) 50vw, 25vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          placeholder={coverImageBlur ? "blur" : "empty"}
          blurDataURL={coverImageBlur}
        />
      </Link>
      <div className={isHorizontal ? "pt-2" : "p-5"}>
        {!isHorizontal && (
          <Link
            href={`/blog/chuyen-muc/${toCategorySlug(post.category || "tin-tuc")}`}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-amber-600"
          >
            {post.category}
          </Link>
        )}
        <h3
          className={
            isHorizontal
              ? "text-lg font-semibold leading-snug"
              : "mt-2 text-xl font-semibold"
          }
        >
          <Link
            href={`/blog/${post.slug}`}
            className={
              isHorizontal
                ? "line-clamp-2 hover:text-amber-600"
                : "hover:text-amber-600"
            }
          >
            {post.title}
          </Link>
        </h3>
        {/* <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p> */}
      </div>
    </article>
  );
}
