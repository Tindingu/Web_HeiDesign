import { ArticleForm } from "@/components/admin/article-form";
import { getArticleById } from "@/lib/article-storage";
import { notFound } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleById(parseInt(params.id));

  if (!article) {
    notFound();
  }

  return <ArticleForm article={article} />;
}
