import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getPortfolioData();

  return [
    {
      url: `${site.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
