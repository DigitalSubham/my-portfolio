import Link from "next/link";
import { AlertCircle, CheckCircle2, ExternalLink, FileUp, FileUser, Star } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import LinkPending from "../_components/LinkPending";
import { DeleteButton, SubmitButton } from "../_components/FormButtons";
import { deleteResumeAction, setDefaultResumeAction, uploadResumeAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { listResumes } from "@/lib/db";

type Props = {
  searchParams: Promise<{ error?: string; uploaded?: string; view?: string }>;
};

const errors: Record<string, string> = {
  name: "Give the resume a name, like “Backend” or “Frontend”.",
  missing: "Choose a PDF file to upload.",
  size: "The PDF must be 4 MB or smaller.",
  type: "That file is not a PDF.",
};

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminResumePage({ searchParams }: Props) {
  await requireAdmin();
  const params = await searchParams;
  const error = params.error && errors[params.error];
  const resumes = await listResumes();
  // The resume shown in the preview: the one clicked in the list, else the default.
  const current =
    resumes.find((resume) => resume.id === Number(params.view)) ?? resumes.find((resume) => resume.isDefault);

  return (
    <AdminShell
      eyebrow="Files"
      title="Resumes"
      description="Keep a resume per kind of role. The default one is what your portfolio's View and Download buttons serve; the apply assistant picks from all of them."
    >
      <div className="adm-resume">
        <section className="adm-card p-6">
          <h2 className="adm-card-title">Upload a resume</h2>
          <p className="adm-card-desc">Export the PDF from Overleaf and add it here.</p>

          {params.uploaded && (
            <p className="adm-alert adm-alert-ok mt-5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Resume uploaded.
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
              Name
              <input name="name" required className="adm-input" placeholder="Backend" />
            </label>
            <label className="adm-label">
              Best for
              <input name="bestFor" className="adm-input" placeholder="Node.js, API and backend roles" />
              <span className="adm-hint">The apply assistant reads this to pick a resume for each job.</span>
            </label>
            <label className="adm-label">
              PDF file
              <input name="resume" type="file" accept="application/pdf" required className="adm-file" />
              <span className="adm-hint">PDF only, up to 4 MB.</span>
            </label>
            <label className="adm-switch">
              <input name="makeDefault" type="checkbox" />
              Make it the default on my portfolio
            </label>
            <SubmitButton>
              <FileUp />
              Upload resume
            </SubmitButton>
          </form>
        </section>

        <div className="grid gap-5">
          <section className="adm-card overflow-hidden">
            <div className="adm-card-head">
              <div>
                <h2 className="adm-card-title">Your resumes</h2>
                <p className="adm-card-desc">{resumes.length} uploaded</p>
              </div>
            </div>
            {resumes.length === 0 ? (
              <div className="adm-empty">
                <FileUser className="h-6 w-6 opacity-40" />
                <p className="font-semibold">No resume uploaded</p>
                <p>The resume buttons on your site show “Resume not uploaded yet” until you upload one.</p>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume.id} className="adm-resume-row" data-selected={resume.id === current?.id}>
                  <Link href={`/admin/resume?view=${resume.id}`} scroll={false} className="adm-resume-pick">
                    <p className="adm-resume-name">
                      {resume.name}
                      {resume.isDefault && <span className="adm-chip adm-chip-ok">Default</span>}
                    </p>
                    {resume.bestFor && <p className="adm-card-desc">{resume.bestFor}</p>}
                    <p className="adm-hint mt-1">
                      {Math.round(resume.size / 1024)} KB · uploaded {dateTime(resume.createdAt)}
                    </p>
                    <LinkPending />
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/admin/resume/${resume.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="adm-btn adm-btn-ghost"
                    >
                      <ExternalLink />
                      Open
                    </a>
                    {!resume.isDefault && (
                      <form action={setDefaultResumeAction.bind(null, resume.id)} className="flex gap-2">
                        <SubmitButton className="adm-btn adm-btn-ghost">
                          <Star />
                          Make default
                        </SubmitButton>
                        <DeleteButton action={deleteResumeAction.bind(null, resume.id)} label={resume.name} />
                      </form>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

          {current && (
            <section className="adm-card overflow-hidden">
              <div className="adm-card-head">
                <div>
                  <h2 className="adm-card-title">{current.name}</h2>
                  <p className="adm-card-desc">
                    {current.isDefault
                      ? "Default: this is the one on your portfolio at /resume.pdf"
                      : "Not on your portfolio. Use Make default to show it there."}
                  </p>
                </div>
              </div>
              <iframe
                key={current.id}
                src={`/admin/resume/${current.id}`}
                title={`${current.name} resume`}
                className="adm-resume-frame"
              />
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
