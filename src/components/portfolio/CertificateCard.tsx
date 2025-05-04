import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Award } from "lucide-react";

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
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
      {/* Certificate Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={certificate.image || "/placeholder.svg"}
          alt={certificate.title}
          width={400}
          height={300}
          className="object-fill w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {certificate.date}
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{certificate.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {certificate.issuer}
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {certificate.description}
        </p>

        <Link
          target="_blank"
          href={certificate.link}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
        >
          View Certificate
          <ExternalLink className="ml-2 w-4 h-4" />
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-600/10 to-pink-600/10 rounded-tl-full -z-10"></div>
    </div>
  );
}
