"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

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
    icon: React.ReactNode;
  };
}

export default function ProjectCard({ project }: ProjectProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Optimize Cloudinary URL for better performance
  const optimizedVideoUrl = project.video?.includes("cloudinary.com")
    ? project.video
        // Add quality and format transformations if not already present
        .replace("/upload/", "/upload/q_auto,f_auto,c_fill/")
        // Add low initial quality for faster loading
        .replace("/upload/", "/upload/q_auto:low,f_auto/")
    : project.video || ""; // Fallback to empty string if video is null

  // Preload video when component mounts
  useEffect(() => {
    if (!optimizedVideoUrl) return; // If there is no valid video URL, skip loading
    const videoElement = document.createElement("video");
    videoElement.src = optimizedVideoUrl;
    videoElement.preload = "metadata";

    // Listen for enough data to start playback
    videoElement.addEventListener("loadeddata", () => {
      setVideoLoaded(true);
    });

    return () => {
      videoElement.src = "";
    };
  }, [optimizedVideoUrl]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current && videoLoaded) {
      // Use play() with catch for browsers that block autoplay
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Use Intersection Observer to pause videos when not visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-48 overflow-hidden">
        {/* Only render the video if it's a valid string */}
        {optimizedVideoUrl && (
          <video
            ref={videoRef}
            className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-300 ${
              isHovering && videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            muted
            loop
            playsInline
            src={optimizedVideoUrl}
            poster={project.image}
          />
        )}

        {/* Fallback to image if there's no video */}
        {!optimizedVideoUrl && (
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={600}
            height={400}
            className="object-contain w-full h-full"
            priority
          />
        )}

        <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md z-10">
          {project.icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          <Link
            href={project.codeLink}
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
          >
            <Github className="w-4 h-4 mr-1" />
            Code
          </Link>
          <Link
            href={project.demoLink}
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
