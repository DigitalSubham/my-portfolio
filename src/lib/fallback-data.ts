import type { PortfolioData } from "./portfolio-types";

export const fallbackPortfolioData: PortfolioData = {
  site: {
    name: "Subham Kumar",
    initials: "SK",
    title: "Full Stack Developer",
    email: "shubhamkr354@gmail.com",
    siteUrl: process.env.SITE_URL || "https://subhams.site",
    defaultDescription:
      "Portfolio of Subham Kumar - Full-stack Developer passionate about building scalable web applications and delightful user experiences.",
    keywords: [
      "Subham Kumar",
      "Web Developer",
      "Frontend Engineer",
      "Full Stack Developer",
      "React Developer",
      "Next.js Portfolio",
    ],
    ogImage: "/og-image.jpg",
    twitterImage: "/og-image.jpg",
    resumeUrl: "/resume.pdf",
  },
  seo: {
    title: "Subham Kumar",
    description:
      "Portfolio of Subham Kumar - Full-stack Developer passionate about building scalable web applications and delightful user experiences.",
    keywords: [
      "Subham Kumar",
      "Web Developer",
      "Frontend Engineer",
      "Full Stack Developer",
      "React Developer",
      "Next.js Portfolio",
    ],
    canonicalUrl: "/",
    ogTitle: "Subham Kumar",
    ogDescription:
      "Explore the portfolio of Subham Kumar - showcasing web apps, open source projects, and technical writing.",
    ogImage: "/og-image.jpg",
    twitterTitle: "Subham Kumar",
    twitterDescription:
      "Full-stack Developer portfolio with projects in React, Next.js, and more.",
    twitterImage: "/og-image.jpg",
  },
  navItems: [
    { href: "#about", label: "About", sortOrder: 1, isPublished: true },
    { href: "#experience", label: "Experience", sortOrder: 2, isPublished: true },
    { href: "#projects", label: "Projects", sortOrder: 3, isPublished: true },
    { href: "#skills", label: "Skills", sortOrder: 4, isPublished: true },
    { href: "#blogs", label: "Writing", sortOrder: 5, isPublished: true },
    { href: "#contact", label: "Contact", sortOrder: 6, isPublished: true },
  ],
  socials: [
    {
      href: "https://github.com/DigitalSubham",
      label: "GitHub",
      icon: "github",
      sortOrder: 1,
      isPublished: true,
    },
    {
      href: "https://www.linkedin.com/in/subham-kr/",
      label: "LinkedIn",
      icon: "linkedin",
      sortOrder: 2,
      isPublished: true,
    },
    {
      href: "mailto:shubhamkr354@gmail.com",
      label: "Email",
      icon: "mail",
      sortOrder: 3,
      isPublished: true,
    },
  ],
  hero: {
    eyebrow: "Full Stack Developer",
    name: "Subham Kumar",
    description:
      "I build modern web and mobile products with React, Next.js, React Native, and Node.js.",
    primaryLabel: "View work",
    primaryHref: "#projects",
    secondaryLabel: "Contact",
    secondaryHref: "#contact",
    imageUrl: "/portrait-hero-wide.png",
    imageAlt: "Subham Kumar professional portrait",
  },
  about: {
    eyebrow: "About",
    title: "I turn product requirements into usable interfaces.",
    intro:
      "I am a full-stack developer with over 1.5 years of experience building production web and mobile applications across enterprise ERP, government workflows, education platforms, admin dashboards, and developer tools.",
    body:
      "My strength is working close to the product surface: structuring messy flows, designing component systems, improving form experience, and keeping interfaces responsive, accessible, and easy to maintain.",
    focusItems: [
      "React and Next.js interfaces",
      "React Native production apps",
      "Dashboards, forms, and workflows",
      "Performance and SEO-aware UI",
    ],
    resumeUrl: "/resume.pdf",
  },
  workExperiences: [
    {
      id: 1,
      company: "Codebucket Solutions (P) Limited",
      position: "SDE - 1 (Frontend / Mobile)",
      period: "May 2025 - Present",
      location: "India",
      technologies: [
        "React.js",
        "React Native CLI",
        "React Query",
        "React Hook Form",
        "Material UI",
      ],
      projects: [
        {
          id: "erp",
          name: "Enterprise ERP System",
          description:
            "Large-scale ERP frontend with 200+ business modules for enterprise operations.",
          achievements: [
            "Built and scaled 200+ ERP modules using React and Material UI",
            "Implemented advanced RBAC and strict session control",
            "Optimized workflows for performance and usability at scale",
          ],
          impact:
            "Streamlined enterprise operations with a comprehensive ERP system supporting over 200 business modules.",
          sortOrder: 1,
          isPublished: true,
        },
        {
          id: "comfed",
          name: "COMFED (Sudha) Gov App",
          description:
            "Government React Native application used by 20,000+ DCS to manage data for 100,000+ farmers.",
          achievements: [
            "Led frontend development of a production-grade React Native application",
            "Built DCS management, farmer onboarding, and role-based workflows",
            "Ensured secure, scalable form handling using React Hook Form",
          ],
          impact:
            "Empowered 20,000+ Dairy Cooperative Societies to manage data for over 100,000 farmers through a secure mobile application.",
          sortOrder: 2,
          isPublished: true,
        },
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      company: "Walsis eConnect India (P) Limited",
      position: "Frontend Developer",
      period: "Nov 2023 - May 2025",
      location: "Bengaluru, India",
      technologies: ["Next.js", "React.js", "Redux", "Tailwind CSS"],
      projects: [
        {
          id: "sarthaks",
          name: "Sarthaks.com",
          description:
            "Student dashboard for 20M+ users to access lectures, notes, and study materials.",
          achievements: [
            "Built responsive frontend interface for 20M+ students",
            "Developed test-taking and performance analysis features",
            "Implemented personalized progress tracking system",
          ],
          impact:
            "Served a large education audience with a more intuitive interface for accessing content and tracking progress.",
          sortOrder: 1,
          isPublished: true,
        },
        {
          id: "admin",
          name: "Admin Dashboard",
          description:
            "Comprehensive admin panel for project management and database operations.",
          achievements: [
            "Created intuitive interface for project creation and user management",
            "Implemented database connection and schema design features",
            "Built dynamic datatype customization and table views for data visualization",
          ],
          impact:
            "Gave administrators structured tools for project setup, database management, and visualization.",
          sortOrder: 2,
          isPublished: true,
        },
        {
          id: "bloomtuition",
          name: "BloomTuition",
          description: "Live teaching platform for interactive online education.",
          achievements: [
            "Resolved critical bugs improving platform stability",
            "Enhanced user experience for teachers and students",
            "Optimized performance for live teaching sessions",
          ],
          impact:
            "Improved platform stability and user experience for live teaching workflows.",
          sortOrder: 3,
          isPublished: true,
        },
        {
          id: "quizard",
          name: "Quizard",
          description: "Interactive quiz creation and participation platform.",
          achievements: [
            "Fixed SSR issues that impacted SEO performance",
            "Resolved multiple bugs in the quiz creator interface",
            "Added new question types and multiplayer support features",
          ],
          impact:
            "Improved SEO performance and expanded the quiz experience with more engaging features.",
          sortOrder: 4,
          isPublished: true,
        },
      ],
      sortOrder: 2,
      isPublished: true,
    },
  ],
  projects: [
    {
      id: 1,
      title: "QR Coin - Reward & Redemption App",
      slug: "qr-coin-reward-redemption-app",
      description:
        "Mobile reward platform with secure QR code generation and coin-based redemption.",
      imageUrl: "/projects/qr-coin.svg",
      imageAlt: "QR Coin reward and redemption app preview",
      videoUrl: null,
      tags: ["React Native", "Expo", "Express.js", "JWT", "RBAC"],
      demoUrl: "https://github.com/DigitalSubham/tng-hardware",
      codeUrl: "https://github.com/DigitalSubham/tng-hardware",
      icon: "qr",
      impact:
        "Designed around secure scanning, redemption flow clarity, and operator-friendly mobile screens.",
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: "Sita Dairy - Dairy Management System",
      slug: "sita-dairy-dairy-management-system",
      description:
        "End-to-end dairy management app for milk collection, customers, billing, and daily reports.",
      imageUrl: "/projects/sita-dairy.svg",
      imageAlt: "Sita Dairy dairy management system preview",
      videoUrl: null,
      tags: ["React Native", "Expo", "Billing", "Reports"],
      demoUrl:
        "https://play.google.com/store/apps/details?id=com.digitalsubham.sita_dairy&hl=en",
      codeUrl: "https://github.com/DigitalSubham/sita-dairy-app",
      icon: "milk",
      impact:
        "Turns everyday dairy operations into a structured mobile workflow for faster record keeping.",
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      title: "Invoice Generator - Billing & Stock Platform",
      slug: "invoice-generator-billing-stock-platform",
      description:
        "Multi-user invoice management platform with customer, stock, GST billing, and analytics.",
      imageUrl: "/projects/invoice-generator.svg",
      imageAlt: "Invoice Generator billing and stock platform preview",
      videoUrl: null,
      tags: ["React Native", "Express.js", "Postgres", "Analytics"],
      demoUrl: "https://github.com/DigitalSubham/bill-book",
      codeUrl: "https://github.com/DigitalSubham/bill-book",
      icon: "briefcase",
      impact:
        "Brings invoice creation, stock updates, and GST-ready views into one operational surface.",
      sortOrder: 3,
      isPublished: true,
    },
    {
      id: 4,
      title: "Domain Age Checker Extension",
      slug: "domain-age-checker-extension",
      description:
        "Chrome extension to check the age of a domain directly from the browser.",
      imageUrl: "/projects/domainage.png",
      imageAlt: "Domain Age Checker browser extension preview",
      videoUrl:
        "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/domain.webm?_a=DATC1RAAZAA0",
      tags: ["JavaScript", "Chrome Extension", "Web Tools"],
      demoUrl:
        "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      codeUrl:
        "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      icon: "globe",
      impact: "A focused browser utility with one job: make domain research quicker.",
      sortOrder: 4,
      isPublished: true,
    },
    {
      id: 5,
      title: "CodeSync",
      slug: "codesync",
      description: "A real-time collaborative code editor with multi-user support.",
      imageUrl: "/projects/CodeSync.png",
      imageAlt: "CodeSync real-time collaborative code editor preview",
      videoUrl:
        "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/codesync.webm?_a=DATC1RAAZAA0",
      tags: ["React", "Socket.IO", "Node.js"],
      demoUrl: "https://code-sync-real-time-code-editor.vercel.app/",
      codeUrl: "https://github.com/DigitalSubham/CodeSync-real-time-code-editor",
      icon: "code",
      impact:
        "Explores collaborative editing, real-time presence, and synchronized code sessions.",
      sortOrder: 5,
      isPublished: true,
    },
    {
      id: 6,
      title: "iSkills",
      slug: "iskills",
      description: "An ed-tech platform for skill development and course discovery.",
      imageUrl: "/projects/iskills.png",
      imageAlt: "iSkills ed-tech platform preview",
      videoUrl: null,
      tags: ["React", "Firebase", "Tailwind"],
      demoUrl: "https://i-skills.vercel.app/",
      codeUrl: "https://github.com/DigitalSubham/iSkills",
      icon: "briefcase",
      impact:
        "A clean course discovery experience focused on learning paths and skill exploration.",
      sortOrder: 6,
      isPublished: true,
    },
  ],
  skillGroups: [
    {
      id: 1,
      title: "Frontend",
      icon: "layers",
      description: "Interfaces, state, routing, and responsive product screens.",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Redux",
        "HTML",
        "CSS",
      ],
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: "Mobile",
      icon: "code",
      description: "Production React Native workflows with form-heavy UX.",
      skills: [
        "React Native CLI",
        "Expo",
        "React Hook Form",
        "React Query",
        "Role-based flows",
        "Mobile UI",
      ],
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      title: "Backend",
      icon: "server",
      description: "APIs, persistence, authentication, and integration logic.",
      skills: ["Node.js", "Express", "MongoDB", "SQL", "Firebase", "REST APIs"],
      sortOrder: 3,
      isPublished: true,
    },
    {
      id: 4,
      title: "Engineering",
      icon: "wrench",
      description: "The tooling and habits that keep projects maintainable.",
      skills: ["Git", "GitHub", "Docker", "AWS", "Testing", "CI/CD", "Agile"],
      sortOrder: 4,
      isPublished: true,
    },
  ],
  deliveryStrengths: [
    "Accessible UI",
    "Responsive systems",
    "Performance hygiene",
    "Form ergonomics",
    "Component architecture",
    "SEO-aware React",
  ],
  blogPosts: [
    {
      id: 1,
      title: "Resume for Freshers: Important Points to Keep in Mind",
      category: "Career",
      publishedAt: "Mar 22, 2023",
      source: "Hashnode",
      url: "https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind",
      excerpt:
        "Practical resume guidance for freshers preparing for software development roles.",
      seoTitle: "Resume for Freshers: Important Points to Keep in Mind",
      seoDescription:
        "Practical resume advice for freshers preparing for software development roles.",
      canonicalUrl:
        "https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind",
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: "Complete Guide: Setting up React Native CLI for Android on macOS",
      category: "React Native",
      publishedAt: "Oct 30, 2025",
      source: "DEV",
      url: "https://dev.to/digital_subham/complete-guide-setting-up-react-native-cli-for-android-on-macos-2025-edition-58h3",
      excerpt:
        "A step-by-step Android setup guide for React Native CLI development on macOS.",
      seoTitle: "Complete Guide: Setting up React Native CLI for Android on macOS",
      seoDescription:
        "A step-by-step setup guide for React Native CLI Android development on macOS.",
      canonicalUrl:
        "https://dev.to/digital_subham/complete-guide-setting-up-react-native-cli-for-android-on-macos-2025-edition-58h3",
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      title: "How to Update a React Native App Without Play Store",
      category: "Deployment",
      publishedAt: "Nov 21, 2025",
      source: "DEV",
      url: "https://dev.to/digital_subham/how-to-update-a-react-native-app-without-play-store-using-google-drive-json-2id6",
      excerpt:
        "A lightweight update workflow for distributing Android app updates with JSON metadata.",
      seoTitle: "How to Update a React Native App Without Play Store",
      seoDescription:
        "A lightweight update workflow for sharing Android app updates using Google Drive and JSON.",
      canonicalUrl:
        "https://dev.to/digital_subham/how-to-update-a-react-native-app-without-play-store-using-google-drive-json-2id6",
      sortOrder: 3,
      isPublished: true,
    },
  ],
  certificates: [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      issuedAtLabel: "2025",
      description:
        "Cloud basics, deployment concepts, shared responsibility, and platform best practices.",
      url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      title: "React Certification",
      issuer: "NamasteDev (Akshay Saini)",
      issuedAtLabel: "2023",
      description:
        "Scalable React applications using React, Redux, component patterns, and modern tooling.",
      url: "https://namastedev.com/shubhamkr354/certificates/namaste-react",
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      title: "Blockchain Certification",
      issuer: "NPTEL",
      issuedAtLabel: "2023",
      description:
        "Blockchain fundamentals, distributed ledgers, and smart contract development concepts.",
      url: "https://archive.nptel.ac.in/",
      sortOrder: 3,
      isPublished: true,
    },
  ],
  contactChannels: [
    {
      id: 1,
      label: "Email",
      value: "shubhamkr354@gmail.com",
      href: "mailto:shubhamkr354@gmail.com",
      icon: "mail",
      sortOrder: 1,
      isPublished: true,
    },
    {
      id: 2,
      label: "LinkedIn",
      value: "linkedin.com/in/subham-kr",
      href: "https://www.linkedin.com/in/subham-kr/",
      icon: "linkedin",
      sortOrder: 2,
      isPublished: true,
    },
    {
      id: 3,
      label: "GitHub",
      value: "github.com/DigitalSubham",
      href: "https://github.com/DigitalSubham",
      icon: "github",
      sortOrder: 3,
      isPublished: true,
    },
  ],
};
