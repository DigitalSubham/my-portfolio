import type { ReactNode } from "react";

export default function Exercise({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="border-b border-gray-200 py-6 last:border-b-0 dark:border-gray-800">
      <div className="flex gap-4">
        <span className="mt-1 font-mono text-xs text-gray-400 dark:text-gray-500">
          {String(number).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <div className="mt-2 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}
