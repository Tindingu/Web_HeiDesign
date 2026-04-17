import Link from "next/link";
import { Button } from "@/components/ui/button";
import { readArticles } from "@/lib/article-storage";
import Image from "next/image";
import { DeleteArticleButton } from "@/components/admin/delete-article-button";
import { StatsPanel } from "@/components/admin/stats-panel";
import {
  buildTargetTypePath,
  getTargetLabel,
  resolveArticleSection,
  resolveArticleType,
} from "@/lib/article-path";

export const revalidate = 0; // Always fresh

async function ArticlesListPage() {
  const articles = await readArticles();
  const interiorCount = articles.filter(
    (article) => resolveArticleSection(article) === "thiet-ke-noi-that",
  ).length;
  const constructionCount = articles.length - interiorCount;

  const typeMap = articles.reduce<Map<string, number>>((acc, article) => {
    const label = getTargetLabel(
      resolveArticleSection(article),
      resolveArticleType(article),
    );
    acc.set(label, (acc.get(label) || 0) + 1);
    return acc;
  }, new Map());

  const typeData = Array.from(typeMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Article Management</p>
            <h2 className="text-2xl font-semibold text-slate-900">Quản lý bài viết dự án</h2>
          </div>
          <Link href="/admin/du-an/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Bài Viết
            </Button>
          </Link>
        </div>
      </div>

      <StatsPanel
        title="Thống kê bài viết dự án"
        subtitle="Theo dõi số lượng bài viết theo nhóm thiết kế/thi công và từng hạng mục"
        summaries={[
          { label: "Tổng bài viết", value: articles.length, tone: "slate" },
          { label: "Thiết kế nội thất", value: interiorCount, tone: "amber" },
          { label: "Thi công nội thất", value: constructionCount, tone: "emerald" },
          { label: "Số hạng mục", value: typeData.length, tone: "sky" },
        ]}
        chartTitle="Biểu đồ bài viết theo hạng mục"
        data={typeData}
        emptyText="Chưa có bài viết để thống kê"
      />

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <p className="mb-4 text-slate-600">Chưa có bài viết nào</p>
          <Link href="/admin/du-an/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Tạo Bài Viết Đầu Tiên
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {articles.map((article) => {
            const targetSection = resolveArticleSection(article);
            const targetType = resolveArticleType(article);
            const publicPath = buildTargetTypePath(targetSection, targetType);

            return (
              <div
                key={article.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  {article.coverImageUrl && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {getTargetLabel(targetSection, targetType)}
                    </p>
                    <p className="truncate text-xs text-slate-500">{publicPath}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/du-an/${article.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Sửa
                    </Button>
                  </Link>
                  <Link href={publicPath} target="_blank">
                    <Button variant="outline" size="sm">
                      Xem
                    </Button>
                  </Link>
                  <DeleteArticleButton articleId={article.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ArticlesListPage;
