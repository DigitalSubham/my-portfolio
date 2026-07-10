import Link from "next/link";
import { BarChart3, FileText, Inbox, ShieldCheck } from "lucide-react";
import AdminShell from "./_components/AdminShell";
import { adminSections } from "@/lib/admin-config";
import { getAdminStats } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();
  const cards = [
    { label: "Projects", value: stats.projects, icon: BarChart3 },
    { label: "Blog posts", value: stats.blogs, icon: FileText },
    { label: "Certificates", value: stats.certificates, icon: ShieldCheck },
    { label: "Unread messages", value: stats.unreadMessages, icon: Inbox },
  ];

  return (
    <AdminShell>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Overview
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Manage every public portfolio section, SEO fields, and contact submissions from one place.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="border border-gray-200 bg-white p-5 shadow-sm"
            >
              <Icon className="h-5 w-5 text-gray-500" />
              <p className="mt-5 text-3xl font-semibold text-gray-950">
                {card.value}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-500">{card.label}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {adminSections.map((section) => (
          <Link
            key={section.slug}
            href={`/admin/${section.slug}`}
            className="border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-950"
          >
            <h2 className="text-xl font-semibold text-gray-950">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
