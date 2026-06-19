import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";

const focus = [
  "React and Next.js interfaces",
  "React Native production apps",
  "Dashboards, forms, and workflows",
  "Performance and SEO-aware UI",
];

const About = () => {
  return (
    <section id="about" className="bg-white py-24 dark:bg-gray-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
            About
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-gray-950 dark:text-white md:text-6xl">
            I turn product requirements into usable interfaces.
          </h2>
        </div>

        <div>
          <p className="text-2xl leading-10 text-gray-900 dark:text-gray-100">
            I am a full-stack developer with over 1.5 years of experience
            building production web and mobile applications across enterprise
            ERP, government workflows, education platforms, admin dashboards,
            and developer tools.
          </p>
          <p className="mt-6 text-lg leading-9 text-gray-600 dark:text-gray-400">
            My strength is working close to the product surface: structuring
            messy flows, designing component systems, improving form
            experience, and keeping interfaces responsive, accessible, and easy
            to maintain.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {focus.map((item) => (
              <div
                key={item}
                className="border-t border-gray-200 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-gray-700 dark:border-gray-800 dark:text-gray-300"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center bg-gray-950 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200"
            >
              View resume
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="/resume.pdf"
              download
              className="inline-flex min-h-12 items-center justify-center border border-gray-950 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition-colors hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-950"
            >
              Download
              <Download className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
