export type IconKey =
  | "award"
  | "briefcase"
  | "code"
  | "github"
  | "globe"
  | "layers"
  | "linkedin"
  | "mail"
  | "milk"
  | "qr"
  | "server"
  | "wrench";

export type SiteProfile = {
  name: string;
  initials: string;
  title: string;
  email: string;
  siteUrl: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
  twitterImage: string;
  resumeUrl: string;
};

export type SeoSettings = {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

export type NavItem = {
  label: string;
  href: string;
  sortOrder: number;
  isPublished: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: IconKey;
  sortOrder: number;
  isPublished: boolean;
};

export type HeroContent = {
  eyebrow: string;
  name: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  imageUrl: string;
  imageAlt: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  focusItems: string[];
  resumeUrl: string;
};

export type WorkProject = {
  id: string;
  name: string;
  description: string;
  achievements: string[];
  impact: string;
  sortOrder: number;
  isPublished: boolean;
};

export type WorkExperience = {
  id: number;
  company: string;
  position: string;
  period: string;
  location: string;
  technologies: string[];
  projects: WorkProject[];
  sortOrder: number;
  isPublished: boolean;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  impact: string;
  imageUrl: string;
  imageAlt: string;
  videoUrl: string | null;
  tags: string[];
  demoUrl: string;
  codeUrl: string;
  icon: IconKey;
  sortOrder: number;
  isPublished: boolean;
};

export type SkillGroup = {
  id: number;
  title: string;
  icon: IconKey;
  description: string;
  skills: string[];
  sortOrder: number;
  isPublished: boolean;
};

export type BlogPost = {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  source: string;
  excerpt: string;
  url: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  sortOrder: number;
  isPublished: boolean;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string;
  issuedAtLabel: string;
  description: string;
  url: string;
  sortOrder: number;
  isPublished: boolean;
};

export type ContactChannel = {
  id: number;
  label: string;
  value: string;
  href: string;
  icon: IconKey;
  sortOrder: number;
  isPublished: boolean;
};

export type PortfolioData = {
  site: SiteProfile;
  seo: SeoSettings;
  navItems: NavItem[];
  socials: SocialLink[];
  hero: HeroContent;
  about: AboutContent;
  workExperiences: WorkExperience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  deliveryStrengths: string[];
  blogPosts: BlogPost[];
  certificates: Certificate[];
  contactChannels: ContactChannel[];
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
};
