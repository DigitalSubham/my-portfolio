"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, Code, ExternalLink, Github, Globe, Milk, QrCode } from "lucide-react";

const iconMap = {
  qr: QrCode,
  milk: Milk,
  briefcase: Briefcase,
  globe: Globe,
  code: Code,
};

interface ProjectProps {
  project: {
    id: number;
    title: string;
    description: string;
    image: string;
    video: string | null;
    tags: string[];
    demoLink: string;
    codeLink: string;
    icon: keyof typeof iconMap;
    impact: string;
  };
}

export default function ProjectCard({ project }: ProjectProps) {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ProjectIcon = iconMap[project.icon];

  const videoUrl = project.video?.includes("cloudinary.com")
    ? project.video.replace("/upload/", "/upload/q_auto,f_auto/")
    : project.video || "";

  const onEnter = () => {
    setIsHovering(true);
    videoRef.current?.play().catch(() => undefined);
  };

  const onLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <article
      className="group overflow-hidden border border-gray-200 bg-white transition-colors duration-300 hover:border-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-white"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={project.image}
          alt={project.title}
          width={900}
          height={560}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          loading="lazy"
        />
        {videoUrl && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"
              }`}
            muted
            loop
            playsInline
            src={videoUrl}
          />
        )}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-800 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">
          <ProjectIcon className="h-4 w-4" />
          Case study
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white">
            {project.title}
          </h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {project.description}
        </p>
        <p className="mt-4 border-l border-gray-300 pl-4 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:text-gray-300">
          {project.impact}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={project.codeLink}
            className="inline-flex min-h-11 items-center border border-gray-300 px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-950 dark:border-gray-800 dark:text-gray-200 dark:hover:border-white"
          >
            <Github className="mr-2 h-4 w-4" />
            Code
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={project.demoLink}
            className="inline-flex min-h-11 items-center bg-gray-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Demo
          </Link>
        </div>
      </div>
    </article>
  );
}
