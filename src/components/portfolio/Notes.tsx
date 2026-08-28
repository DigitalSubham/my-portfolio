import Link from "next/link";
import { ArrowRight, FileText, ListChecks } from "lucide-react";
import { notes } from "@/lib/notes";
import { coreTopics, totalTopics } from "@/lib/syllabus";
import SectionHeading from "@/components/portfolio/SectionHeading";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const Notes = () => {
  return (
    <section
      id="notes"
      className="border-y border-gray-200 bg-white py-24 dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Notes"
          title="What I am learning, written down properly"
          description="Long-form notes on JavaScript, React, Node and system design. Plain English, real diagrams, and the mistakes that actually cause bugs in production."
          align="left"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6 transition-all hover:-translate-y-1 hover:shadow-lg lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              <ListChecks className="h-4 w-4" aria-hidden="true" />
              Roadmap
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">
              The full stack interview roadmap
            </h3>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              {totalTopics} topics and questions across 13 tracks, {coreTopics} of them core,
              phased over six weeks.
            </p>
            <Link
              href="/blog/full-stack-interview-roadmap"
              className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-gray-950 underline underline-offset-4 dark:text-white"
            >
              See the full list
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          {notes.slice(0, 2).map((note) => (
            <article
              key={note.slug}
              className="flex flex-col rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {note.track}
                </span>
                <time dateTime={note.publishedAt} className="font-normal normal-case tracking-normal">
                  {formatDate(note.publishedAt)}
                </time>
              </p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{note.heading}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                {note.excerpt}
              </p>
              <Link
                href={`/blog/${note.slug}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-gray-950 underline underline-offset-4 dark:text-white"
              >
                Read the note
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <Link
          href="/blog"
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
        >
          All notes
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default Notes;
