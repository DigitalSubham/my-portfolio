import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, CalendarDays, Layers } from "lucide-react";
import { getAdjacentNotes, getNote, notes } from "@/lib/notes";
import { getPortfolioData } from "@/lib/db";
import { toPageNavItems } from "@/lib/nav";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import ContentsNav from "@/components/notes/ContentsNav";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};

  const { site, seo } = await getPortfolioData();
  const url = `${site.siteUrl}/blog/${note.slug}`;

  return {
    title: note.title,
    description: note.description,
    keywords: note.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.description,
      url,
      siteName: site.name,
      publishedTime: note.publishedAt,
      modifiedTime: note.updatedAt,
      authors: [site.name],
      tags: note.keywords,
      images: [seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description: note.description,
      images: [seo.twitterImage],
    },
  };
}

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const { site, navItems, socials } = await getPortfolioData();
  const { previous, next } = getAdjacentNotes(note.slug);
  const url = `${site.siteUrl}/blog/${note.slug}`;

  const { default: Content } = await import(`../../../content/notes/${slug}.mdx`);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: note.title,
    description: note.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: note.publishedAt,
    dateModified: note.updatedAt,
    inLanguage: "en",
    keywords: note.keywords.join(", "),
    wordCount: note.readingMinutes * 220,
    timeRequired: `PT${note.readingMinutes}M`,
    author: { "@type": "Person", name: site.name, url: site.siteUrl },
    publisher: { "@type": "Person", name: site.name, url: site.siteUrl },
    proficiencyLevel: "Beginner",
    about: note.keywords.slice(0, 4).map((name) => ({ "@type": "Thing", name })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Notes", item: `${site.siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: note.title, item: url },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: note.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
            <li className="text-gray-900 dark:text-gray-100">{note.track}</li>
          </ol>
        </nav>

        <header className="mt-10 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            {note.track} &middot; {note.topicCount} topics
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{note.heading}</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {note.excerpt}
          </p>
          <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <dt className="sr-only">Published</dt>
              <dd>
                <time dateTime={note.publishedAt}>{formatDate(note.publishedAt)}</time>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <dt className="sr-only">Reading time</dt>
              <dd>{note.readingMinutes} min read</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" aria-hidden="true" />
              <dt className="sr-only">Topics covered</dt>
              <dd>{note.topicCount} topics</dd>
            </div>
          </dl>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
          <article className="min-w-0 max-w-3xl">
            <Content />
          </article>

          <aside className="order-first lg:order-last">
            <ContentsNav
              label="On this page"
              items={note.outline.map((item, index) => ({
                id: item.id,
                label: item.label,
                marker: index < note.topicCount ? String(index + 1).padStart(2, "0") : "—",
              }))}
            />
          </aside>
        </div>

        <section
          aria-labelledby="faq-heading"
          className="mt-20 max-w-3xl border-t border-gray-200 pt-10 dark:border-gray-800"
        >
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Common questions
          </h2>
          <dl className="mt-6 divide-y divide-gray-200 dark:divide-gray-800">
            {note.faqs.map((faq) => (
              <div key={faq.question} className="py-5">
                <dt className="text-[17px] font-semibold">{faq.question}</dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <nav
          aria-label="More notes"
          className="mt-16 grid gap-4 border-t border-gray-200 pt-10 sm:grid-cols-2 dark:border-gray-800"
        >
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-950 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-white"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Previous
              </span>
              <span className="mt-2 block font-semibold">{previous.heading}</span>
            </Link>
          ) : (
            <Link
              href="/blog"
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-950 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-white"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All notes
              </span>
              <span className="mt-2 block font-semibold">Back to the notes index</span>
            </Link>
          )}

          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 text-right transition-colors hover:border-gray-950 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-white"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Next
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold">{next.heading}</span>
            </Link>
          ) : (
            <Link
              href="/blog/full-stack-interview-roadmap"
              className="rounded-2xl border border-gray-200 bg-white p-5 text-right transition-colors hover:border-gray-950 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-white"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                Next
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold">
                The full 725-topic full stack roadmap
              </span>
            </Link>
          )}
        </nav>
      </div>
      </main>
      <Footer site={site} socials={socials} />
    </div>
  );
}
