import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
// import { FeaturedProjects } from "@/components/home/featured-projects";
import { CompletedProjects } from "@/components/home/completed-projects";
import { ArchitectureStyles } from "@/components/home/architecture-styles";
import { BlogHighlights } from "@/components/home/blog-highlights";
import { VideoSection } from "@/components/home/video-section";
import { Services } from "@/components/home/services";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { CtaStrip } from "@/components/home/cta-strip";
import { buildBusinessJsonLd, buildMetadata } from "@/lib/seo";
import { getHomeContent, getPosts, getProjects } from "@/lib/strapi";
import {
  readProjectCategories,
  readProjectStyles,
} from "@/lib/taxonomy-storage";
import { readArchitectureGallery } from "@/lib/architecture-gallery-storage";
import { readActiveHomepageVideos } from "@/lib/homepage-video-storage";
import { readHotBlogTopicSettings } from "@/lib/hot-blog-topic-storage";
import { HotTopicSection } from "@/components/home/hot-topic-section";
import { readActiveHomepageTestimonials } from "@/lib/homepage-testimonial-storage";
import { WhyChooseHei } from "@/components/home/why-choose-hei";

export const revalidate = 120;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thiết kế nội thất cao cấp",
    description:
      "ICEP Design cung cấp dịch vụ thiết kế và thi công nội thất cao cấp với chi phí minh bạch, đo lường được.",
    path: "/",
  });

export default async function HomePage() {
  const [projects, content, categories, styles, architectureGallery, videos] =
    await Promise.all([
      getProjects(),
      getHomeContent(),
      readProjectCategories(),
      readProjectStyles(),
      readArchitectureGallery(),
      readActiveHomepageVideos(),
    ]);
  const [posts, hotTopic, managedTestimonials] = await Promise.all([
    getPosts(),
    readHotBlogTopicSettings(),
    readActiveHomepageTestimonials(),
  ]);
  const testimonials =
    managedTestimonials.length > 0
      ? managedTestimonials.map((item) => ({
          name: item.name,
          quote: item.quote,
          role: "",
          imageUrl: item.imageUrl,
        }))
      : content.testimonials;
  const jsonLd = buildBusinessJsonLd();

  return (
    <main className="bg-background">
      <Hero hero={content.hero} />
      <About />
      {/* <FeaturedProjects projects={projects} /> */}
      <CompletedProjects
        projects={projects}
        categories={categories}
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
      <VideoSection videos={videos} />
      <BlogHighlights posts={posts} />
      <WhyChooseHei />
      <TestimonialsCarousel testimonials={testimonials} />
      {hotTopic && <HotTopicSection settings={hotTopic} posts={posts} />}
      <Services services={content.services} />
      <ProcessTimeline steps={content.processSteps} />
      <CtaStrip />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
