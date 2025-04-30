import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

const Notes = () => {
  return (
    <section id="notes" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Notes</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Quick thoughts and useful snippets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Note 1 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">
                  Setting Up ESLint with TypeScript
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {`Apr 10, 2023`}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A quick guide on configuring ESLint with TypeScript for optimal
              code quality and consistency in your projects.
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  TypeScript
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Tools
                </span>
              </div>
            </div>
          </div>

          {/* Note 2 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">React Performance Tips</h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Mar 22, 2023
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {`Essential techniques for optimizing React applications, including
              memoization, code splitting, and efficient state management.`}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  React
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Performance
                </span>
              </div>
            </div>
          </div>

          {/* Note 3 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">CSS Grid vs Flexbox</h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Feb 15, 2023
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {`A comparison of CSS Grid and Flexbox, with practical examples of
              when to use each for optimal layout design.`}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  CSS
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Layout
                </span>
              </div>
            </div>
          </div>

          {/* Note 4 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">Next.js API Routes</h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Jan 30, 2023
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              How to effectively use Next.js API routes to create serverless
              functions and build a full-stack application.
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Next.js
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  API
                </span>
              </div>
            </div>
          </div>

          {/* Note 5 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">
                  Git Workflow Best Practices
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Jan 15, 2023
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {`A guide to establishing an efficient Git workflow for team
              collaboration, including branching strategies and commit
              conventions.`}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Git
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Workflow
                </span>
              </div>
            </div>
          </div>

          {/* Note 6 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border-t-4 border-purple-600">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold">
                  MongoDB Aggregation Pipeline
                </h3>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Dec 10, 2022
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {`Understanding MongoDB's powerful aggregation framework for complex
              data processing and analysis.`}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
              >
                Read More
              </Link>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  MongoDB
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                  Database
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/notes"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 rounded-lg transition-colors"
          >
            View All Notes
            <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Notes;
