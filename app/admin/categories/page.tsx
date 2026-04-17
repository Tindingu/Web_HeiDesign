import { Container } from "@/components/shared/container";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";

export const revalidate = 0;

export default function AdminCategoriesPage() {
  return (
    <Container className="py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Quản Lý Category, Style & Heading</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý category dự án, style dự án, category blog và danh sách
            heading cho Thiết kế nội thất / Thi công nội thất.
          </p>
        </div>

        <TaxonomyManager />
      </div>
    </Container>
  );
}
