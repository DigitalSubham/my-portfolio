"use client";

import { useEffect, useMemo, useState } from "react";

export type ContentsItem = {
  id: string;
  label: string;
  /** Optional marker shown on the left, e.g. a topic number or track number. */
  marker?: string;
  /** Optional value shown on the right, e.g. a topic count. */
  meta?: string;
};

/**
 * Sticky in-page contents list that highlights the section currently in view.
 *
 * Uses a throttled scroll read rather than IntersectionObserver so that the
 * active item stays correct for long sections that fill the whole viewport.
 */
export default function ContentsNav({
  label,
  items,
  offset = 120,
}: {
  label: string;
  items: ContentsItem[];
  offset?: number;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const idKey = useMemo(() => items.map((item) => item.id).join("|"), [items]);

  useEffect(() => {
    const ids = idKey.split("|").filter(Boolean);
    if (ids.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;

      if (atBottom) {
        setActive((prev) => (prev === ids[ids.length - 1] ? prev : ids[ids.length - 1]));
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) {
          current = id;
        } else {
          break;
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [idKey, offset]);

  return (
    <div className="lg:sticky lg:top-24">
      <p className="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 dark:border-gray-800 dark:text-gray-400">
        {label}
      </p>
      <nav aria-label={label}>
        <ol className="mt-1 max-h-[60vh] overflow-y-auto lg:max-h-[calc(100vh-11rem)]">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="border-b border-gray-200 dark:border-gray-800">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActive(item.id)}
                  className={`grid grid-cols-[0.125rem_1.5rem_minmax(0,1fr)_auto] items-baseline gap-x-2 py-2 pr-1 text-[13px] leading-snug transition-colors ${
                    isActive
                      ? "font-medium text-gray-950 dark:text-white"
                      : "text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-full w-0.5 rounded-full transition-colors ${
                      isActive ? "bg-gray-950 dark:bg-white" : "bg-transparent"
                    }`}
                  />
                  <span
                    className={`font-mono text-[11px] transition-colors ${
                      isActive
                        ? "text-gray-700 dark:text-gray-200"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {item.marker ?? ""}
                  </span>
                  <span>{item.label}</span>
                  {item.meta ? (
                    <span className="font-mono text-[11px] tabular-nums text-gray-400 dark:text-gray-500">
                      {item.meta}
                    </span>
                  ) : (
                    <span />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
