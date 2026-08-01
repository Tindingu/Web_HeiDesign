import { WpQuotationPage } from "@/components/pricing/wp-quotation-page";
import { buildMetadata } from "@/lib/seo";

export const generateMetadata = () =>
  buildMetadata({
    title: "Báo giá",
    description:
      "Tạo bảng báo giá nội thất theo sản phẩm, vật liệu, kích thước và nhà cung cấp.",
    path: "/bao-gia",
  });

export default function QuotePage() {
  return <WpQuotationPage />;
}
