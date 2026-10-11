"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  History,
  Mail,
  PenLine,
  Repeat,
  Send,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import { SubmitButton } from "../_components/FormButtons";
import { draftApplicationAction, sendApplicationAction, type DraftState, type SendState } from "../actions";
import type { ResumeMeta } from "@/lib/db";
import type { ApplicationDraft, SentApplication } from "@/lib/job-apply";

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

// A sent email loaded back into the review card, with To left empty for the next company.
function reuseDraft(app: SentApplication): ApplicationDraft {
  return {
    company: app.company,
    role: app.role,
    experienceRequired: "",
    location: "",
    applyEmail: "",
    contactName: "",
    skills: [],
    dealbreakers: [],
    fitSummary: "",
    subject: app.subject,
    body: app.body,
    resumeId: app.resumeId,
    model: "",
  };
}

// An empty card for writing the email by hand, with no AI and no earlier email.
const blankDraft: ApplicationDraft = {
  company: "",
  role: "",
  experienceRequired: "",
  location: "",
  applyEmail: "",
  contactName: "",
  skills: [],
  dealbreakers: [],
  fitSummary: "",
  subject: "",
  body: "",
  resumeId: 0,
  model: "",
};

type Props = {
  gmailReady: boolean;
  history: SentApplication[];
  resumes: ResumeMeta[];
  initialReuseId?: number;
};

type Mode = "posting" | "reuse" | "manual";

const tabs: { mode: Mode; label: string; icon: typeof WandSparkles }[] = [
  { mode: "posting", label: "AI draft", icon: WandSparkles },
  { mode: "reuse", label: "Reuse sent", icon: Repeat },
  { mode: "manual", label: "Write your own", icon: PenLine },
];

export default function ApplyAssistant({ gmailReady, history, resumes, initialReuseId }: Props) {
  const [state, formAction] = useActionState<DraftState, FormData>(draftApplicationAction, {});
  const [mode, setMode] = useState<Mode>(initialReuseId ? "reuse" : "posting");
  const [reuseId, setReuseId] = useState(initialReuseId ?? history[0]?.id ?? 0);
  const reused = history.find((app) => app.id === reuseId);
  const shared = { history, resumes, gmailReady };

  return (
    <div className="grid gap-5">
      <div className="adm-tabs adm-tabs-top" role="tablist">
        {tabs.map(({ mode: tab, label, icon: Icon }) => (
          <button key={tab} type="button" role="tab" aria-selected={mode === tab} onClick={() => setMode(tab)}>
            <Icon />
            {label}
          </button>
        ))}
      </div>

      {mode === "manual" ? (
        <div className="adm-apply-single">
          <DraftReview key="manual" draft={blankDraft} source="Written by you, no AI involved." {...shared} />
        </div>
      ) : (
        <div className="adm-apply">
          {mode === "posting" ? (
            <form action={formAction} className="adm-card adm-apply-input grid gap-4 p-6">
              <div>
                <h2 className="adm-card-title">Job posting</h2>
                <p className="adm-card-desc">The AI reads it and writes an email tailored to the role.</p>
              </div>
              <label className="adm-label">
                Posting text
                <textarea name="text" rows={9} className="adm-textarea" placeholder="Paste the post or job description" />
              </label>
              <label className="adm-label">
                Screenshot
                <input name="image" type="file" accept="image/*" className="adm-file" />
                <span className="adm-hint">Optional. PNG or JPG, up to 3 MB.</span>
              </label>
              {state.error && (
                <p className="adm-alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {state.error}
                </p>
              )}
              <SubmitButton className="adm-btn adm-btn-primary w-full">
                <WandSparkles />
                Draft email
              </SubmitButton>
            </form>
          ) : (
            <section className="adm-card adm-apply-input overflow-hidden">
              <div className="adm-card-head">
                <div>
                  <h2 className="adm-card-title">Sent emails</h2>
                  <p className="adm-card-desc">Pick one to start from. No AI, no wait.</p>
                </div>
              </div>
              {history.length === 0 ? (
                <div className="adm-empty">
                  <Repeat className="h-6 w-6 opacity-40" />
                  <p>Nothing sent yet. Send one first, then reuse it here.</p>
                </div>
              ) : (
                <div className="adm-pick-list" role="listbox" aria-label="Sent emails">
                  {history.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      role="option"
                      aria-selected={app.id === reuseId}
                      onClick={() => setReuseId(app.id)}
                      className="adm-pick"
                    >
                      <span className="adm-pick-title">
                        {app.role || "Application"}
                        {app.company && <span className="adm-app-company"> · {app.company}</span>}
                      </span>
                      <span className="adm-pick-meta">
                        {app.toEmail} · {shortDate(app.sentAt)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {mode === "posting" && state.draft ? (
            <DraftReview key={state.at} draft={state.draft} source={`Drafted by ${state.draft.model}.`} {...shared} />
          ) : mode === "reuse" && reused ? (
            <DraftReview
              key={`reuse-${reused.id}`}
              draft={reuseDraft(reused)}
              source={`Reused from your email to ${reused.toEmail} on ${shortDate(reused.sentAt)}.`}
              {...shared}
            />
          ) : (
            <div className="adm-card adm-empty adm-apply-empty">
              <Mail className="h-6 w-6 opacity-40" />
              <p className="font-semibold">No draft yet</p>
              <p>
                {mode === "posting"
                  ? "Your email and a fit check show up here. Free models can take a minute or two."
                  : "Pick a sent email to reuse it."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DraftReview({
  draft,
  history,
  resumes,
  gmailReady,
  source,
}: {
  draft: ApplicationDraft;
  history: SentApplication[];
  resumes: ResumeMeta[];
  gmailReady: boolean;
  source: string;
}) {
  const [sendState, sendAction] = useActionState<SendState, FormData>(sendApplicationAction, {});
  const [to, setTo] = useState(draft.applyEmail);
  const [role, setRole] = useState(draft.role);
  const [company, setCompany] = useState(draft.company);
  // The company name currently written into the subject and body.
  const [companyInText, setCompanyInText] = useState(draft.company);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [copied, setCopied] = useState(false);
  // Start from the AI's pick (or the one sent last time), falling back to the default resume.
  const [resumeId, setResumeId] = useState(
    (resumes.find((resume) => resume.id === draft.resumeId) ?? resumes.find((resume) => resume.isDefault))?.id ?? 0,
  );

  const sent = Boolean(sendState.sentTo);
  // Reusing the email for another company: block a resend to the address it just went to.
  const sameAddressAgain = sent && to.trim().toLowerCase() === sendState.sentTo?.toLowerCase();
  // Checked live as the address is typed, against everything sent before this page loaded.
  const earlier = history.find((app) => app.toEmail.toLowerCase() === to.trim().toLowerCase());
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const facts = [draft.company, draft.experienceRequired, draft.location].filter(Boolean);

  // Swap the company name in subject and body once the field loses focus, so typing
  // a partial name never rewrites unrelated text.
  function applyCompanyRename() {
    const next = company.trim();
    if (!next || !companyInText || next === companyInText) return;
    setSubject((text) => text.split(companyInText).join(next));
    setBody((text) => text.split(companyInText).join(next));
    setCompanyInText(next);
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <form action={sendAction} className="adm-card adm-review" aria-live="polite">
      <header className="adm-review-head">
        <h2 className="adm-card-title">{role || "New application"}</h2>
        {facts.length > 0 && <p className="adm-card-desc">{facts.join(" · ")}</p>}
      </header>

      <div className="adm-review-body">
        {sent && (
          <p className="adm-alert adm-alert-ok">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              Sent to {sendState.sentTo} with your resume attached. It is in your Gmail Sent folder.{" "}
              <Link href="/admin/applications" className="font-semibold underline">
                View all applications
              </Link>
            </span>
          </p>
        )}
        {earlier && !sameAddressAgain && (
          <p className="adm-alert">
            <History className="h-4 w-4 shrink-0" />
            You already sent {earlier.role ? `a ${earlier.role} application` : "an application"} to{" "}
            {earlier.toEmail} on {shortDate(earlier.sentAt)}.
          </p>
        )}
        {draft.dealbreakers.length > 0 && !sent && (
          <div className="adm-alert">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Check before applying</p>
              <ul className="mt-1 list-disc pl-4 font-normal">
                {draft.dealbreakers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(draft.fitSummary || draft.skills.length > 0) && (
          <div className="grid gap-2">
            {draft.fitSummary && <p className="text-[14px] leading-6">{draft.fitSummary}</p>}
            {draft.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {draft.skills.map((skill) => (
                  <span key={skill} className="adm-chip">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="adm-fields-3">
          <label className="adm-label">
            To
            <input
              name="to"
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="adm-input"
              placeholder="hr@company.com"
            />
          </label>
          <label className="adm-label">
            Company
            <input
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={applyCompanyRename}
              className="adm-input"
              placeholder="Company name"
            />
          </label>
          <label className="adm-label">
            Role
            <input
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="adm-input"
              placeholder="MERN Stack Developer"
            />
          </label>
        </div>
        {companyInText && (
          <p className="adm-hint -mt-2">Changing the company also updates it in the subject and email.</p>
        )}

        <div className="adm-fields-2">
          <label className="adm-label">
            Subject
            <input name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className="adm-input" />
          </label>
          {resumes.length > 0 && (
            <label className="adm-label">
              <span className="flex items-center justify-between gap-2">
                Resume to attach
                {draft.model && draft.resumeId === resumeId && <span className="adm-hint">AI pick</span>}
              </span>
              <select
                name="resumeId"
                value={resumeId}
                onChange={(e) => setResumeId(Number(e.target.value))}
                className="adm-select"
                title={resumes.find((resume) => resume.id === resumeId)?.bestFor}
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.name}
                    {resume.isDefault ? " (default)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <label className="adm-label">
          Email
          <textarea name="body" required value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="adm-textarea" />
        </label>

        {sendState.error && (
          <p className="adm-alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {sendState.error}
          </p>
        )}
      </div>

      <footer className="adm-review-foot">
        <div className="flex flex-wrap gap-2">
          {gmailReady ? (
            <SubmitButton disabled={sameAddressAgain}>
              <Send />
              {sent ? "Send again" : "Send with resume"}
            </SubmitButton>
          ) : (
            <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-primary">
              <Mail />
              Open in Gmail
            </a>
          )}
          <button type="button" onClick={copyEmail} className="adm-btn adm-btn-ghost">
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a href={`/admin/resume/${resumeId}`} download="Subham-Kumar-Resume.pdf" className="adm-btn adm-btn-ghost">
            <Download />
            Resume
          </a>
        </div>
        <p className="adm-hint">
          {sameAddressAgain
            ? "Change the To address to send this to another company."
            : gmailReady
              ? `Sends from your Gmail with the selected resume. ${source}`
              : `Connect Gmail (GMAIL_USER and GMAIL_APP_PASSWORD) to send from here. ${source}`}
        </p>
      </footer>
    </form>
  );
}
