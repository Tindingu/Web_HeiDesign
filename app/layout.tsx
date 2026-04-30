import "./globals.css";

import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LeadCapturePopup } from "@/components/contact/lead-capture-popup";
import { FloatingContactButtons } from "@/components/contact/floating-contact-buttons";
import { PageTransition } from "@/components/motion/page-transition";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/upload/logo/favicon.jpg",
    shortcut: "/upload/logo/favicon.jpg",
    apple: "/upload/logo/favicon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <FloatingContactButtons />
        <LeadCapturePopup />
        <SiteFooter />
      </body>
    </html>
  );
}
