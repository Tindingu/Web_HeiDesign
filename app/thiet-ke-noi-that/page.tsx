import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import { readProjectCategories, readProjectStyles } from "@/lib/taxonomy-storage";
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
  const [projects, categories, styles] = await Promise.all([
    getProjects(),
    readProjectCategories(),
    readProjectStyles(),
  ]);

  return (
    <main className="bg-background">
      <CompletedProjects
        projects={projects}
        categories={categories}
        maxItemsPerTab={null}
        showViewMoreButton={false}
        theme="light"
      />

      <ArchitectureShowcase projects={projects} styles={styles} theme="light" />
    </main>
  );
}
