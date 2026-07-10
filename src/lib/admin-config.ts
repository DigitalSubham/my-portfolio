export type AdminField = {
  name: string;
  label: string;
  type: "text" | "url" | "email" | "textarea" | "number" | "boolean" | "array" | "select";
  required?: boolean;
  options?: string[];
};

export type AdminTableConfig = {
  key: string;
  title: string;
  table: string;
  singleton?: boolean;
  fields: AdminField[];
};

export type AdminSectionConfig = {
  slug: string;
  title: string;
  description: string;
  tables: AdminTableConfig[];
};

export const iconOptions = [
  "award",
  "briefcase",
  "code",
  "github",
  "globe",
  "layers",
  "linkedin",
  "mail",
  "milk",
  "qr",
  "server",
  "wrench",
];

const publishFields: AdminField[] = [
  { name: "sort_order", label: "Sort order", type: "number", required: true },
  { name: "is_published", label: "Published", type: "boolean" },
];

export const adminSections: AdminSectionConfig[] = [
  {
    slug: "profile",
    title: "Profile",
    description: "Global identity, resume, and site profile values.",
    tables: [
      {
        key: "site_profile",
        title: "Site profile",
        table: "site_profile",
        singleton: true,
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "initials", label: "Initials", type: "text", required: true },
          { name: "title", label: "Professional title", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "site_url", label: "Site URL", type: "url", required: true },
          { name: "default_description", label: "Default description", type: "textarea", required: true },
          { name: "keywords", label: "Keywords", type: "array" },
          { name: "og_image", label: "Open Graph image URL/path", type: "url", required: true },
          { name: "twitter_image", label: "Twitter image URL/path", type: "url", required: true },
          { name: "resume_url", label: "Resume URL/path", type: "url", required: true },
        ],
      },
    ],
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Homepage metadata, canonical URL, and social preview fields.",
    tables: [
      {
        key: "seo_settings",
        title: "SEO settings",
        table: "seo_settings",
        singleton: true,
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "keywords", label: "Keywords", type: "array" },
          { name: "canonical_url", label: "Canonical URL/path", type: "url", required: true },
          { name: "og_title", label: "Open Graph title", type: "text", required: true },
          { name: "og_description", label: "Open Graph description", type: "textarea", required: true },
          { name: "og_image", label: "Open Graph image URL/path", type: "url", required: true },
          { name: "twitter_title", label: "Twitter title", type: "text", required: true },
          { name: "twitter_description", label: "Twitter description", type: "textarea", required: true },
          { name: "twitter_image", label: "Twitter image URL/path", type: "url", required: true },
        ],
      },
    ],
  },
  {
    slug: "hero",
    title: "Hero",
    description: "Top fold copy, calls to action, image URL, and alt text.",
    tables: [
      {
        key: "hero",
        title: "Hero content",
        table: "hero",
        singleton: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text", required: true },
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "primary_label", label: "Primary label", type: "text", required: true },
          { name: "primary_href", label: "Primary href", type: "text", required: true },
          { name: "secondary_label", label: "Secondary label", type: "text", required: true },
          { name: "secondary_href", label: "Secondary href", type: "text", required: true },
          { name: "image_url", label: "Image URL/path", type: "url", required: true },
          { name: "image_alt", label: "Image alt text", type: "text", required: true },
        ],
      },
      {
        key: "social_links",
        title: "Social links",
        table: "social_links",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "href", label: "Href", type: "text", required: true },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "about",
    title: "About",
    description: "About copy, focus items, and resume link.",
    tables: [
      {
        key: "about",
        title: "About content",
        table: "about",
        singleton: true,
        fields: [
          { name: "eyebrow", label: "Eyebrow", type: "text", required: true },
          { name: "title", label: "Title", type: "textarea", required: true },
          { name: "intro", label: "Intro", type: "textarea", required: true },
          { name: "body", label: "Body", type: "textarea", required: true },
          { name: "focus_items", label: "Focus items", type: "array" },
          { name: "resume_url", label: "Resume URL/path", type: "url", required: true },
        ],
      },
    ],
  },
  {
    slug: "experience",
    title: "Experience",
    description: "Work timeline and project highlights.",
    tables: [
      {
        key: "work_experiences",
        title: "Work experiences",
        table: "work_experiences",
        fields: [
          { name: "company", label: "Company", type: "text", required: true },
          { name: "position", label: "Position", type: "text", required: true },
          { name: "period", label: "Period", type: "text", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "technologies", label: "Technologies", type: "array" },
          ...publishFields,
        ],
      },
      {
        key: "work_projects",
        title: "Work projects",
        table: "work_projects",
        fields: [
          { name: "work_experience_id", label: "Work experience ID", type: "number", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "achievements", label: "Achievements", type: "array" },
          { name: "impact", label: "Impact", type: "textarea", required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "projects",
    title: "Projects",
    description: "Selected project cards, media URLs, tags, and links.",
    tables: [
      {
        key: "projects",
        title: "Projects",
        table: "projects",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "slug", label: "Slug", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "impact", label: "Impact", type: "textarea", required: true },
          { name: "image_url", label: "Image URL/path", type: "url", required: true },
          { name: "image_alt", label: "Image alt text", type: "text", required: true },
          { name: "video_url", label: "Video URL", type: "url" },
          { name: "tags", label: "Tags", type: "array" },
          { name: "demo_url", label: "Demo URL", type: "url", required: true },
          { name: "code_url", label: "Code URL", type: "url", required: true },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "skills",
    title: "Skills",
    description: "Skill groups, individual skills, and delivery strengths.",
    tables: [
      {
        key: "skill_groups",
        title: "Skill groups",
        table: "skill_groups",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          ...publishFields,
        ],
      },
      {
        key: "skills",
        title: "Skills",
        table: "skills",
        fields: [
          { name: "skill_group_id", label: "Skill group ID", type: "number", required: true },
          { name: "name", label: "Name", type: "text", required: true },
          ...publishFields,
        ],
      },
      {
        key: "delivery_strengths",
        title: "Delivery strengths",
        table: "delivery_strengths",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "blogs",
    title: "Blogs",
    description: "External writing links and SEO metadata.",
    tables: [
      {
        key: "blog_posts",
        title: "Blog posts",
        table: "blog_posts",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "category", label: "Category", type: "text", required: true },
          { name: "published_at_label", label: "Published date label", type: "text", required: true },
          { name: "source", label: "Source", type: "text", required: true },
          { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
          { name: "url", label: "URL", type: "url", required: true },
          { name: "seo_title", label: "SEO title", type: "text", required: true },
          { name: "seo_description", label: "SEO description", type: "textarea", required: true },
          { name: "canonical_url", label: "Canonical URL", type: "url", required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "certificates",
    title: "Certificates",
    description: "Credentials and certificate links.",
    tables: [
      {
        key: "certificates",
        title: "Certificates",
        table: "certificates",
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "issuer", label: "Issuer", type: "text", required: true },
          { name: "issued_at_label", label: "Issued date label", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "url", label: "URL", type: "url", required: true },
          ...publishFields,
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Contact channels displayed on the public contact section.",
    tables: [
      {
        key: "contact_channels",
        title: "Contact channels",
        table: "contact_channels",
        fields: [
          { name: "label", label: "Label", type: "text", required: true },
          { name: "value", label: "Displayed value", type: "text", required: true },
          { name: "href", label: "Href", type: "text", required: true },
          { name: "icon", label: "Icon", type: "select", options: iconOptions, required: true },
          ...publishFields,
        ],
      },
    ],
  },
];

export function getAdminSection(slug: string) {
  return adminSections.find((section) => section.slug === slug);
}

export function getAdminTable(key: string) {
  return adminSections.flatMap((section) => section.tables).find((table) => table.key === key);
}
