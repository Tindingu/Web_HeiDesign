import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureStyles } from "@/components/home/architecture-styles";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/shared/container";

export const revalidate = 86400;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thi công nội thất",
    description:
      "Khám phá các mẫu thi công nội thất theo từng loại công trình.",
    path: "/thi-cong-noi-that",
  });

export default async function InteriorConstructionPage() {
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
      <Container className="pt-10">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Thi công nội thất", href: "/thi-cong-noi-that" },
          ]}
        />
      </Container>

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
