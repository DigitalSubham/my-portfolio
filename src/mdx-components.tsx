import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Callout from "@/components/notes/Callout";
import Figure from "@/components/notes/Figure";
import Exercise from "@/components/notes/Exercise";
import { Quiz, QuizItem } from "@/components/notes/Quiz";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => (
      <h2
        {...props}
        className="mt-16 scroll-mt-24 border-t border-gray-200 pt-10 text-2xl font-semibold tracking-tight sm:text-3xl dark:border-gray-800"
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        {...props}
        className="mt-10 scroll-mt-24 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400"
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 {...props} className="mt-8 scroll-mt-24 text-base font-semibold">
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="mt-5 text-[17px] leading-[1.75] text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        {...props}
        className="mt-5 list-disc space-y-2 pl-5 text-[17px] leading-[1.7] text-gray-700 marker:text-gray-400 dark:text-gray-300"
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        {...props}
        className="mt-5 list-decimal space-y-2 pl-5 text-[17px] leading-[1.7] text-gray-700 marker:text-gray-400 dark:text-gray-300"
      >
        {children}
      </ol>
    ),
    strong: ({ children, ...props }) => (
      <strong {...props} className="font-semibold text-gray-950 dark:text-gray-50">
        {children}
      </strong>
    ),
    a: ({ href, children, ...props }) => {
      const url = String(href ?? "");
      const external = url.startsWith("http");
      if (external) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-gray-950 dark:hover:text-white"
            {...props}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={url}
          className="font-medium underline underline-offset-4 hover:text-gray-950 dark:hover:text-white"
        >
          {children}
        </Link>
      );
    },
    code: ({ children, ...props }) => {
      // Block-level code is wrapped in <pre> and already carries data attributes
      // from rehype-pretty-code, so only style the inline case here.
      if ("data-language" in props) {
        return <code {...props}>{children}</code>;
      }
      return (
        <code
          {...props}
          className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => (
      <pre
        {...props}
        className="mt-5 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 text-[13.5px] leading-relaxed dark:border-gray-800 dark:bg-gray-900"
      >
        {children}
      </pre>
    ),
    table: ({ children, ...props }) => (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table {...props} className="w-full border-collapse text-left text-[15px]">
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        {...props}
        className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400"
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        {...props}
        className="border-b border-gray-100 px-4 py-3 align-top text-gray-700 last:border-r-0 dark:border-gray-800/70 dark:text-gray-300"
      >
        {children}
      </td>
    ),
    hr: (props) => <hr {...props} className="my-12 border-gray-200 dark:border-gray-800" />,
    blockquote: ({ children, ...props }) => (
      <blockquote
        {...props}
        className="mt-6 border-l-2 border-gray-300 pl-5 text-[17px] italic leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400"
      >
        {children}
      </blockquote>
    ),
    Callout,
    Figure,
    Exercise,
    Quiz,
    QuizItem,
    ...components,
  };
}
