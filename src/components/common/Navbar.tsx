import Link from "next/link";
import React from "react";
import { ThemeToggle } from "../themes/theme-toggle";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 font-bold text-xl">
            <Link href="/" className="flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-green-500">{`<`}</span>{" "}
                <span>{`Subham Kumar`} </span>
                <span className="text-green-500">{`/>`}</span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center space-x-8">
            <Link
              href="#about"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="#projects"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#skills"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Skills
            </Link>
            <Link
              href="#blogs"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="#certificates"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Certificates
            </Link>
            <Link
              href="#notes"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Notes
            </Link>
            <Link
              href="#contact"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Contact
            </Link>

            <ThemeToggle />
          </nav>
          <div className="flex md:hidden">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
