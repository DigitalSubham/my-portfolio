import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";
import type { Project } from "@/lib/portfolio-types";

type Props = {
  projects: Project[];
};

const Projects = ({ projects }: Props) => {
  if (projects.length === 0) return null;

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
            href="/projects"
            className="inline-flex min-h-12 shrink-0 items-center justify-center border border-gray-950 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition-colors hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-950"
          >
            All projects
            <ArrowUpRight className="ml-2 h-4 w-4" />
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
