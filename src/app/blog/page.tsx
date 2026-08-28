import { ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolioData } from "@/lib/db";
import { toPageNavItems } from "@/lib/nav";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { notes } from "@/lib/notes";
import { coreTopics, syllabus, totalTopics } from "@/lib/syllabus";

const TITLE = "Notes on JavaScript, React, Node and System Design";
const DESCRIPTION =
  "Written notes and guides by Subham Kumar on JavaScript, React, Node.js, databases and system design - explained in plain English with diagrams and interview answers.";

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getPortfolioData();
  const url = `${site.siteUrl}/blog`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      "javascript notes",
      "react notes",
      "node js guide",
      "full stack interview preparation",
      "web development notes",
      "system design notes",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${TITLE} | ${site.name}`,
      description: DESCRIPTION,
      url,
      siteName: site.name,
      type: "website",
      images: [seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${TITLE} | ${site.name}`,
      description: DESCRIPTION,
      images: [seo.twitterImage],
    },
  };
}

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function BlogPage() {
  const { blogPosts: posts, site, navItems, socials } = await getPortfolioData();
  const url = `${site.siteUrl}/blog`;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Notes by ${site.name}`,
    description: DESCRIPTION,
    url,
    inLanguage: "en",
    author: { "@type": "Person", name: site.name, url: site.siteUrl },
    blogPost: notes.map((note) => ({
      "@type": "BlogPosting",
      headline: note.title,
      description: note.description,
      url: `${site.siteUrl}/blog/${note.slug}`,
      datePublished: note.publishedAt,
      dateModified: note.updatedAt,
      author: { "@type": "Person", name: site.name },
    })),
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar site={site} navItems={toPageNavItems(navItems)} />
      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

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
          <h1 className="text-5xl font-semibold tracking-tight">Notes</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Long-form notes on JavaScript, React, Node.js, databases and system design. Written in
            plain English, with diagrams, the mistakes that actually cause bugs, and the answer to
            say out loud in an interview.
          </p>
        </header>

        <section aria-labelledby="notes-heading" className="mt-14">
          <h2
            id="notes-heading"
            className="border-b border-gray-200 pb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:border-gray-800 dark:text-gray-400"
          >
            Written here
          </h2>

          <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              Roadmap &middot; {syllabus.length} tracks
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              <Link href="/blog/full-stack-interview-roadmap">
                The full stack interview roadmap
              </Link>
            </h3>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {totalTopics} topics and questions that an interview loop can ask a full stack
              developer, {coreTopics} of them core, phased across six weeks.
            </p>
            <Link
              href="/blog/full-stack-interview-roadmap"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
            >
              Read the roadmap
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <div className="mt-6 grid gap-6">
            {notes.map((note) => (
              <article
                key={note.slug}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  <span>{note.track}</span>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={note.publishedAt}>{formatDate(note.publishedAt)}</time>
                  <span aria-hidden="true">&middot;</span>
                  <span>{note.readingMinutes} min read</span>
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  <Link href={`/blog/${note.slug}`}>{note.heading}</Link>
                </h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{note.excerpt}</p>
                <Link
                  href={`/blog/${note.slug}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
                >
                  Read the note
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {posts.length > 0 && (
          <section aria-labelledby="external-heading" className="mt-16">
            <h2
              id="external-heading"
              className="border-b border-gray-200 pb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500 dark:border-gray-800 dark:text-gray-400"
            >
              Published elsewhere
            </h2>

            <div className="mt-6 grid gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {post.source}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">{post.title}</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {post.seoDescription || post.excerpt}
                  </p>
                  <Link
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
                  >
                    Read on {post.source}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
      </main>
      <Footer site={site} socials={socials} />
    </div>
  );
}
