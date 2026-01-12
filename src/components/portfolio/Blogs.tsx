import { BookOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Blogs = () => {
  return (
    <section id="blogs" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Blog</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {`Thoughts, tutorials and insights`}
          </p>
        </div>

        {/* Featured Blog Post */}
        {/* <div className="mb-12">
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl duration-300 md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Featured Blog Post"
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  April 15, 2023
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Web Development
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                The Future of Web Development: Trends to Watch in 2023
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {` Explore the cutting-edge technologies and methodologies that are
                shaping the future of web development. From AI-driven interfaces
                to WebAssembly, discover what's next.`}
              </p>
              <Link
                href="/blog/future-web-development"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Read More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div> */}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="https://cdn.hashnode.com/res/hashnode/image/upload/v1703459140733/66e2b85d-0152-436c-983f-275565765579.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp"
                alt="Blog Post 1"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  March 22, 2023
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Resume
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Resume for Freshers: Important Points to Keep in Mind
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Learn how to leverage React Hooks to write {`cleaner,`} more
                efficient functional components in your React applications.
              </p>
              <Link
                target="_blank"
                href="https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Read More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Blog Post 2"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Oct 30, 2025
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Set up
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Complete Guide: Setting up React Native CLI for Android on macOS (2026 Edition)
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you’re on macOS and want to develop React Native apps using the CLI (not Expo), this guide walks you through everything.


              </p>
              <Link
                href="https://dev.to/digital_subham/complete-guide-setting-up-react-native-cli-for-android-on-macos-2025-edition-58h3"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Read More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Blog Post 3 */}
          <div className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
            <div className="relative h-48 overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Blog Post 3"
                width={600}
                height={400}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-950 rounded-full p-2 shadow-md">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Nov 21, 2025
                </span>
                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">
                  Deployment
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                How to Update a React Native App Without Play Store (Using Google Drive + JSON)
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Publishing an Android app on the Play Store takes time.
                But what if you want to share your app immediately with your users and still push updates easily?
              </p>
              <Link
                href="https://dev.to/digital_subham/how-to-update-a-react-native-app-without-play-store-using-google-drive-json-2id6"
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Read More
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 hover:border-purple-600 dark:hover:border-purple-400 rounded-lg transition-colors"
          >
            View All Posts
            <ExternalLink className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
