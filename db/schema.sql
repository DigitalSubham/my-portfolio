CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_profile (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  site_url TEXT NOT NULL,
  default_description TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  og_image TEXT NOT NULL,
  twitter_image TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  canonical_url TEXT NOT NULL,
  og_title TEXT NOT NULL,
  og_description TEXT NOT NULL,
  og_image TEXT NOT NULL,
  twitter_title TEXT NOT NULL,
  twitter_description TEXT NOT NULL,
  twitter_image TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hero (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  primary_href TEXT NOT NULL,
  secondary_label TEXT NOT NULL,
  secondary_href TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  intro TEXT NOT NULL,
  body TEXT NOT NULL,
  focus_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  resume_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nav_items (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_links (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_experiences (
  id BIGSERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  period TEXT NOT NULL,
  location TEXT NOT NULL,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_projects (
  id BIGSERIAL PRIMARY KEY,
  work_experience_id BIGINT NOT NULL REFERENCES work_experiences(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
  impact TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  impact TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  video_url TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  demo_url TEXT NOT NULL,
  code_url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_groups (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id BIGSERIAL PRIMARY KEY,
  skill_group_id BIGINT NOT NULL REFERENCES skill_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS delivery_strengths (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at_label TEXT NOT NULL,
  source TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  url TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issued_at_label TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_channels (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  href TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS nav_items_publish_order_idx ON nav_items (is_published, sort_order);
CREATE INDEX IF NOT EXISTS social_links_publish_order_idx ON social_links (is_published, sort_order);
CREATE INDEX IF NOT EXISTS work_experiences_publish_order_idx ON work_experiences (is_published, sort_order);
CREATE INDEX IF NOT EXISTS projects_publish_order_idx ON projects (is_published, sort_order);
CREATE INDEX IF NOT EXISTS skill_groups_publish_order_idx ON skill_groups (is_published, sort_order);
CREATE INDEX IF NOT EXISTS blog_posts_publish_order_idx ON blog_posts (is_published, sort_order);
CREATE INDEX IF NOT EXISTS certificates_publish_order_idx ON certificates (is_published, sort_order);
CREATE INDEX IF NOT EXISTS contact_messages_created_idx ON contact_messages (created_at DESC);
