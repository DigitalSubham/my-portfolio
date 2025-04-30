"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-all duration-300 ease-in-out opacity-0 dark:opacity-100" />
      ) : (
        <Moon className="h-5 w-5 transition-all duration-300 ease-in-out opacity-100 dark:opacity-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
