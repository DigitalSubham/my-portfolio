import Link from "next/link";
import { ArrowRight, BookOpenCheck, Smartphone } from "lucide-react";
import SectionHeading from "@/components/portfolio/SectionHeading";

const DsaPractice = () => {
  return (
    <section id="dsa-practice" className="bg-[#f7f7f5] py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Practice"
          title="DSA question bank for daily revision"
          description="A focused practice page you can open from the portfolio on mobile, tablet, or desktop whenever you want to revise."
          align="left"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
              Question Bank
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
              TRE DSA Practice
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              Open the complete practice interface directly from your portfolio. Your browser can
              keep local progress on the same device, and the page remains available as long as the
              portfolio is online.
            </p>
            <Link
              href="/dsa-practice.html"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
            >
              Open DSA practice
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <aside className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
              <Smartphone className="h-4 w-4" aria-hidden="true" />
              Use anywhere
            </p>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <li>Deploy the portfolio, then open <span className="font-semibold text-gray-900 dark:text-gray-100">/dsa-practice.html</span>.</li>
              <li>Add that page to your phone home screen for faster access.</li>
              <li>Use the navbar link whenever you visit the portfolio.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default DsaPractice;
