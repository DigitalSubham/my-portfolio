import Link from "next/link";
import { AlertCircle } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import ApplyAssistant from "./ApplyAssistant";
import { requireAdmin } from "@/lib/auth";

// Free OpenRouter models can take over a minute; the draft action runs under this page's limit.
// Vercel Hobby allows up to 300 s with fluid compute (on by default for new projects).
export const maxDuration = 180;

export default async function AdminApplyPage() {
  await requireAdmin();

  return (
    <AdminShell
      eyebrow="Jobs"
      title="Apply"
      description="Paste a job posting or drop in a screenshot. You get an email draft written from your portfolio and job profile to review before sending."
    >
      {process.env.OPENROUTER_API_KEY ? (
        <ApplyAssistant />
      ) : (
        <p className="adm-alert max-w-xl">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Add OPENROUTER_API_KEY to your environment variables to use the apply assistant.
        </p>
      )}
      <p className="mt-6 text-[13px] text-[var(--adm-muted)]">
        Drafts use your published portfolio content plus your{" "}
        <Link href="/admin/job-profile" className="font-semibold text-[var(--adm-accent-text)]">
          job profile
        </Link>
        . Keep both up to date for better emails.
      </p>
    </AdminShell>
  );
}
