import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import {
  readArticleSections,
  readArticleTypes,
  readBlogCategories,
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { StatsPanel } from "@/components/admin/stats-panel";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const [
    blogCategories,
    projectCategories,
    projectStyles,
    articleSections,
    articleTypes,
  ] = await Promise.all([
    readBlogCategories(),
    readProjectCategories(),
    readProjectStyles(),
    readArticleSections(),
    readArticleTypes(),
  ]);

  const sectionTypeCount = articleSections.map((section) => ({
    label: section.name,
    value: articleTypes.filter((type) => type.sectionId === section.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Taxonomy Management
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Quản lý category và style
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Quản lý các nhóm dữ liệu dùng cho dự án, blog và mục bài viết.
        </p>
      </div>

      <StatsPanel
        title="Thống kê taxonomy"
        subtitle="Tổng quan dữ liệu phân loại đang được sử dụng trong hệ thống"
        summaries={[
          {
            label: "Category dự án",
            value: projectCategories.length,
            tone: "amber",
          },
          { label: "Style dự án", value: projectStyles.length, tone: "sky" },
          {
            label: "Category blog",
            value: blogCategories.length,
            tone: "emerald",
          },
          { label: "Mục bài viết", value: articleTypes.length, tone: "slate" },
        ]}
        chartTitle="Biểu đồ mục bài viết theo nhóm"
        data={sectionTypeCount}
        emptyText="Chưa có dữ liệu mục bài viết"
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <TaxonomyManager />
      </div>
    </div>
  );
}
