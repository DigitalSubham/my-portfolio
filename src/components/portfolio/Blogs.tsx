import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import type { BlogPost } from "@/lib/portfolio-types";

type Props = {
  posts: BlogPost[];
};

const Blogs = ({ posts }: Props) => {
  if (posts.length === 0) return null;

  return (
    <section id="blogs" className="bg-[#f7f7f5] py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Writing"
            title="Notes and guides"
            description="Short, practical writing on React Native setup, deployment, resumes, and developer workflows."
            align="left"
          />
          <Link
            href="/blog"
            className="inline-flex min-h-12 shrink-0 items-center justify-center border border-gray-950 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition-colors hover:bg-gray-950 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-950"
          >
            View all
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-4 py-7 transition-colors hover:bg-white/70 dark:hover:bg-gray-900/40 md:grid-cols-[0.22fr_1fr_auto]"
            >
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>{post.publishedAt}</p>
                <p className="mt-1 font-semibold uppercase tracking-[0.14em]">
                  {post.category}
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">
                  {post.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                {post.excerpt}
                </p>
              </div>
              <Link
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-start text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 dark:text-white md:justify-center"
              >
                Read
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
