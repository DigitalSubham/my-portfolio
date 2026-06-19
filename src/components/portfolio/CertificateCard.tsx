import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";

interface CertificateProps {
  certificate: {
    id: number;
    title: string;
    issuer: string;
    date: string;
    description: string;
    image: string;
    link: string;
  };
}

export default function CertificateCard({ certificate }: CertificateProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/70">
      <div className="relative aspect-[4/3] overflow-hidden bg-white dark:bg-gray-950">
        <Image
          src={certificate.image}
          alt={certificate.title}
          width={600}
          height={450}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">
          {certificate.date}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-950 text-white dark:bg-white dark:text-gray-950">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
              {certificate.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {certificate.issuer}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
          {certificate.description}
        </p>

        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={certificate.link}
          className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-gray-950 dark:text-white"
        >
          View credential
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
