import type { MetadataRoute } from "next";
import { getPortfolioData } from "@/lib/db";
import { notes } from "@/lib/notes";

/**
 * Regenerate daily. Without this the route is generated once at build time
 * and the CDN can keep serving a stale copy long after a deploy.
 */
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getPortfolioData();

  const notePages: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${site.siteUrl}/blog/${note.slug}`,
    lastModified: new Date(note.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

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
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.siteUrl}/blog/full-stack-interview-roadmap`,
      lastModified: new Date("2026-08-28"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...notePages,
    {
      url: `${site.siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
