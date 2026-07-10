import { ArrowUpRight, Award } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import type { Certificate } from "@/lib/portfolio-types";

type Props = {
  certificates: Certificate[];
};

const Certificates = ({ certificates }: Props) => {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="border-y border-gray-200 bg-white py-24 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Credentials"
          title="Certifications"
          description="A compact view of the credentials that support my React, cloud, and engineering fundamentals."
        />

        <div className="mx-auto max-w-5xl divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="grid gap-4 py-6 md:grid-cols-[0.12fr_1fr_auto]"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-200">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-950 dark:text-white">
                    {certificate.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {certificate.issuedAtLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {certificate.issuer}
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {certificate.description}
                </p>
              </div>
              <Link
                href={certificate.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-start text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 dark:text-white md:justify-center"
              >
                View
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
