import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
// import { FeaturedProjects } from "@/components/home/featured-projects";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureStyles } from "@/components/home/architecture-styles";
import { Services } from "@/components/home/services";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { CtaStrip } from "@/components/home/cta-strip";
import { buildBusinessJsonLd, buildMetadata } from "@/lib/seo";
import { getHomeContent, getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thiết kế nội thất cao cấp",
    description:
      "ICEP Design cung cấp dịch vụ thiết kế và thi công nội thất cao cấp với chi phí minh bạch, đo lường được.",
    path: "/",
  });

export default async function HomePage() {
  const [projects, content, categories, styles] = await Promise.all([
    getProjects(),
    getHomeContent(),
    readProjectCategories(),
    readProjectStyles(),
  ]);
  const jsonLd = buildBusinessJsonLd();

  return (
    <main className="bg-background">
      <Hero hero={content.hero} />
      <About />
      {/* <FeaturedProjects projects={projects} /> */}
      <CompletedProjects projects={projects} categories={categories} />
      <ArchitectureStyles projects={projects} styles={styles} />
      <Services services={content.services} />
      <ProcessTimeline steps={content.processSteps} />
      <TestimonialsCarousel testimonials={content.testimonials} />
      <CtaStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
