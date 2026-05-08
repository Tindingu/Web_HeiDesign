import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureStyles } from "@/components/home/architecture-styles";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thiết kế nội thất",
    description:
      "Khám phá các mẫu thiết kế nội thất theo từng loại công trình.",
    path: "/thiet-ke-noi-that",
  });

export default async function InteriorDesignPage() {
  const [projects, categories, styles, architectureGallery] = await Promise.all(
    [
      getProjects(),
      readProjectCategories(),
      readProjectStyles(),
      readArchitectureGallery(),
    ],
  );

  return (
    <main className="bg-background">
      <CompletedProjects
        projects={projects}
        categories={categories}
        maxItemsPerTab={null}
        showViewMoreButton={false}
        theme="light"
      />

      <ArchitectureStyles
        projects={projects}
        styles={styles}
        curatedItems={architectureGallery.map((item) => ({
          styleSlug: item.styleSlug,
          projectSlug: item.projectSlug,
          projectTitle: item.projectTitle,
          slotIndex: item.slotIndex,
          orientation: item.orientation,
          imageUrl: item.imageUrl,
          imageAlt: item.imageAlt,
        }))}
      />
    </main>
  );
}
