"use client";

import { useState } from "react";
import WorkCard from "./WorkCard";


export default function WorkExperience() {
  const [activeProject, setActiveProject] = useState<string | null>("sarthaks");

  const workExperiences = [
    {
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
            "Large-scale ERP frontend with 200+ business modules for enterprise operations",
          achievements: [
            "Built and scaled 200+ ERP modules using React and Material UI",
            "Implemented advanced RBAC and strict session control",
            "Optimized workflows for performance and usability at scale",
          ],
          icon: "🏢",
          color: "from-slate-600 to-gray-500",
          impact: "Streamlined enterprise operations with a comprehensive ERP system supporting over 200 business modules."
        },
        {
          id: "comfed",
          name: "COMFED (Sudha) Gov App",
          description:
            "Government React Native application used by 20,000+ DCS to manage data for 100,000+ farmers",
          achievements: [
            "Led frontend development of a production-grade React Native application",
            "Built DCS management, farmer onboarding, and role-based workflows",
            "Ensured secure, scalable form handling using React Hook Form",
          ],
          icon: "🥛",
          color: "from-red-600 to-rose-500",
          impact: "Empowered 20,000+ Dairy Cooperative Societies to efficiently manage data for over 100,000 farmers through a secure and scalable mobile application."
        },
      ],
    },
    {
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
            "Student dashboard for 20M+ users to access lectures, notes, and study materials",
          achievements: [
            "Built responsive frontend interface for 20M+ students",
            "Developed test-taking and performance analysis features",
            "Implemented personalized progress tracking system",
          ],
          icon: "🎓",
          color: "from-blue-600 to-cyan-500",
          impact: " Serving 20M+ students with an intuitive interface for accessing educational content and tracking progress."
        },
        {
          id: "admin",
          name: "Admin Dashboard",
          description:
            "Comprehensive admin panel for project management and database operations",
          achievements: [
            "Created intuitive interface for project creation and user management",
            "Implemented database connection and schema design features",
            "Built dynamic datatype customization and table views for data visualization",
          ],
          icon: "⚙️",
          color: "from-purple-600 to-indigo-500",
          impact: "Empowering administrators with powerful tools for database management and visualization."
        },
        {
          id: "bloomtuition",
          name: "BloomTuition",
          description: "Live teaching platform for interactive online education",
          achievements: [
            "Resolved critical bugs improving platform stability",
            "Enhanced user experience for teachers and students",
            "Optimized performance for live teaching sessions",
          ],
          icon: "📚",
          color: "from-green-600 to-emerald-500",
          impact: "Enhanced platform stability and user experience for seamless online teaching."
        },
        {
          id: "quizard",
          name: "Quizard",
          description: "Interactive quiz creation and participation platform",
          achievements: [
            "Fixed SSR issues that impacted SEO performance",
            "Resolved multiple bugs in the quiz creator interface",
            "Added new question types and multiplayer support features",
          ],
          icon: "🧙‍♂️",
          color: "from-amber-600 to-yellow-500",
          impact: "Improved SEO performance and added new features for a more engaging quiz experience."
        },
      ],
    }];

  return (
    <div className="space-y-12">
      {workExperiences.map((work, index) => (
        <div key={index} className="space-y-6">
          <WorkCard workExperience={work} />
        </div>
      ))}
    </div>
  );
}
