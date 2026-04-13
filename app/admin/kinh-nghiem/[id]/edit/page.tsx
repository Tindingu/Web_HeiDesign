import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { getBlogPostById } from "@/lib/blog-post-storage";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getBlogPostById(Number(params.id));

  if (!post) notFound();

  return <BlogPostForm post={post} />;
}
