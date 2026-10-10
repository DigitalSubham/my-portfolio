import { AlertCircle, CheckCircle2, ExternalLink, FileUp } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import { SubmitButton } from "../_components/FormButtons";
import { uploadResumeAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { getResume } from "@/lib/db";

type Props = {
  searchParams: Promise<{ error?: string; uploaded?: string }>;
};

const errors: Record<string, string> = {
  missing: "Choose a PDF file to upload.",
  size: "The PDF must be 4 MB or smaller.",
  type: "That file is not a PDF.",
};

export default async function AdminResumePage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const error = params.error && errors[params.error];
  const resume = await getResume();

  return (
    <AdminShell
      eyebrow="Files"
      title="Resume"
      description="Upload the PDF exported from Overleaf. The site serves it at /resume.pdf right away."
      actions={
        resume && (
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
            <ExternalLink />
            View current
          </a>
        )
      }
    >
      <div className="adm-card max-w-xl p-6">
        <p className="text-[14px] text-[var(--adm-muted)]">
          {resume
            ? `Current resume: ${(resume.data.length / 1024).toFixed(0)} KB, updated ${resume.updatedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}.`
            : "No resume uploaded yet. The resume links on the site return 404 until you upload one."}
        </p>

        {params.uploaded && (
          <p className="adm-alert adm-alert-ok mt-5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Resume uploaded. It is live now.
          </p>
        )}
        {error && (
          <p className="adm-alert mt-5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <form action={uploadResumeAction} className="mt-6 grid gap-4">
          <label className="adm-label">
            PDF file
            <input name="resume" type="file" accept="application/pdf" required className="adm-input pt-2" />
          </label>
          <div>
            <SubmitButton>
              <FileUp />
              Upload resume
            </SubmitButton>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
