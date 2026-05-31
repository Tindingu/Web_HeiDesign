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
import { readHeroBannerSettings } from "@/lib/hero-banner-storage";
import { HotTopicSection } from "@/components/home/hot-topic-section";
import { readActiveHomepageTestimonials } from "@/lib/homepage-testimonial-storage";
import { WhyChooseHei } from "@/components/home/why-choose-hei";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { StrategicPartners } from "@/components/home/strategic-partners";

export const revalidate = 3600;

export const generateMetadata = () =>
  buildMetadata({
    title: "Thiết kế nội thất cao cấp",
    description:
      "HEI Design cung cấp dịch vụ thiết kế và thi công nội thất cao cấp với chi phí minh bạch, đo lường được.",
    path: "/",
  });

export default async function HomePage() {
  const [
    projects,
    content,
    categories,
    styles,
    architectureGallery,
    videos,
    heroBanner,
  ] = await Promise.all([
    getProjects(),
    getHomeContent(),
    readProjectCategories(),
    readProjectStyles(),
    readArchitectureGallery(),
    readActiveHomepageVideos(),
    readHeroBannerSettings(),
  ]);
  const [posts, hotTopic, managedTestimonials] = await Promise.all([
    getPosts(),
    readHotBlogTopicSettings(),
    readActiveHomepageTestimonials(),
  ]);

  // Use managed hero banner if available, fallback to content.hero
  const hero = heroBanner
    ? {
        title: heroBanner.title,
        subtitle: heroBanner.subtitle,
        ctaPrimary: heroBanner.ctaPrimary,
        ctaSecondary: heroBanner.ctaSecondary,
        videoUrl: content.hero.videoUrl,
        imageUrl: heroBanner.imageUrls[0] || content.hero.imageUrl,
        imageUrls: heroBanner.imageUrls,
      }
    : content.hero;

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
    <main className="bg-background overflow-x-clip">
      <ScrollReveal className="relative" distance={0}>
        <Hero hero={hero} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <About />
      </ScrollReveal>

      {/* <FeaturedProjects projects={projects} /> */}
      <ScrollReveal delay={0.08}>
        <CompletedProjects
          projects={projects}
          categories={categories}
          theme="light"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
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
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <VideoSection videos={videos} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <BlogHighlights posts={posts} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <WhyChooseHei />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <TestimonialsCarousel testimonials={testimonials} />
      </ScrollReveal>

      {hotTopic && (
        <ScrollReveal delay={0.05}>
          <HotTopicSection settings={hotTopic} posts={posts} />
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.05}>
        <Services services={content.services} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <ProcessTimeline steps={content.processSteps} />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <StrategicPartners />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <CtaStrip />
      </ScrollReveal>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
