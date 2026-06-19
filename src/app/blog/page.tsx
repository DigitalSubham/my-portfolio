import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description:
    "Technical writing by Subham Kumar on React Native, deployment, career growth, and web development.",
  alternates: {
    canonical: "/blog",
  },
};

const posts = [
  {
    title: "Resume for Freshers: Important Points to Keep in Mind",
    description:
      "Practical resume advice for freshers preparing for software development roles.",
    href: "https://digitalsubham.hashnode.dev/resume-for-freshers-important-points-to-keep-in-mind",
    source: "Hashnode",
  },
  {
    title: "Complete Guide: Setting up React Native CLI for Android on macOS",
    description:
      "A step-by-step setup guide for React Native CLI Android development on macOS.",
    href: "https://dev.to/digital_subham/complete-guide-setting-up-react-native-cli-for-android-on-macos-2025-edition-58h3",
    source: "DEV",
  },
  {
    title: "How to Update a React Native App Without Play Store",
    description:
      "A lightweight update workflow for sharing Android app updates using Google Drive and JSON.",
    href: "https://dev.to/digital_subham/how-to-update-a-react-native-app-without-play-store-using-google-drive-json-2id6",
    source: "DEV",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-16 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-gray-300 bg-white px-5 text-sm font-semibold transition-colors hover:border-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-white"
        >
          Back to portfolio
        </Link>

        <header className="mt-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Writing
          </p>
          <h1 className="text-5xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Technical notes and guides on React Native, frontend engineering,
            deployment workflows, and early-career software development.
          </p>
        </header>

        <div className="mt-10 grid gap-6">
          {posts.map((post) => (
            <article
              key={post.href}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {post.source}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {post.title}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {post.description}
              </p>
              <Link
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
              >
                Read article
                <ExternalLink className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
