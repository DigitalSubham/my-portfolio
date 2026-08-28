import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPortfolioData } from "@/lib/db";
import { toPageNavItems } from "@/lib/nav";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ContentsNav from "@/components/notes/ContentsNav";
import {
  coreTopics,
  priorityLabels,
  syllabus,
  topicsByWeek,
  totalTopics,
  trackTopicCount,
  weeks,
} from "@/lib/syllabus";

const SLUG = "full-stack-interview-roadmap";

const TITLE = "Full Stack Interview Roadmap: 725 Topics in Six Weeks";
const DESCRIPTION =
  "A complete full stack developer interview syllabus - 725 topics across JavaScript, React, Node, databases, system design, DSA and React Native, phased over six weeks.";

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getPortfolioData();
  const url = `${site.siteUrl}/blog/${SLUG}`;

  return {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
      "full stack developer roadmap",
      "full stack interview preparation",
      "javascript interview topics list",
      "system design interview topics",
      "react interview preparation",
      "node js interview topics",
      "dsa preparation plan",
      "3 years experience interview preparation",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: site.name,
      publishedTime: "2026-08-28",
      modifiedTime: "2026-08-28",
      authors: [site.name],
      images: [seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [seo.twitterImage],
    },
  };
}

const priorityClass: Record<string, string> = {
  M: "text-rose-700 dark:text-rose-300",
  S: "text-amber-700 dark:text-amber-300",
  E: "text-gray-500 dark:text-gray-500",
};

export default async function RoadmapPage() {
  const { site, navItems, socials } = await getPortfolioData();
  const url = `${site.siteUrl}/blog/${SLUG}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: "2026-08-28",
    dateModified: "2026-08-28",
    inLanguage: "en",
    author: { "@type": "Person", name: site.name, url: site.siteUrl },
    publisher: { "@type": "Person", name: site.name, url: site.siteUrl },
    articleSection: syllabus.map((track) => track.name),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Notes", item: `${site.siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: "Full stack interview roadmap", item: url },
    ],
  };

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Full stack interview preparation tracks",
    numberOfItems: syllabus.length,
    itemListElement: syllabus.map((track, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: track.name,
      description: track.blurb,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar site={site} navItems={toPageNavItems(navItems)} />
      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 dark:text-gray-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-gray-950 dark:hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-gray-950 dark:hover:text-white">
                Notes
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 dark:text-gray-100">Roadmap</li>
          </ol>
        </nav>

        <header className="mt-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Interview preparation &middot; Six weeks
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The full stack interview roadmap
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Everything an interview loop can ask a full stack developer with around three years of
            experience, written out in full. {totalTopics} topics across {syllabus.length} tracks,
            phased over six weeks. Most carry the actual question an interviewer would ask, so you
            can test yourself rather than only read.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: totalTopics, label: "topics and questions" },
              { value: coreTopics, label: "marked core" },
              { value: syllabus.length, label: "tracks" },
              { value: 6, label: "week runway" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tracking-tight tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <section aria-labelledby="weeks-heading" className="mt-16">
          <h2
            id="weeks-heading"
            className="border-b border-gray-200 pb-3 text-2xl font-semibold tracking-tight dark:border-gray-800"
          >
            The six weeks
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeks.map((week, index) => (
              <li
                key={week.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                    {week.label}
                  </span>
                  <span className="font-mono text-xs text-gray-400 tabular-nums dark:text-gray-500">
                    {topicsByWeek(index + 1)} topics
                  </span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                  {week.focus}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_230px]">
          <div className="min-w-0">
            {syllabus.map((track) => (
              <section
                key={track.id}
                id={track.id}
                className="mb-16 scroll-mt-24 last:mb-0"
                aria-labelledby={`${track.id}-heading`}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-2 border-gray-950 pb-3 dark:border-gray-100">
                  <span className="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {track.number}
                  </span>
                  <h2
                    id={`${track.id}-heading`}
                    className="flex-1 text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {track.name}
                  </h2>
                  <span className="font-mono text-xs text-gray-400 tabular-nums dark:text-gray-500">
                    {trackTopicCount(track)} topics
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {track.blurb}
                </p>

                {track.groups.map((group) => (
                  <div key={group.name} className="mt-8">
                    <h3 className="border-b border-gray-300 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      {group.name}
                    </h3>
                    <ul className="mt-1">
                      {group.items.map((item) => (
                        <li
                          key={item.title}
                          className="grid grid-cols-1 gap-1 border-b border-gray-200 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 dark:border-gray-800"
                        >
                          <div className="min-w-0">
                            <p className="text-[15px] font-medium leading-snug">{item.title}</p>
                            {item.question ? (
                              <p className="mt-1 text-[14px] leading-snug text-gray-600 dark:text-gray-400">
                                {item.question}
                              </p>
                            ) : null}
                          </div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gray-400 tabular-nums sm:text-right dark:text-gray-500">
                            W{item.week}{" "}
                            <span className={priorityClass[item.priority]}>
                              {priorityLabels[item.priority]}
                            </span>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ))}
          </div>

          <aside className="order-first lg:order-last">
            <ContentsNav
              label="The tracks"
              items={syllabus.map((track) => ({
                id: track.id,
                label: track.name,
                marker: track.number,
                meta: String(trackTopicCount(track)),
              }))}
            />
          </aside>
        </div>

        <section className="mt-20 max-w-3xl border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How to actually work through this
          </h2>
          <dl className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
            {[
              [
                "Ratio",
                "Roughly one hour of DSA, two hours of stack depth and thirty minutes of system design per day. Do DSA every single day, even if only for thirty minutes, because it decays faster than anything else here.",
              ],
              [
                "Out loud",
                "Reading a topic is not knowing it. For every core item, explain it aloud in sixty seconds as if to an interviewer. If you stumble, you do not know it yet.",
              ],
              [
                "Start early",
                "Do not wait until week six to apply. Start at the end of week two and let the early interviews act as diagnostics. They show you what is actually weak, which no checklist can.",
              ],
              [
                "Depth over breadth",
                "If you run short on time, sacrifice the senior items and never the core ones. Being solid on sixty percent beats being shaky on everything, because interviewers dig until you break.",
              ],
            ].map(([term, description]) => (
              <div key={term} className="py-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                  {term}
                </dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-gray-700 dark:text-gray-300">
                  {description}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
            Start here
          </p>
          <p className="mt-2 text-[17px] leading-relaxed text-gray-700 dark:text-gray-300">
            The written notes work through this roadmap one group at a time, in plain English with
            diagrams and the answer to say out loud.
          </p>
          <Link
            href="/blog/javascript-language-fundamentals"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
          >
            Read note 01: JavaScript language fundamentals
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      </main>
      <Footer site={site} socials={socials} />
    </div>
  );
}
