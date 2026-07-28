import "./globals.css";

import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import React, { Suspense } from "react";
import { LeadCapturePopup } from "@/components/contact/lead-capture-popup";
import { FloatingContactButtons } from "@/components/contact/floating-contact-buttons";
import { PageTransition } from "@/components/motion/page-transition";
import { siteConfig } from "@/lib/constants";
import { SiteTrackingScripts } from "@/components/tracking/site-tracking-scripts";

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

const facebookPixelId =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  process.env.META_PIXEL_ID ||
  "27265110099809235";
const googleAnalyticsId = "G-79QWQH5DMM";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <SiteTrackingScripts
          facebookPixelId={facebookPixelId}
          googleAnalyticsId={googleAnalyticsId}
        />
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <PageTransition>{children}</PageTransition>
        <FloatingContactButtons />
        <LeadCapturePopup />
        <SiteFooter />
      </body>
    </html>
  );
}
