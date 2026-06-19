import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-3 font-semibold tracking-tight text-gray-950 dark:text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-xs font-bold text-white dark:bg-white dark:text-gray-950">
            SK
          </span>
          Subham Kumar
        </Link>

        <div className="flex gap-2">
          {[
            {
              href: "https://github.com/DigitalSubham",
              label: "GitHub",
              icon: Github,
            },
            {
              href: "https://www.linkedin.com/in/subham-kr/",
              label: "LinkedIn",
              icon: Linkedin,
            },
            {
              href: "mailto:shubhamkr354@gmail.com",
              label: "Email",
              icon: Mail,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-gray-950 hover:text-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:border-white dark:hover:text-white"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Subham Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
