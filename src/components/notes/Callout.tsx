import type { ReactNode } from "react";
import { Lightbulb, AlertTriangle, MessageSquareQuote, Wrench } from "lucide-react";

type Variant = "analogy" | "careful" | "interview" | "work";

const styles: Record<
  Variant,
  { label: string; wrap: string; chip: string; icon: ReactNode }
> = {
  analogy: {
    label: "Think of it like",
    wrap: "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
    chip: "text-gray-500 dark:text-gray-400",
    icon: <Lightbulb className="h-4 w-4" aria-hidden="true" />,
  },
  careful: {
    label: "Careful",
    wrap: "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10",
    chip: "text-amber-700 dark:text-amber-300",
    icon: <AlertTriangle className="h-4 w-4" aria-hidden="true" />,
  },
  interview: {
    label: "Say this in an interview",
    wrap: "border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10",
    chip: "text-emerald-700 dark:text-emerald-300",
    icon: <MessageSquareQuote className="h-4 w-4" aria-hidden="true" />,
  },
  work: {
    label: "Where this bites you at work",
    wrap: "border-sky-300 bg-sky-50 dark:border-sky-500/40 dark:bg-sky-500/10",
    chip: "text-sky-700 dark:text-sky-300",
    icon: <Wrench className="h-4 w-4" aria-hidden="true" />,
  },
};

export default function Callout({
  variant = "analogy",
  label,
  children,
}: {
  variant?: Variant;
  label?: string;
  children: ReactNode;
}) {
  const style = styles[variant];

  return (
    <aside className={`my-7 rounded-2xl border p-5 ${style.wrap}`}>
      <p
        className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${style.chip}`}
      >
        {style.icon}
        {label ?? style.label}
      </p>
      <div className="space-y-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300 [&_strong]:font-semibold [&_strong]:text-gray-950 dark:[&_strong]:text-gray-50">
        {children}
      </div>
    </aside>
  );
}
