import { notFound } from "next/navigation";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildProjectJsonLd,
} from "@/lib/seo";
import { getProjectBySlug, getProjectSlugs, getProjects } from "@/lib/strapi";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GalleryCarousel } from "@/components/project/gallery-carousel";
import { ProjectGalleryGrid } from "@/components/project/project-gallery-grid";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { RelatedProjectsCarousel } from "@/components/project/related-projects-carousel";
import { BlogToc } from "@/components/blog/toc";
import { extractHeadings } from "@/lib/mdx";

export const revalidate = 0; // Always fresh from storage

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project)
    return buildMetadata({ title: "Project", path: `/du-an/${params.slug}` });

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/du-an/${params.slug}`,
    image: project.coverImage.url,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  // Get other projects for "Related Projects" section
  const allProjects = await getProjects();
  const otherProjects = allProjects.filter((p) => p.slug !== params.slug);
  const wordHeadings = project.wordContent
    ? extractHeadings(project.wordContent)
    : [];

  const jsonLd = buildProjectJsonLd(project);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://icepdesign.vn" },
    { name: "Portfolio", url: "https://icepdesign.vn/du-an" },
    { name: project.title, url: `https://icepdesign.vn/du-an/${project.slug}` },
  ]);

  return (
    <main className="bg-white">
      {/* Gallery Carousel */}
      <GalleryCarousel project={project} />

      {/* Content */}
      <Container className="py-20">
        <div className="space-y-20">
          {/* Project Info */}
          {/* <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Thông Tin Dự Án</h2>
              <div className="space-y-4">
                {project.projectDetails && (
                  <>
                    {project.projectDetails.client && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          KHÁCH HÀNG
                        </p>
                        <p className="mt-1 text-lg">
                          {project.projectDetails.client}
                        </p>
                      </div>
                    )}
                    {project.projectDetails.location && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          ĐỊA ĐỊA
                        </p>
                        <p className="mt-1 text-lg">
                          {project.projectDetails.location}
                        </p>
                      </div>
                    )}
                    {project.projectDetails.area && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          DIỆN TÍCH
                        </p>
                        <p className="mt-1 text-lg">
                          {project.projectDetails.area}
                        </p>
                      </div>
                    )}
                    {project.projectDetails.duration && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          THỜI GIAN
                        </p>
                        <p className="mt-1 text-lg">
                          {project.projectDetails.duration}
                        </p>
                      </div>
                    )}
                    {project.projectDetails.scope && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          PHẠM VI
                        </p>
                        <p className="mt-1 text-lg">
                          {project.projectDetails.scope}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-6 text-3xl font-bold">Chi Tiết</h2>
              <div className="space-y-4">
                {project.details.map((detail) => (
                  <div
                    key={detail.label}
                    className="border-b border-gray-200 pb-4"
                  >
                    <p className="text-sm font-semibold text-gray-600 uppercase">
                      {detail.label}
                    </p>
                    <p className="mt-2 text-lg">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Description */}
          {project.description && (
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold">Mô Tả Chi Tiết</h2>
              <p className="mt-6 whitespace-pre-wrap text-gray-700">
                {project.description}
              </p>
            </div>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <div>
              <h2 className="mb-8 text-3xl font-bold">Hình Ảnh Dự Án</h2>
              <ProjectGalleryGrid images={project.gallery} />
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div>
              <h2 className="mb-8 text-3xl font-bold">Điểm Nổi Bật</h2>
              <ul className="space-y-3">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-600" />
                    <span className="text-lg text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sections */}
          {project.sections && project.sections.length > 0 && (
            <div className="space-y-16">
              {project.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="grid gap-8 md:grid-cols-2 md:items-center"
                >
                  <div className={idx % 2 !== 0 ? "md:order-2" : undefined}>
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                    <p className="mt-4 whitespace-pre-wrap text-gray-700">
                      {section.content}
                    </p>
                  </div>
                  {section.image && (
                    <div
                      className={`relative aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[16/10] sm:h-auto ${
                        idx % 2 !== 0 ? "md:order-1" : ""
                      }`}
                    >
                      <Image
                        src={section.image.url}
                        alt={section.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) calc(100vw - 2rem), 50vw"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {project.wordContent && (
            <div className="prose prose-lg max-w-none">
              {/* <h2 className="text-3xl font-bold">Bài Viết Dự Án</h2> */}
              <div className="mt-6">
                <MarkdownRenderer content={project.wordContent} />
              </div>
            </div>
          )}

          {wordHeadings.length > 0 && <BlogToc headings={wordHeadings} />}

          {/* Related Projects Carousel */}
          <RelatedProjectsCarousel projects={otherProjects} />

          {/* CTA */}
          <div className="rounded-lg bg-gray-900 px-8 py-16 text-white md:px-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Bạn có dự án tương tự?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Hãy liên hệ với chúng tôi để tìm hiểu thêm về dịch vụ thiết kế và
              thi công của ICEP.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link href="/bao-gia">Nhận Báo Giá</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <a href="tel:0795743429">Gọi Tư Vấn</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </main>
  );
}
