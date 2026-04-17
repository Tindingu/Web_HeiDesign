import { buildMetadata } from "@/lib/seo";
import { getProjects } from "@/lib/strapi";
import { readProjectCategories, readProjectStyles } from "@/lib/taxonomy-storage";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureShowcase } from "@/components/portfolio/architecture-showcase";
import { DualFileWordUploader } from "@/components/portfolio/dual-file-word-uploader";
import { Container } from "@/components/shared/container";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Dự án",
    description:
      "Khám phá các dự án nội thất cao cấp được thiết kế riêng cho phong cách sống đẳng cấp.",
    path: "/du-an",
  });

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams?: { type?: string; category?: string; style?: string };
}) {
  const [projects, categories, styles] = await Promise.all([
    getProjects(),
    readProjectCategories(),
    readProjectStyles(),
  ]);
  const initialCategory = searchParams?.category ?? searchParams?.type;
  const initialStyle = searchParams?.style ?? searchParams?.type;

  return (
    <main className="bg-background">
      <CompletedProjects
        projects={projects}
        categories={categories}
        maxItemsPerTab={null}
        showViewMoreButton={false}
        initialTab={initialCategory}
        theme="light"
      />

      <ArchitectureShowcase
        projects={projects}
        styles={styles}
        initialTab={initialStyle}
        theme="light"
      />

      <section className="py-20 bg-background">
        <Container>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold uppercase tracking-wide md:text-6xl">
              Tải Bài Viết Từ Word
            </h2>
            <DualFileWordUploader />
          </div>
        </Container>
      </section>
    </main>
  );
}
