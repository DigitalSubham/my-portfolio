import Link from "next/link";
import { ExternalLink, Award } from "lucide-react";
import CertificateCard from "./CertificateCard";

const Certificates = () => {
  const certificates = [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2025",
      description:
        "Certified in AWS cloud basics, including deployment and best practices.",
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
    },
    {
      id: 2,
      title: "React Certification",
      issuer: "NamasteDev (Akshay Saini)",
      date: "2023",
      description:
        "Learned to build scalable apps using React, Redux, and modern tools.",
      image: "/certificates/namastereact.webp?height=300&width=400",
      link: "https://namastedev.com/shubhamkr354/certificates/namaste-react",
    },
    {
      id: 3,
      title: "Blockchain Certification",
      issuer: "NPTEL",
      date: "2023",
      description:
        "Learned blockchain fundamentals and smart contract development.",
      image: "/certificates/blockchain_Nptel.jpeg?height=300&width=400",
      link: "#",
    },
  ];

  return (
    <section id="certificates" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Certificates & Achievements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Professional certifications and recognitions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
