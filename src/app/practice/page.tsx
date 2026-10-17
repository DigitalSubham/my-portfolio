import { ArrowRight, BookOpenCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { getPortfolioData } from "@/lib/db";
import { toPageNavItems } from "@/lib/nav";

const practiceSubjects = [
  {
    title: "OOP & Language Foundations",
    description: "Learn C, C++ and Java through familiar Python ideas. 20 lessons, 51 worked examples and all 199 supplied assignment questions.",
    href: "/practice/oops", notesHref: "/practice/oops/notes", meta: "Notes & practice",
  },
  {
    title: "DSA Practice",
    description: "TRE DSA question bank for daily revision and interview preparation.",
    href: "/practice/dsa",
    meta: "Question bank",
  },
  {
    title: "Bihar History & Indian National Movement",
    description: "880 English practice questions and 24 chapters of Hindi notes, with timelines and revision tables.",
    href: "/practice/history",
    notesHref: "/practice/history/notes",
    meta: "Notes & practice",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getPortfolioData();
  const title = `Practice | ${site.name}`;
  const description = "Practice resources and question banks by Subham Kumar.";

  return {
    title: "Practice",
    description,
    alternates: {
      canonical: `${site.siteUrl}/practice`,
    },
    openGraph: {
      title,
      description,
      url: `${site.siteUrl}/practice`,
      images: [seo.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.twitterImage],
    },
  };
}

export default async function PracticePage() {
  const { site, navItems, socials } = await getPortfolioData();

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar site={site} navItems={toPageNavItems(navItems)} />
      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
          >
            Back to portfolio
          </Link>

          <header className="mt-12 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
              Practice
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-gray-950 dark:text-white">
              Practice resources
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
              Subject-wise notes, question banks and revision.
            </p>
          </header>

          <section className="mt-12 grid gap-6 md:grid-cols-2" aria-label="Practice subjects">
            {practiceSubjects.map((subject) => (
              <article
                key={subject.href}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                  <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  {subject.meta}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  {subject.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {subject.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                {subject.notesHref && <Link href={subject.notesHref} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-300 px-5 text-sm font-semibold dark:border-gray-700">Read notes <ArrowRight className="h-4 w-4" /></Link>}
                <Link
                  href={subject.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-gray-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-gray-950"
                >
                  Practise
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer site={site} socials={socials} />
    </div>
  );
}
