import type { ReactNode } from "react";

export default function Figure({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        {children}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {caption}
      </figcaption>
    </figure>
  );
}
