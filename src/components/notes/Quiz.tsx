"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function QuizItem({
  number,
  question,
  children,
}: {
  number: number;
  question: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const answerId = `quiz-answer-${number}`;

  return (
    <li className="border-b border-gray-200 py-6 last:border-b-0 dark:border-gray-800">
      <div className="flex gap-4">
        <span className="mt-1 font-mono text-xs text-gray-400 dark:text-gray-500">
          {String(number).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-medium leading-relaxed [&_code]:rounded [&_code]:border [&_code]:border-gray-200 [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:border-gray-700 dark:[&_code]:bg-gray-800">
            {question}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={answerId}
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 text-xs font-semibold uppercase tracking-[0.1em] text-gray-600 transition-colors hover:border-gray-950 hover:text-gray-950 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-white dark:hover:text-white"
          >
            {open ? "Hide answer" : "Show answer"}
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <div
            id={answerId}
            hidden={!open}
            className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-5 text-[15px] leading-relaxed text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-950 dark:[&_strong]:text-gray-50"
          >
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}

export function Quiz({ children }: { children: ReactNode }) {
  return <ol className="mt-8 list-none space-y-0 p-0">{children}</ol>;
}
