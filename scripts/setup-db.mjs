import { readFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

async function loadEnvFile(fileName) {
  try {
    const contents = await readFile(join(rootDir, fileName), "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^["']|["']$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Env file is optional; real environment variables still take precedence.
  }
}

await loadEnvFile(".env.local");
await loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const sql = neon(process.env.DATABASE_URL);
const siteUrl = process.env.SITE_URL || "https://subhams.site";

const json = (value) => JSON.stringify(value);
const hashPassword = (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
};

async function run() {
  const schema = await readFile(join(rootDir, "db/schema.sql"), "utf8");
  for (const statement of schema
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)) {
    await sql.query(statement);
  }

  await seedSingletons();
  await seedCollections();
  await seedAdmin();

  console.log("Database setup complete.");
}

async function seedSingletons() {
  await sql`
    INSERT INTO site_profile (
      id, name, initials, title, email, site_url, default_description,
      keywords, og_image, twitter_image, resume_url
    ) VALUES (
      1,
      'Subham Kumar',
      'SK',
      'Full Stack Developer',
      'shubhamkr354@gmail.com',
      ${siteUrl},
      'Portfolio of Subham Kumar - Full-stack Developer passionate about building scalable web applications and delightful user experiences.',
      ${json([
        "Subham Kumar",
        "Web Developer",
        "Frontend Engineer",
        "Full Stack Developer",
        "React Developer",
        "Next.js Portfolio",
      ])}::jsonb,
      '/og-image.jpg',
      '/og-image.jpg',
      '/resume.pdf'
    )
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO seo_settings (
      id, title, description, keywords, canonical_url, og_title, og_description,
      og_image, twitter_title, twitter_description, twitter_image
    ) VALUES (
      1,
      'Subham Kumar',
      'Portfolio of Subham Kumar - Full-stack Developer passionate about building scalable web applications and delightful user experiences.',
      ${json([
        "Subham Kumar",
        "Web Developer",
        "Frontend Engineer",
        "Full Stack Developer",
        "React Developer",
        "Next.js Portfolio",
      ])}::jsonb,
      '/',
      'Subham Kumar',
      'Explore the portfolio of Subham Kumar - showcasing web apps, open source projects, and technical writing.',
      '/og-image.jpg',
      'Subham Kumar',
      'Full-stack Developer portfolio with projects in React, Next.js, and more.',
      '/og-image.jpg'
    )
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO hero (
      id, eyebrow, name, description, primary_label, primary_href,
      secondary_label, secondary_href, image_url, image_alt
    ) VALUES (
      1,
      'Full Stack Developer',
      'Subham Kumar',
      'I build modern web and mobile products with React, Next.js, React Native, and Node.js.',
      'View work',
      '#projects',
      'Contact',
      '#contact',
      '/portrait-hero-wide.png',
      'Subham Kumar professional portrait'
    )
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO about (
      id, eyebrow, title, intro, body, focus_items, resume_url
    ) VALUES (
      1,
      'About',
      'I turn product requirements into usable interfaces.',
      'I am a full-stack developer with over 1.5 years of experience building production web and mobile applications across enterprise ERP, government workflows, education platforms, admin dashboards, and developer tools.',
      'My strength is working close to the product surface: structuring messy flows, designing component systems, improving form experience, and keeping interfaces responsive, accessible, and easy to maintain.',
      ${json([
        "React and Next.js interfaces",
        "React Native production apps",
        "Dashboards, forms, and workflows",
        "Performance and SEO-aware UI",
      ])}::jsonb,
      '/resume.pdf'
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

async function seedCollections() {
  const existingProjects = await sql`SELECT COUNT(*)::int AS count FROM projects`;
  if (existingProjects[0].count > 0) return;

  for (const [index, item] of [
    ["About", "#about"],
    ["Experience", "#experience"],
    ["Projects", "#projects"],
    ["Skills", "#skills"],
    ["Writing", "#blogs"],
    ["Contact", "#contact"],
  ].entries()) {
    await sql`INSERT INTO nav_items (label, href, sort_order) VALUES (${item[0]}, ${item[1]}, ${index + 1})`;
  }

  for (const [index, item] of [
    ["GitHub", "https://github.com/DigitalSubham", "github"],
    ["LinkedIn", "https://www.linkedin.com/in/subham-kr/", "linkedin"],
    ["Email", "mailto:shubhamkr354@gmail.com", "mail"],
  ].entries()) {
    await sql`INSERT INTO social_links (label, href, icon, sort_order) VALUES (${item[0]}, ${item[1]}, ${item[2]}, ${index + 1})`;
  }

  const work1 = await sql`
    INSERT INTO work_experiences (company, position, period, location, technologies, sort_order)
    VALUES (
      'Codebucket Solutions (P) Limited',
      'SDE - 1 (Frontend / Mobile)',
      'May 2025 - Present',
      'India',
      ${json(["React.js", "React Native CLI", "React Query", "React Hook Form", "Material UI"])}::jsonb,
      1
    )
    RETURNING id
  `;
  const work2 = await sql`
    INSERT INTO work_experiences (company, position, period, location, technologies, sort_order)
    VALUES (
      'Walsis eConnect India (P) Limited',
      'Frontend Developer',
      'Nov 2023 - May 2025',
      'Bengaluru, India',
      ${json(["Next.js", "React.js", "Redux", "Tailwind CSS"])}::jsonb,
      2
    )
    RETURNING id
  `;

  for (const project of [
    [work1[0].id, "erp", "Enterprise ERP System", "Large-scale ERP frontend with 200+ business modules for enterprise operations.", "Streamlined enterprise operations with a comprehensive ERP system supporting over 200 business modules.", 1],
    [work1[0].id, "comfed", "COMFED (Sudha) Gov App", "Government React Native application used by 20,000+ DCS to manage data for 100,000+ farmers.", "Empowered 20,000+ Dairy Cooperative Societies to manage data for over 100,000 farmers through a secure mobile application.", 2],
    [work2[0].id, "sarthaks", "Sarthaks.com", "Student dashboard for 20M+ users to access lectures, notes, and study materials.", "Served a large education audience with a more intuitive interface for accessing content and tracking progress.", 1],
    [work2[0].id, "admin", "Admin Dashboard", "Comprehensive admin panel for project management and database operations.", "Gave administrators structured tools for project setup, database management, and visualization.", 2],
    [work2[0].id, "bloomtuition", "BloomTuition", "Live teaching platform for interactive online education.", "Improved platform stability and user experience for live teaching workflows.", 3],
    [work2[0].id, "quizard", "Quizard", "Interactive quiz creation and participation platform.", "Improved SEO performance and expanded the quiz experience with more engaging features.", 4],
  ]) {
    await sql`
      INSERT INTO work_projects (
        work_experience_id, slug, name, description, achievements, impact, sort_order
      ) VALUES (
        ${project[0]}, ${project[1]}, ${project[2]}, ${project[3]},
        ${json([])}::jsonb, ${project[4]}, ${project[5]}
      )
    `;
  }

  const projects = [
    ["QR Coin - Reward & Redemption App", "qr-coin-reward-redemption-app", "Mobile reward platform with secure QR code generation and coin-based redemption.", "Designed around secure scanning, redemption flow clarity, and operator-friendly mobile screens.", "/projects/qr-coin.svg", "QR Coin reward and redemption app preview", null, ["React Native", "Expo", "Express.js", "JWT", "RBAC"], "https://github.com/DigitalSubham/tng-hardware", "https://github.com/DigitalSubham/tng-hardware", "qr"],
    ["Sita Dairy - Dairy Management System", "sita-dairy-dairy-management-system", "End-to-end dairy management app for milk collection, customers, billing, and daily reports.", "Turns everyday dairy operations into a structured mobile workflow for faster record keeping.", "/projects/sita-dairy.svg", "Sita Dairy dairy management system preview", null, ["React Native", "Expo", "Billing", "Reports"], "https://play.google.com/store/apps/details?id=com.digitalsubham.sita_dairy&hl=en", "https://github.com/DigitalSubham/sita-dairy-app", "milk"],
    ["Invoice Generator - Billing & Stock Platform", "invoice-generator-billing-stock-platform", "Multi-user invoice management platform with customer, stock, GST billing, and analytics.", "Brings invoice creation, stock updates, and GST-ready views into one operational surface.", "/projects/invoice-generator.svg", "Invoice Generator billing and stock platform preview", null, ["React Native", "Express.js", "Postgres", "Analytics"], "https://github.com/DigitalSubham/bill-book", "https://github.com/DigitalSubham/bill-book", "briefcase"],
    ["Domain Age Checker Extension", "domain-age-checker-extension", "Chrome extension to check the age of a domain directly from the browser.", "A focused browser utility with one job: make domain research quicker.", "/projects/domainage.png", "Domain Age Checker browser extension preview", "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/domain.webm?_a=DATC1RAAZAA0", ["JavaScript", "Chrome Extension", "Web Tools"], "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension", "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension", "globe"],
    ["CodeSync", "codesync", "A real-time collaborative code editor with multi-user support.", "Explores collaborative editing, real-time presence, and synchronized code sessions.", "/projects/CodeSync.png", "CodeSync real-time collaborative code editor preview", "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/codesync.webm?_a=DATC1RAAZAA0", ["React", "Socket.IO", "Node.js"], "https://code-sync-real-time-code-editor.vercel.app/", "https://github.com/DigitalSubham/CodeSync-real-time-code-editor", "code"],
    ["iSkills", "iskills", "An ed-tech platform for skill development and course discovery.", "A clean course discovery experience focused on learning paths and skill exploration.", "/projects/iskills.png", "iSkills ed-tech platform preview", null, ["React", "Firebase", "Tailwind"], "https://i-skills.vercel.app/", "https://github.com/DigitalSubham/iSkills", "briefcase"],
  ];

  for (const [index, project] of projects.entries()) {
    await sql`
      INSERT INTO projects (
        title, slug, description, impact, image_url, image_alt, video_url,
        tags, demo_url, code_url, icon, sort_order
      ) VALUES (
        ${project[0]}, ${project[1]}, ${project[2]}, ${project[3]},
        ${project[4]}, ${project[5]}, ${project[6]}, ${json(project[7])}::jsonb,
        ${project[8]}, ${project[9]}, ${project[10]}, ${index + 1}
      )
    `;
  }

  const groups = [
    ["Frontend", "layers", "Interfaces, state, routing, and responsive product screens.", ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Redux", "HTML", "CSS"]],
    ["Mobile", "code", "Production React Native workflows with form-heavy UX.", ["React Native CLI", "Expo", "React Hook Form", "React Query", "Role-based flows", "Mobile UI"]],
    ["Backend", "server", "APIs, persistence, authentication, and integration logic.", ["Node.js", "Express", "MongoDB", "SQL", "Firebase", "REST APIs"]],
    ["Engineering", "wrench", "The tooling and habits that keep projects maintainable.", ["Git", "GitHub", "Docker", "AWS", "Testing", "CI/CD", "Agile"]],
  ];
  for (const [index, group] of groups.entries()) {
    const inserted = await sql`
      INSERT INTO skill_groups (title, icon, description, sort_order)
      VALUES (${group[0]}, ${group[1]}, ${group[2]}, ${index + 1})
      RETURNING id
    `;
    for (const [skillIndex, skill] of group[3].entries()) {
      await sql`INSERT INTO skills (skill_group_id, name, sort_order) VALUES (${inserted[0].id}, ${skill}, ${skillIndex + 1})`;
    }
  }

  for (const [index, label] of [
    "Accessible UI",
    "Responsive systems",
    "Performance hygiene",
    "Form ergonomics",
    "Component architecture",
    "SEO-aware React",
  ].entries()) {
    await sql`INSERT INTO delivery_strengths (label, sort_order) VALUES (${label}, ${index + 1})`;
  }

  for (const [index, post] of [
    ["Resume for Freshers: Important Points to Keep in Mind", "Career", "Mar 22, 2023", "Hashnode", "Practical resume guidance for freshers preparing for software development roles.", "https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind"],
    ["Complete Guide: Setting up React Native CLI for Android on macOS", "React Native", "Oct 30, 2025", "DEV", "A step-by-step Android setup guide for React Native CLI development on macOS.", "https://dev.to/digital_subham/complete-guide-setting-up-react-native-cli-for-android-on-macos-2025-edition-58h3"],
    ["How to Update a React Native App Without Play Store", "Deployment", "Nov 21, 2025", "DEV", "A lightweight update workflow for distributing Android app updates with JSON metadata.", "https://dev.to/digital_subham/how-to-update-a-react-native-app-without-play-store-using-google-drive-json-2id6"],
  ].entries()) {
    await sql`
      INSERT INTO blog_posts (
        title, category, published_at_label, source, excerpt, url,
        seo_title, seo_description, canonical_url, sort_order
      ) VALUES (
        ${post[0]}, ${post[1]}, ${post[2]}, ${post[3]}, ${post[4]}, ${post[5]},
        ${post[0]}, ${post[4]}, ${post[5]}, ${index + 1}
      )
    `;
  }

  for (const [index, certificate] of [
    ["AWS Cloud Practitioner", "Amazon Web Services", "2025", "Cloud basics, deployment concepts, shared responsibility, and platform best practices.", "https://aws.amazon.com/certification/certified-cloud-practitioner/"],
    ["React Certification", "NamasteDev (Akshay Saini)", "2023", "Scalable React applications using React, Redux, component patterns, and modern tooling.", "https://namastedev.com/shubhamkr354/certificates/namaste-react"],
    ["Blockchain Certification", "NPTEL", "2023", "Blockchain fundamentals, distributed ledgers, and smart contract development concepts.", "https://archive.nptel.ac.in/"],
  ].entries()) {
    await sql`
      INSERT INTO certificates (title, issuer, issued_at_label, description, url, sort_order)
      VALUES (${certificate[0]}, ${certificate[1]}, ${certificate[2]}, ${certificate[3]}, ${certificate[4]}, ${index + 1})
    `;
  }

  for (const [index, channel] of [
    ["Email", "shubhamkr354@gmail.com", "mailto:shubhamkr354@gmail.com", "mail"],
    ["LinkedIn", "linkedin.com/in/subham-kr", "https://www.linkedin.com/in/subham-kr/", "linkedin"],
    ["GitHub", "github.com/DigitalSubham", "https://github.com/DigitalSubham", "github"],
  ].entries()) {
    await sql`
      INSERT INTO contact_channels (label, value, href, icon, sort_order)
      VALUES (${channel[0]}, ${channel[1]}, ${channel[2]}, ${channel[3]}, ${index + 1})
    `;
  }
}

async function seedAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log("Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD are required.");
    return;
  }

  const { salt, hash } = hashPassword(process.env.ADMIN_PASSWORD);
  await sql`
    INSERT INTO admins (email, password_hash, password_salt)
    VALUES (${process.env.ADMIN_EMAIL.toLowerCase()}, ${hash}, ${salt})
    ON CONFLICT (email) DO NOTHING
  `;
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
