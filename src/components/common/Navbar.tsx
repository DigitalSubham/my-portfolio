"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../themes/theme-toggle";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#blogs", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/80">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-3 font-semibold tracking-tight text-gray-950 dark:text-white"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white dark:bg-white dark:text-gray-950">
              SK
            </span>
            <span>Subham Kumar</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white/70 p-1 text-sm text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center rounded-full px-4 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-gray-100 py-3 text-sm text-gray-700 dark:border-gray-800 dark:text-gray-200 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 items-center rounded-lg px-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
