import Link from "next/link";
import { Button } from "@/components/ui/button";
import { readProjects } from "@/lib/project-storage";
import Image from "next/image";
import { StatsPanel } from "@/components/admin/stats-panel";

export const revalidate = 0; // Always fresh

async function ProjectsListPage() {
  const projects = await readProjects();
  const featuredCount = projects.filter((project) => project.featured).length;

  const categoryMap = projects.reduce<Map<string, number>>((acc, project) => {
    const key = project.category || "Chưa phân loại";
    acc.set(key, (acc.get(key) || 0) + 1);
    return acc;
  }, new Map());

  const categoryData = Array.from(categoryMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Project Management</p>
            <h2 className="text-2xl font-semibold text-slate-900">Quản lý dự án</h2>
          </div>
          <Link href="/admin/projects/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Dự Án
            </Button>
          </Link>
        </div>
      </div>

      <StatsPanel
        title="Thống kê dự án"
        subtitle="Theo dõi số lượng dự án và phân bổ theo loại hình"
        summaries={[
          { label: "Tổng dự án", value: projects.length, tone: "slate" },
          { label: "Dự án nổi bật", value: featuredCount, tone: "amber" },
          { label: "Loại hình", value: categoryData.length, tone: "sky" },
        ]}
        chartTitle="Biểu đồ dự án theo loại hình"
        data={categoryData}
        emptyText="Chưa có dữ liệu dự án"
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center">
          <p className="mb-4 text-slate-600">Chưa có dự án nào</p>
          <Link href="/admin/projects/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Tạo Dự Án Đầu Tiên
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="flex min-w-0 flex-1 gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={project.coverImage.url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-slate-900">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600">{project.category}</p>
                  {project.featured && (
                    <p className="mt-1 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Nổi bật
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/projects/${project.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Sửa
                  </Button>
                </Link>
                <Link href={`/du-an/${project.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    Xem
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsListPage;
