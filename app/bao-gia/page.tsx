import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/shared/container";
import { QuoteCalculator } from "@/components/pricing/quote-calculator";
import { SmartComparison } from "@/components/pricing/smart-comparison";
import { InteriorSimulator } from "@/components/pricing/interior-simulator";

export const generateMetadata = () =>
  buildMetadata({
    title: "Báo giá nhanh",
    description:
      "Tính giá nội thất tức thời dựa trên diện tích, vật liệu và mức hoàn thiện.",
    path: "/bao-gia",
  });

export default function QuotePage() {
  return (
    <main className="bg-background">
      <Container className="py-16 space-y-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <QuoteCalculator />
          <SmartComparison />
        </div>
        <InteriorSimulator />
      </Container>
    </main>
  );
}
