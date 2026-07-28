import { Container } from "@/components/shared/container";
import { CloudinaryMdUrlTool } from "@/components/admin/cloudinary-md-url-tool";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CloudinaryMarkdownToolPage() {
  return (
    <Container className="py-12">
      <div className="max-w-5xl">
        <CloudinaryMdUrlTool />
      </div>
    </Container>
  );
}
