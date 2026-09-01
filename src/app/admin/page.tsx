import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  ExternalLink,
  FileText,
  FolderKanban,
  Inbox,
  Mail,
  PenLine,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import AdminShell from "./_components/AdminShell";
import { adminSections } from "@/lib/admin-config";
import { getAdminStats } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

const sectionIcons: Record<string, LucideIcon> = {
  profile: UserRound,
  seo: Search,
  hero: Sparkles,
  about: PenLine,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Wrench,
  blogs: FileText,
  certificates: Award,
  contact: Mail,
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  const cards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Blog posts", value: stats.blogs, icon: FileText, href: "/admin/blogs" },
    { label: "Certificates", value: stats.certificates, icon: ShieldCheck, href: "/admin/certificates" },
    { label: "Unread messages", value: stats.unreadMessages, icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <AdminShell
      eyebrow="Overview"
      title="Dashboard"
      description="Manage every public portfolio section, SEO field, and contact submission from one place."
      actions={
        <Link href="/" target="_blank" className="adm-btn adm-btn-ghost">
          <ExternalLink />
          View site
        </Link>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="adm-stat transition-transform hover:-translate-y-px">
            <span className="adm-stat-icon">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <p className="adm-stat-value">{value}</p>
            <p className="adm-stat-label">{label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-sm font-bold uppercase tracking-[0.1em] text-[var(--adm-faint)]">
        Content sections
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = sectionIcons[section.slug] ?? FolderKanban;
          return (
            <Link key={section.slug} href={`/admin/${section.slug}`} className="adm-tile">
              <span className="adm-tile-icon">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold tracking-tight">{section.title}</span>
                <span className="mt-1 block text-[13px] leading-6 text-[var(--adm-muted)]">
                  {section.description}
                </span>
              </span>
              <ArrowUpRight className="adm-tile-arrow h-4 w-4" />
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
