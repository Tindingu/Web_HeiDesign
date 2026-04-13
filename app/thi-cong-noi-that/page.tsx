import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thi công nội thất",
    description:
      "Khám phá các mẫu thi công nội thất theo từng loại công trình.",
    path: "/thi-cong-noi-that",
  });

export default async function InteriorConstructionPage() {
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
