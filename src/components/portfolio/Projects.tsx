import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string | null;
  tags: string[];
  demoLink: string;
  codeLink: string;
  icon: "qr" | "milk" | "briefcase" | "globe" | "code";
  impact: string;
}

const Projects = () => {
  const projects: Project[] = [
    {
      id: 0,
      title: "QR Coin - Reward & Redemption App",
      description:
        "Mobile reward platform with secure QR code generation and coin-based redemption.",
      image: "/projects/qr-coin.svg",
      video: null,
      tags: ["React Native", "Expo", "Express.js", "JWT", "RBAC"],
      demoLink: "https://github.com/DigitalSubham/tng-hardware",
      codeLink: "https://github.com/DigitalSubham/tng-hardware",
      icon: "qr",
      impact: "Designed around secure scanning, redemption flow clarity, and operator-friendly mobile screens.",
    },
    {
      id: 1,
      title: "Sita Dairy - Dairy Management System",
      description:
        "End-to-end dairy management app for milk collection, customers, billing, and daily reports.",
      image: "/projects/sita-dairy.svg",
      video: null,
      tags: ["React Native", "Expo", "Billing", "Reports"],
      demoLink:
        "https://play.google.com/store/apps/details?id=com.digitalsubham.sita_dairy&hl=en",
      codeLink: "https://github.com/DigitalSubham/sita-dairy-app",
      icon: "milk",
      impact: "Turns everyday dairy operations into a structured mobile workflow for faster record keeping.",
    },
    {
      id: 2,
      title: "Invoice Generator - Billing & Stock Platform",
      description:
        "Multi-user invoice management platform with customer, stock, GST billing, and analytics.",
      image: "/projects/invoice-generator.svg",
      video: null,
      tags: ["React Native", "Express.js", "Postgres", "Analytics"],
      demoLink: "https://github.com/DigitalSubham/bill-book",
      codeLink: "https://github.com/DigitalSubham/bill-book",
      icon: "briefcase",
      impact: "Brings invoice creation, stock updates, and GST-ready views into one operational surface.",
    },
    {
      id: 3,
      title: "Domain Age Checker Extension",
      description:
        "Chrome extension to check the age of a domain directly from the browser.",
      image: "/projects/domainage.png",
      video:
        "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/domain.webm?_a=DATC1RAAZAA0",
      tags: ["JavaScript", "Chrome Extension", "Web Tools"],
      demoLink:
        "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      codeLink:
        "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
      icon: "globe",
      impact: "A focused browser utility with one job: make domain research quicker.",
    },
    {
      id: 4,
      title: "CodeSync",
      description:
        "A real-time collaborative code editor with multi-user support.",
      image: "/projects/CodeSync.png",
      video:
        "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/codesync.webm?_a=DATC1RAAZAA0",
      tags: ["React", "Socket.IO", "Node.js"],
      demoLink: "https://code-sync-real-time-code-editor.vercel.app/",
      codeLink:
        "https://github.com/DigitalSubham/CodeSync-real-time-code-editor",
      icon: "code",
      impact: "Explores collaborative editing, real-time presence, and synchronized code sessions.",
    },
    {
      id: 5,
      title: "iSkills",
      description:
        "An ed-tech platform for skill development and course discovery.",
      image: "/projects/iskills.png",
      video: null,
      tags: ["React", "Firebase", "Tailwind"],
      demoLink: "https://i-skills.vercel.app/",
      codeLink: "https://github.com/DigitalSubham/iSkills",
      icon: "briefcase",
      impact: "A clean course discovery experience focused on learning paths and skill exploration.",
    },
  ];

  return (
    <section id="projects" className="bg-[#f7f7f5] py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 border-b border-gray-200 pb-10 dark:border-gray-800 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title="Selected projects"
            description="Mobile apps, workflow tools, browser utilities, and real-time web apps. Each project focuses on a practical user problem."
            align="left"
          />
          <Link
            href="https://github.com/DigitalSubham?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center border border-gray-950 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition-colors hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-950"
          >
            All repositories
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
