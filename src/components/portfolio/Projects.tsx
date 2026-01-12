import Link from "next/link";
import { ExternalLink, Code, Briefcase, Globe, QrCode, Milk } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string | null; // Allow null here
  tags: string[];
  demoLink: string;
  codeLink: string;
  icon: React.ReactNode;
}

const Projects = () => {
  const projects = [{
    id: 0,
    title: "QR Coin – Reward & Redemption App",
    description:
      "Mobile reward platform with secure QR code generation and coin-based redemption system.",
    image: "/placeholder.svg?height=400&width=600",
    video: null,
    tags: ["React Native", "Expo", "Express.js", "JWT", "RBAC"],
    demoLink: "https://github.com/DigitalSubham/tng-hardware",
    codeLink: "https://github.com/DigitalSubham/tng-hardware",
    icon: <QrCode className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 1,
    title: "Sita Dairy – Dairy Management System",
    description:
      "End-to-end dairy management app for milk collection, customer records, billing, and daily transactions.",
    image: "/placeholder.svg?height=400&width=600",
    video: null,
    tags: ["React Native", "Expo", "Billing", "Reports"],
    demoLink: "https://play.google.com/store/apps/details?id=com.digitalsubham.sita_dairy&hl=en",
    codeLink: "https://github.com/DigitalSubham/sita-dairy-app",
    icon: <Milk className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 2,
    title: "Invoice Generator – Billing & Stock Platform",
    description:
      "Multi-user invoice management platform with customer, stock, GST billing, and real-time analytics.",
    image: "/placeholder.svg?height=400&width=600",
    video: null,
    tags: ["React Native", "Express.js", "Postgres", "Analytics"],
    demoLink: "https://github.com/DigitalSubham/bill-book",
    codeLink: "https://github.com/DigitalSubham/bill-book",
    icon: <Briefcase className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 3,
    title: "Domain Age Checker Extension",
    description:
      "Chrome extension to check the age of a domain directly from your browser.",
    image: "/projects/domainage.png",
    video:
      "https://res.cloudinary.com/donutatdq/video/upload/q_auto/f_auto/v1/portfolio/domain.webm?_a=DATC1RAAZAA0",
    tags: ["JavaScript", "Chrome Extension", "Web Tools"],
    demoLink: "#",
    codeLink:
      "https://github.com/DigitalSubham/Domain-Age-Checker-Chrome-Extension",
    icon: <Globe className="w-4 h-4 text-purple-600" />,
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
    icon: <Code className="w-4 h-4 text-purple-600" />,
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
    icon: <Briefcase className="w-4 h-4 text-purple-600" />,
  },
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check out some of my recent work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="#"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 rounded-lg transition-colors"
          >
            View All Projects
            <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
