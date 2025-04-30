import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, Code, Briefcase } from "lucide-react";

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check out some of my recent work
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Project 1"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <Briefcase className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">E-Commerce Platform</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {`A full-featured online store with payment processing, inventory
                management, and admin dashboard.`}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  React
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Node.js
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  MongoDB
                </span>
              </div>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  Code
                </Link>
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Project 2"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Task Management App</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                A collaborative task management application with real-time
                updates and team collaboration features.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Next.js
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Firebase
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Tailwind
                </span>
              </div>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  Code
                </Link>
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Demo
                </Link>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Project 3"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Weather Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {`A weather application with location-based forecasts, historical
                data, and interactive maps.`}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  React
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  OpenWeather API
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Chart.js
                </span>
              </div>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <Github className="w-4 h-4 mr-1" />
                  Code
                </Link>
                <Link
                  href="#"
                  className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            href="#"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 rounded-lg transition-colors"
          >
            View All Projects
            <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;
