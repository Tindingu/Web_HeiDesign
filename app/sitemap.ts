import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { getPostCategories, getPostSlugs, getProjectSlugs } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs, postCategories] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getPostCategories(),
  ]);

  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/du-an`, lastModified: new Date() },
    { url: `${siteConfig.url}/bao-gia`, lastModified: new Date() },
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    ...projectSlugs.map((slug) => ({
      url: `${siteConfig.url}/du-an/${slug}`,
      lastModified: new Date(),
    })),
    ...postSlugs.map((slug) => ({
      url: `${siteConfig.url}/blog/${slug}`,
      lastModified: new Date(),
    })),
    ...postCategories.map((category) => ({
      url: `${siteConfig.url}/blog/chuyen-muc/${category.slug}`,
      lastModified: new Date(),
    })),
  ];
}
