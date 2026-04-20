import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { MarkdownRenderer } from "@/components/shared/markdown-renderer";
import { WordUploader } from "@/components/shared/word-uploader";
import { getServiceBySlug, getAllServices } from "@/lib/services";

export const revalidate = 0;

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.metadata.title,
    description: service.metadata.description,
    openGraph: {
      title: service.metadata.title,
      description: service.metadata.description,
      images: [service.metadata.coverImage],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="bg-white">
      <Container className="py-16 md:py-20">
        {/* Title */}
        <div className="mb-12 pb-8 border-b">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            {service.metadata.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {service.metadata.description}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          <div className="prose prose-lg max-w-none mb-12">
            <MarkdownRenderer content={service.content} />
          </div>

          {/* Upload Section */}
          <div className="rounded-lg border-2 border-dashed border-amber-600 bg-amber-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thêm Nội Dung Từ Word
            </h2>
            <p className="text-gray-600 mb-6">
              Upload file Word (.docx) để tự động chuyển đổi thành Markdown. Nội
              dung sẽ xuất hiện dưới dạng HTML trên trang web của bạn.
            </p>
            <WordUploader />
          </div>
        </div>
      </Container>
    </main>
  );
}
