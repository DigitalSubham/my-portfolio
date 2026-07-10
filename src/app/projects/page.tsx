import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/portfolio/ProjectCard";
import { getPortfolioData } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const title = `Projects | ${data.site.name}`;
  const description =
    "All portfolio projects by Subham Kumar, including mobile apps, workflow tools, browser utilities, and real-time web applications.";

  return {
    title: "Projects",
    description,
    alternates: {
      canonical: `${data.site.siteUrl}/projects`,
    },
    openGraph: {
      title,
      description,
      url: `${data.site.siteUrl}/projects`,
      images: [data.seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [data.seo.twitterImage],
    },
  };
}

export default async function ProjectsPage() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <header className="mt-12 border-b border-gray-200 pb-10 dark:border-gray-800">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Work archive
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-gray-950 dark:text-white">
            All projects
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            A complete list of published portfolio projects, case studies,
            utilities, apps, and experiments.
          </p>
        </header>

        {data.projects.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
            No published projects yet.
          </div>
        )}
      </div>
    </main>
  );
}
