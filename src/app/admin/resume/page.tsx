import { AlertCircle, CheckCircle2, Download, ExternalLink, FileUp, FileUser } from "lucide-react";
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
  // Changes on every upload so the preview never shows a cached copy.
  const src = resume ? `/resume.pdf?v=${resume.updatedAt.getTime()}` : "";

  return (
    <AdminShell
      eyebrow="Files"
      title="Resume"
      description="The PDF behind the View resume and Download buttons on your site."
    >
      <div className="adm-resume">
        <section className="adm-card p-6">
          <h2 className="adm-card-title">Upload new version</h2>
          <p className="adm-card-desc">
            Export the PDF from Overleaf and upload it here. It replaces the current resume
            immediately, with no redeploy.
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

          <form action={uploadResumeAction} className="mt-5 grid gap-4">
            <label className="adm-label">
              PDF file
              <input name="resume" type="file" accept="application/pdf" required className="adm-file" />
              <span className="adm-hint">PDF only, up to 4 MB.</span>
            </label>
            <SubmitButton>
              <FileUp />
              Upload resume
            </SubmitButton>
          </form>
        </section>

        <section className="adm-card overflow-hidden">
          <div className="adm-card-head">
            <div>
              <h2 className="adm-card-title">Current resume</h2>
              <p className="adm-card-desc">
                {resume
                  ? `${Math.round(resume.data.length / 1024)} KB · updated ${resume.updatedAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}`
                  : "Nothing uploaded yet"}
              </p>
            </div>
            {resume && (
              <div className="flex gap-2">
                <a href={src} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
                  <ExternalLink />
                  Open
                </a>
                <a href={src} download="Subham-Kumar-Resume.pdf" className="adm-btn adm-btn-ghost">
                  <Download />
                  Download
                </a>
              </div>
            )}
          </div>

          {resume ? (
            <iframe src={src} title="Current resume" className="adm-resume-frame" />
          ) : (
            <div className="adm-empty">
              <FileUser className="h-6 w-6 opacity-40" />
              <p className="font-semibold">No resume uploaded</p>
              <p>The resume buttons on your site show “Resume not uploaded yet” until you upload one.</p>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
