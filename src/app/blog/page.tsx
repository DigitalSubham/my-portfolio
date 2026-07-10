import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioData } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: "Blog",
    description:
      "Technical writing by Subham Kumar on React Native, deployment, career growth, and web development.",
    alternates: {
      canonical: `${data.site.siteUrl}/blog`,
    },
    openGraph: {
      title: `Blog | ${data.site.name}`,
      description:
        "Technical writing by Subham Kumar on React Native, deployment, career growth, and web development.",
      url: `${data.site.siteUrl}/blog`,
      images: [data.seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `Blog | ${data.site.name}`,
      description:
        "Technical writing by Subham Kumar on React Native, deployment, career growth, and web development.",
      images: [data.seo.twitterImage],
    },
  };
}

export default async function BlogPage() {
  const { blogPosts: posts } = await getPortfolioData();

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
        >
          Back to portfolio
        </Link>

        <header className="mt-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Writing
          </p>
          <h1 className="text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Technical notes and guides on React Native, frontend engineering,
            deployment workflows, and early-career software development.
          </p>
        </header>

        <div className="mt-10 grid gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {post.source}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {post.title}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {post.seoDescription || post.excerpt}
              </p>
              <Link
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
              >
                Read article
                <ExternalLink className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
