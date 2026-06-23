import "./globals.css";

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import React, { Suspense } from "react";
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

const facebookPixelId =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  process.env.META_PIXEL_ID ||
  "27265110099809235";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `,
          }}
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
