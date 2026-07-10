import { neon } from "@neondatabase/serverless";
import { fallbackPortfolioData } from "./fallback-data";
import type {
  AboutContent,
  BlogPost,
  Certificate,
  ContactChannel,
  ContactMessage,
  HeroContent,
  IconKey,
  NavItem,
  PortfolioData,
  Project,
  SeoSettings,
  SiteProfile,
  SkillGroup,
  SocialLink,
  WorkExperience,
  WorkProject,
} from "./portfolio-types";

type SqlClient = ReturnType<typeof neon>;
type DbRow = Record<string, unknown>;

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export function getSql(): SqlClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(process.env.DATABASE_URL);
}

function arrayValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function booleanValue(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPortfolioData(options?: {
  includeUnpublished?: boolean;
}): Promise<PortfolioData> {
  if (!hasDatabase) return fallbackPortfolioData;

  try {
    const sql = getSql();
    const includeUnpublished = options?.includeUnpublished ?? false;

    const [
      siteRows,
      seoRows,
      heroRows,
      aboutRows,
      navRows,
      socialRows,
      workRows,
      workProjectRows,
      projectRows,
      skillGroupRows,
      skillRows,
      deliveryRows,
      blogRows,
      certificateRows,
      contactRows,
    ] = (await Promise.all([
      sql`SELECT * FROM site_profile LIMIT 1`,
      sql`SELECT * FROM seo_settings LIMIT 1`,
      sql`SELECT * FROM hero LIMIT 1`,
      sql`SELECT * FROM about LIMIT 1`,
      sql`SELECT * FROM nav_items WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM social_links WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM work_experiences WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM work_projects WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM projects WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM skill_groups WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM skills WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM delivery_strengths WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM blog_posts WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM certificates WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
      sql`SELECT * FROM contact_channels WHERE (${includeUnpublished} OR is_published = true) ORDER BY sort_order ASC`,
    ])) as DbRow[][];

    const site = mapSite(siteRows[0]) || fallbackPortfolioData.site;
    const seo = mapSeo(seoRows[0]) || fallbackPortfolioData.seo;
    const hero = mapHero(heroRows[0]) || fallbackPortfolioData.hero;
    const about = mapAbout(aboutRows[0]) || fallbackPortfolioData.about;
    const workProjects = workProjectRows.map(mapWorkProject).filter(Boolean) as WorkProject[];
    const skillsByGroup = new Map<number, string[]>();

    for (const row of skillRows) {
      const groupId = Number(row.skill_group_id);
      const current = skillsByGroup.get(groupId) || [];
      current.push(String(row.name));
      skillsByGroup.set(groupId, current);
    }

    return {
      site,
      seo,
      hero,
      about,
      navItems: navRows.map(mapNavItem).filter(Boolean) as NavItem[],
      socials: socialRows.map(mapSocial).filter(Boolean) as SocialLink[],
      workExperiences: workRows.map((row) => {
        const work = mapWorkExperience(row);
        if (!work) return null;
        return {
          ...work,
          projects: workProjects.filter((project) => project.id.startsWith(`${work.id}:`)),
        };
      }).filter(Boolean) as WorkExperience[],
      projects: projectRows.map(mapProject).filter(Boolean) as Project[],
      skillGroups: skillGroupRows.map((row) => {
        const group = mapSkillGroup(row);
        if (!group) return null;
        return { ...group, skills: skillsByGroup.get(group.id) || [] };
      }).filter(Boolean) as SkillGroup[],
      deliveryStrengths: deliveryRows.map((row) => String(row.label)),
      blogPosts: blogRows.map(mapBlogPost).filter(Boolean) as BlogPost[],
      certificates: certificateRows.map(mapCertificate).filter(Boolean) as Certificate[],
      contactChannels: contactRows.map(mapContactChannel).filter(Boolean) as ContactChannel[],
    };
  } catch (error) {
    console.error("Failed to load portfolio data from Neon.", error);
    return fallbackPortfolioData;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!hasDatabase) return [];
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM contact_messages
    ORDER BY created_at DESC
  `) as DbRow[];
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    email: String(row.email),
    subject: String(row.subject || "Portfolio message"),
    message: String(row.message),
    isRead: booleanValue(row.is_read),
    isArchived: booleanValue(row.is_archived),
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
}

function mapSite(row: Record<string, unknown> | undefined): SiteProfile | null {
  if (!row) return null;
  return {
    name: String(row.name || fallbackPortfolioData.site.name),
    initials: String(row.initials || fallbackPortfolioData.site.initials),
    title: String(row.title || fallbackPortfolioData.site.title),
    email: String(row.email || fallbackPortfolioData.site.email),
    siteUrl: String(row.site_url || process.env.SITE_URL || fallbackPortfolioData.site.siteUrl),
    defaultDescription: String(
      row.default_description || fallbackPortfolioData.site.defaultDescription,
    ),
    keywords: arrayValue(row.keywords),
    ogImage: String(row.og_image || fallbackPortfolioData.site.ogImage),
    twitterImage: String(row.twitter_image || fallbackPortfolioData.site.twitterImage),
    resumeUrl: String(row.resume_url || fallbackPortfolioData.site.resumeUrl),
  };
}

function mapSeo(row: Record<string, unknown> | undefined): SeoSettings | null {
  if (!row) return null;
  return {
    title: String(row.title || fallbackPortfolioData.seo.title),
    description: String(row.description || fallbackPortfolioData.seo.description),
    keywords: arrayValue(row.keywords),
    canonicalUrl: String(row.canonical_url || "/"),
    ogTitle: String(row.og_title || row.title || fallbackPortfolioData.seo.ogTitle),
    ogDescription: String(row.og_description || row.description || fallbackPortfolioData.seo.ogDescription),
    ogImage: String(row.og_image || fallbackPortfolioData.seo.ogImage),
    twitterTitle: String(row.twitter_title || row.title || fallbackPortfolioData.seo.twitterTitle),
    twitterDescription: String(
      row.twitter_description || row.description || fallbackPortfolioData.seo.twitterDescription,
    ),
    twitterImage: String(row.twitter_image || fallbackPortfolioData.seo.twitterImage),
  };
}

function mapHero(row: Record<string, unknown> | undefined): HeroContent | null {
  if (!row) return null;
  return {
    eyebrow: String(row.eyebrow || ""),
    name: String(row.name || ""),
    description: String(row.description || ""),
    primaryLabel: String(row.primary_label || "View work"),
    primaryHref: String(row.primary_href || "#projects"),
    secondaryLabel: String(row.secondary_label || "Contact"),
    secondaryHref: String(row.secondary_href || "#contact"),
    imageUrl: String(row.image_url || "/portrait-hero-wide.png"),
    imageAlt: String(row.image_alt || "Portfolio hero portrait"),
  };
}

function mapAbout(row: Record<string, unknown> | undefined): AboutContent | null {
  if (!row) return null;
  return {
    eyebrow: String(row.eyebrow || "About"),
    title: String(row.title || ""),
    intro: String(row.intro || ""),
    body: String(row.body || ""),
    focusItems: arrayValue(row.focus_items),
    resumeUrl: String(row.resume_url || fallbackPortfolioData.site.resumeUrl),
  };
}

function mapNavItem(row: Record<string, unknown>): NavItem {
  return {
    label: String(row.label),
    href: String(row.href),
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapSocial(row: Record<string, unknown>): SocialLink {
  return {
    label: String(row.label),
    href: String(row.href),
    icon: String(row.icon || "globe") as IconKey,
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapWorkExperience(row: Record<string, unknown>): WorkExperience {
  return {
    id: Number(row.id),
    company: String(row.company),
    position: String(row.position),
    period: String(row.period),
    location: String(row.location),
    technologies: arrayValue(row.technologies),
    projects: [],
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapWorkProject(row: Record<string, unknown>): WorkProject {
  return {
    id: `${Number(row.work_experience_id)}:${String(row.slug)}`,
    name: String(row.name),
    description: String(row.description),
    achievements: arrayValue(row.achievements),
    impact: String(row.impact),
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description),
    impact: String(row.impact),
    imageUrl: String(row.image_url),
    imageAlt: String(row.image_alt),
    videoUrl: row.video_url ? String(row.video_url) : null,
    tags: arrayValue(row.tags),
    demoUrl: String(row.demo_url),
    codeUrl: String(row.code_url),
    icon: String(row.icon || "briefcase") as IconKey,
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapSkillGroup(row: Record<string, unknown>): SkillGroup {
  return {
    id: Number(row.id),
    title: String(row.title),
    icon: String(row.icon || "layers") as IconKey,
    description: String(row.description),
    skills: [],
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: Number(row.id),
    title: String(row.title),
    category: String(row.category),
    publishedAt: String(row.published_at_label || ""),
    source: String(row.source || ""),
    excerpt: String(row.excerpt || ""),
    url: String(row.url),
    seoTitle: String(row.seo_title || row.title),
    seoDescription: String(row.seo_description || row.excerpt || ""),
    canonicalUrl: String(row.canonical_url || row.url),
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapCertificate(row: Record<string, unknown>): Certificate {
  return {
    id: Number(row.id),
    title: String(row.title),
    issuer: String(row.issuer),
    issuedAtLabel: String(row.issued_at_label),
    description: String(row.description),
    url: String(row.url),
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

function mapContactChannel(row: Record<string, unknown>): ContactChannel {
  return {
    id: Number(row.id),
    label: String(row.label),
    value: String(row.value),
    href: String(row.href),
    icon: String(row.icon || "mail") as IconKey,
    sortOrder: Number(row.sort_order || 0),
    isPublished: booleanValue(row.is_published),
  };
}

export { sortByOrder };
