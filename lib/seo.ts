import type { Metadata } from "next";
import type { ProjectArticle } from "@/lib/article-storage";
import { siteConfig } from "@/lib/constants";
import type { Post, Project } from "@/lib/strapi";

const businessId = `${siteConfig.url}/#localbusiness`;
const organizationId = `${siteConfig.url}/#organization`;
const websiteId = `${siteConfig.url}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function cleanNullableArray(items: Array<string | undefined | null>) {
  return items.filter(Boolean) as string[];
}

function buildPublisher() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    logo: {
      "@type": "ImageObject",
      url: siteConfig.logoUrl,
    },
  };
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description: description ?? siteConfig.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: description ?? siteConfig.description,
      url,
      siteName: siteConfig.name,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? siteConfig.description,
      images: image ? [image] : undefined,
    },
  };
}

export function buildBusinessJsonLd() {
  return buildLocalBusinessJsonLd();
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: siteConfig.alternateName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: siteConfig.logoUrl,
    image: siteConfig.logoUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    sameAs: cleanNullableArray([
      siteConfig.facebookUrl,
      siteConfig.youtubeUrl,
      siteConfig.instagramUrl,
      siteConfig.tiktokUrl,
      siteConfig.zaloUrl,
      siteConfig.mapUrl,
    ]),
  };
}

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: siteConfig.legalName,
    alternateName: siteConfig.alternateName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: siteConfig.logoUrl,
    logo: siteConfig.logoUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    hasMap: siteConfig.mapUrl,
    priceRange: "$$",
    openingHours: siteConfig.openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.streetAddress,
      addressLocality: siteConfig.addressLocality,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.addressCountry,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Thành phố Hồ Chí Minh",
    },
    sameAs: cleanNullableArray([
      siteConfig.facebookUrl,
      siteConfig.youtubeUrl,
      siteConfig.instagramUrl,
      siteConfig.tiktokUrl,
      siteConfig.zaloUrl,
    ]),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    url: siteConfig.url,
    publisher: {
      "@id": organizationId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/tim-kiem?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildSiteNavigationJsonLd() {
  const navigationItems = [
    { name: "Trang chủ", url: "/" },
    { name: "Thiết Kế Nội Thất", url: "/thiet-ke-noi-that" },
    { name: "Thi Công Nội Thất", url: "/thi-cong-noi-that" },
    { name: "Dự án", url: "/du-an" },
    { name: "Kinh Nghiệm Hay", url: "/blog" },
    { name: "Tiện ích thiết kế", url: "/bao-gia" },
    { name: "Liên hệ", url: "/lien-he" },
    { name: "Giới thiệu", url: "/gioi-thieu" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Điều hướng chính HEI Design",
    itemListElement: navigationItems.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

export function buildServiceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description?: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description: description ?? siteConfig.description,
    serviceType: serviceType ?? name,
    url: absoluteUrl(path),
    provider: {
      "@id": businessId,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Thành phố Hồ Chí Minh",
    },
  };
}

export function buildProjectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteConfig.url}/du-an/${project.slug}`,
    image: project.coverImage.url,
    about: project.category,
  };
}

export function buildArticleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    url: `${siteConfig.url}/blog/${post.slug}`,
    image: post.coverImage.url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@id": organizationId,
    },
    publisher: buildPublisher(),
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

export function buildProjectArticleJsonLd(
  article: ProjectArticle,
  path: string,
) {
  const url = absoluteUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    image: article.coverImageUrl,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    articleSection: article.category ?? article.targetType,
    author: {
      "@id": organizationId,
    },
    publisher: buildPublisher(),
    mainEntityOfPage: url,
  };
}

export function buildHomeJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationJsonLd(),
      buildLocalBusinessJsonLd(),
      buildWebsiteJsonLd(),
      buildSiteNavigationJsonLd(),
    ].map((item) => {
      const { "@context": _context, ...schema } = item;
      return schema;
    }),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
