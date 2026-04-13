import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { readProjects } from "@/lib/project-storage";
import Image from "next/image";

export const revalidate = 0; // Always fresh

async function ProjectsListPage() {
  const projects = await readProjects();

  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Quản Lý Dự Án</h1>
          <Link href="/admin/projects/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              + Thêm Dự Án
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <p className="mb-4 text-gray-600">Chưa có dự án nào</p>
            <Link href="/admin/projects/new">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Tạo Dự Án Đầu Tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={project.coverImage.url}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600">{project.category}</p>
                    <p className="text-xs text-gray-500">
                      {project.featured && "⭐ Nổi bật"}
                    </p>
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
    </Container>
  );
}

export default ProjectsListPage;
