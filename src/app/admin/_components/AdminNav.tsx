"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminSectionConfig } from "@/lib/admin-config";

type Props = {
  sections: AdminSectionConfig[];
};

function navClass(active: boolean) {
  return [
    "inline-flex min-h-10 shrink-0 items-center border px-3 text-sm font-semibold transition-colors",
    active
      ? "border-gray-950 bg-gray-950 text-white"
      : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-[#f7f7f5] hover:text-gray-950",
  ].join(" ");
}

export default function AdminNav({ sections }: Props) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
      <Link href="/admin" className={navClass(pathname === "/admin")}>
        Dashboard
      </Link>
      {sections.map((section) => {
        const href = `/admin/${section.slug}`;
        return (
          <Link
            key={section.slug}
            href={href}
            className={navClass(pathname === href)}
          >
            {section.title}
          </Link>
        );
      })}
      <Link
        href="/admin/messages"
        className={navClass(pathname === "/admin/messages")}
      >
        Messages
      </Link>
    </nav>
  );
}
