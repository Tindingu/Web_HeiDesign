import Link from "next/link";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <Container className="grid gap-8 py-12 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="uppercase tracking-[0.18em] text-muted-foreground">
            Liên hệ
          </p>
          <p>{siteConfig.phone}</p>
          <p>{siteConfig.email}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="uppercase tracking-[0.18em] text-muted-foreground">
            Liên kết
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/du-an">Dự án</Link>
            <Link href="/bao-gia">Báo giá</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
