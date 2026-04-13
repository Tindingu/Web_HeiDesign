import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thiết kế nội thất",
    description:
      "Khám phá các mẫu thiết kế nội thất theo từng loại công trình.",
    path: "/thiet-ke-noi-that",
  });

export default async function InteriorDesignPage() {
  const projects = await getProjects();

  return (
    <main className="bg-background">
      <CompletedProjects
        projects={projects}
        maxItemsPerTab={null}
        showViewMoreButton={false}
        theme="light"
      />

      <ArchitectureShowcase projects={projects} theme="light" />
    </main>
  );
}
