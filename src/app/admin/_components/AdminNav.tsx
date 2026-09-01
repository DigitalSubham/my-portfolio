"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PenLine,
  Search,
  Sparkles,
  UserRound,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AdminSectionConfig } from "@/lib/admin-config";
import { logoutAction } from "../actions";

type Props = {
  sections: AdminSectionConfig[];
  unreadMessages?: number;
};

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

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  count,
  onNavigate,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  count?: number;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} data-active={active} className="adm-nav-link" onClick={onNavigate}>
      <Icon />
      <span className="truncate">{label}</span>
      {count ? <span className="adm-nav-count">{count}</span> : null}
    </Link>
  );
}

export default function AdminNav({ sections, unreadMessages = 0 }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="adm-topbar">
        <button type="button" className="adm-icon-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-[18px] w-[18px]" />
        </button>
        <div className="flex items-center gap-2">
          <span className="adm-mark">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <span className="adm-brand-name">Admin CMS</span>
        </div>
        <form action={logoutAction}>
          <button className="adm-icon-btn" aria-label="Log out">
            <LogOut className="h-[17px] w-[17px]" />
          </button>
        </form>
      </div>

      {open && <div className="adm-scrim" onClick={close} aria-hidden />}

      <aside className="adm-sidebar" data-open={open}>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="adm-brand flex-1" onClick={close}>
            <span className="adm-mark">
              <LayoutDashboard className="h-[18px] w-[18px]" />
            </span>
            <span>
              <span className="adm-brand-name block">Admin CMS</span>
              <span className="adm-brand-sub block">Portfolio content</span>
            </span>
          </Link>
          <button type="button" className="adm-icon-btn adm-sidebar-close" onClick={close} aria-label="Close menu">
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <p className="adm-nav-group">General</p>
        <NavLink
          href="/admin"
          icon={LayoutDashboard}
          label="Dashboard"
          active={pathname === "/admin"}
          onNavigate={close}
        />
        <NavLink
          href="/admin/messages"
          icon={Inbox}
          label="Messages"
          active={pathname === "/admin/messages"}
          count={unreadMessages}
          onNavigate={close}
        />

        <p className="adm-nav-group">Content</p>
        {sections.map((section) => (
          <NavLink
            key={section.slug}
            href={`/admin/${section.slug}`}
            icon={sectionIcons[section.slug] ?? FolderKanban}
            label={section.title}
            active={pathname === `/admin/${section.slug}`}
            onNavigate={close}
          />
        ))}

        <form action={logoutAction} className="mt-auto hidden pt-6 lg:block">
          <button className="adm-btn adm-btn-ghost w-full">
            <LogOut />
            Log out
          </button>
        </form>
      </aside>
    </>
  );
}
