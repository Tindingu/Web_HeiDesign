import { revalidatePath } from "next/cache";
import type { Project } from "@/lib/strapi";
import type { BlogPostRecord } from "@/lib/blog-post-storage";
import type { ProjectArticle } from "@/lib/article-storage";
import type { ArticleTypeItem } from "@/lib/taxonomy-storage";
import { toCategorySlug } from "@/lib/post-category";

type PathValue = string | null | undefined | false;

function revalidateUnique(paths: PathValue[]) {
  const uniquePaths = Array.from(
    new Set(
      paths
        .filter((path): path is string => Boolean(path))
        .map((path) => path.replace(/\/+$/, "") || "/"),
    ),
  );

  for (const path of uniquePaths) {
    revalidatePath(path);
  }
}

function articleTypePath(article?: Pick<ProjectArticle, "targetSection" | "targetType"> | null) {
  if (!article?.targetSection || !article.targetType) return null;
  if (article.targetSection === "du-an") return `/khong-gian/${article.targetType}`;
  return `/${article.targetSection}/${article.targetType}`;
}

function articleDetailPath(article?: Pick<ProjectArticle, "targetSection" | "targetType" | "slug"> | null) {
  if (!article?.targetSection || !article.targetType || !article.slug) return null;
  if (article.targetSection === "du-an") return `/du-an/bai-viet/${article.slug}`;
  if (article.targetSection === "thiet-ke-noi-that") {
    return `/thiet-ke-noi-that/${article.targetType}/${article.slug}`;
  }
  return null;
}

function articleSectionRoot(section?: ProjectArticle["targetSection"] | null) {
  if (section === "du-an") return "/du-an/bai-viet";
  if (section === "thiet-ke-noi-that") return "/thiet-ke-noi-that";
  if (section === "thi-cong-noi-that") return "/thi-cong-noi-that";
  return null;
}

export function revalidateHomePage() {
  revalidateUnique(["/"]);
}

export function revalidateHomepageContent() {
  revalidateUnique(["/"]);
}

export function revalidateProjectContent(
  project?: Pick<Project, "slug" | "category" | "style"> | null,
  previousProject?: Pick<Project, "slug" | "category" | "style"> | null,
) {
  revalidateUnique([
    "/",
    "/du-an",
    "/thiet-ke-noi-that",
    "/thi-cong-noi-that",
    project?.slug && `/du-an/${project.slug}`,
    previousProject?.slug && `/du-an/${previousProject.slug}`,
  ]);
}

export function revalidateBlogContent(
  post?: Pick<BlogPostRecord, "slug" | "category"> | null,
  previousPost?: Pick<BlogPostRecord, "slug" | "category"> | null,
) {
  revalidateUnique([
    "/",
    "/blog",
    post?.slug && `/blog/${post.slug}`,
    previousPost?.slug && `/blog/${previousPost.slug}`,
    post?.category && `/blog/chuyen-muc/${toCategorySlug(post.category)}`,
    previousPost?.category &&
      `/blog/chuyen-muc/${toCategorySlug(previousPost.category)}`,
  ]);
}

export function revalidateArticleContent(
  article?: ProjectArticle | null,
  previousArticle?: ProjectArticle | null,
) {
  revalidateUnique([
    "/",
    articleSectionRoot(article?.targetSection),
    articleSectionRoot(previousArticle?.targetSection),
    articleTypePath(article),
    articleTypePath(previousArticle),
    articleDetailPath(article),
    articleDetailPath(previousArticle),
  ]);
}

export function revalidateArchitectureGalleryContent() {
  revalidateUnique([
    "/",
    "/du-an",
    "/thiet-ke-noi-that",
    "/thi-cong-noi-that",
  ]);
}

export function revalidateTaxonomyContent(
  kind: "blog-category" | "project-category" | "project-style" | "article-type",
  item?: { name?: string; code?: string; sectionCode?: string } | null,
  previousItem?: { name?: string; code?: string; sectionCode?: string } | null,
) {
  if (kind === "blog-category") {
    revalidateUnique([
      "/",
      "/blog",
      item?.name && `/blog/chuyen-muc/${toCategorySlug(item.name)}`,
      previousItem?.name &&
        `/blog/chuyen-muc/${toCategorySlug(previousItem.name)}`,
    ]);
    return;
  }

  if (kind === "article-type") {
    revalidateUnique([
      "/",
      item?.sectionCode === "du-an" ? "/du-an/bai-viet" : null,
      item?.sectionCode === "thiet-ke-noi-that" ? "/thiet-ke-noi-that" : null,
      item?.sectionCode === "thi-cong-noi-that" ? "/thi-cong-noi-that" : null,
      item?.sectionCode === "du-an" && item?.code
        ? `/khong-gian/${item.code}`
        : null,
      item?.sectionCode && item.sectionCode !== "du-an" && item?.code
        ? `/${item.sectionCode}/${item.code}`
        : null,
      previousItem?.sectionCode === "du-an" ? "/du-an/bai-viet" : null,
      previousItem?.sectionCode === "thiet-ke-noi-that"
        ? "/thiet-ke-noi-that"
        : null,
      previousItem?.sectionCode === "thi-cong-noi-that"
        ? "/thi-cong-noi-that"
        : null,
      previousItem?.sectionCode === "du-an" && previousItem?.code
        ? `/khong-gian/${previousItem.code}`
        : null,
      previousItem?.sectionCode &&
      previousItem.sectionCode !== "du-an" &&
      previousItem?.code
        ? `/${previousItem.sectionCode}/${previousItem.code}`
        : null,
    ]);
    return;
  }

  revalidateUnique(["/", "/du-an", "/thiet-ke-noi-that", "/thi-cong-noi-that"]);
}
