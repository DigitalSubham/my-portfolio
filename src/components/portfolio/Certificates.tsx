import Link from "next/link";
import { ExternalLink, Award } from "lucide-react";

const Certificates = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Certificate 1 */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
                2023
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">AWS Certified Developer</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Amazon Web Services
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Certified in designing, developing, and deploying cloud-based
              solutions using AWS services and best practices.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              View Certificate
              <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Certificate 2 */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
                2022
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">React Certification</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Meta (Facebook)
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Advanced certification in building scalable applications with
              React, Redux, and related technologies.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              View Certificate
              <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Certificate 3 */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-purple-600 to-pink-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
                2021
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Full Stack Web Development
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Udacity</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Comprehensive certification covering both frontend and backend
              technologies for building complete web applications.
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
            >
              View Certificate
              <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
