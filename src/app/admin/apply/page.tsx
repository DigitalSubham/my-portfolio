import Link from "next/link";
import AdminShell from "../_components/AdminShell";
import ApplyAssistant from "./ApplyAssistant";
import { requireAdmin } from "@/lib/auth";
import { getSentApplications, gmailConnected } from "@/lib/job-apply";

// Free OpenRouter models can take over a minute; the draft action runs under this page's limit.
// Vercel Hobby allows up to 300 s with fluid compute (on by default for new projects).
export const maxDuration = 180;

type Props = {
  searchParams: Promise<{ reuse?: string }>;
};

export default async function AdminApplyPage({ searchParams }: Props) {
  await requireAdmin();
  const [{ reuse }, history] = await Promise.all([searchParams, getSentApplications()]);

  return (
    <AdminShell
      eyebrow="Jobs"
      title="Apply"
      description="Draft from a job posting with AI, or reuse an email you already sent. Review, then send with your resume attached."
    >
      <ApplyAssistant
        gmailReady={gmailConnected()}
        history={history}
        initialReuseId={reuse ? Number(reuse) : undefined}
      />
      <p className="mt-6 text-[13px] text-[var(--adm-muted)]">
        AI drafts use your published portfolio content plus your{" "}
        <Link href="/admin/job-profile" className="font-semibold text-[var(--adm-accent-text)]">
          job profile
        </Link>
        . Keep both up to date for better emails.
      </p>
    </AdminShell>
  );
}
