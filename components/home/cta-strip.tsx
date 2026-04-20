import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

export function CtaStrip() {
  return (
    <section className="py-16">
      <Container className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border/60 bg-muted/30 p-8 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Sẵn sàng bắt đầu
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Nhận báo giá chi tiết trong vài phút.
          </h2>
        </div>
        <Button asChild size="lg">
          <Link href="/bao-gia">Mở báo giá nhanh</Link>
        </Button>
      </Container>
    </section>
  );
}
