import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/db";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getPortfolioData();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
