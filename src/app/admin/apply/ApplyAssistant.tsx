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
  Repeat,
  Send,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import { SubmitButton } from "../_components/FormButtons";
import { draftApplicationAction, sendApplicationAction, type DraftState, type SendState } from "../actions";
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
    model: "",
  };
}

type Props = { gmailReady: boolean; history: SentApplication[]; initialReuseId?: number };

export default function ApplyAssistant({ gmailReady, history, initialReuseId }: Props) {
  const [state, formAction] = useActionState<DraftState, FormData>(draftApplicationAction, {});
  const [mode, setMode] = useState<"posting" | "reuse">(initialReuseId ? "reuse" : "posting");
  const [reuseId, setReuseId] = useState(initialReuseId ?? history[0]?.id ?? 0);
  const reused = history.find((app) => app.id === reuseId);

  return (
    <div className="adm-apply">
      <div className="adm-card grid gap-4 p-6">
        <div className="adm-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === "posting"} onClick={() => setMode("posting")}>
            <WandSparkles />
            From job posting
          </button>
          <button type="button" role="tab" aria-selected={mode === "reuse"} onClick={() => setMode("reuse")}>
            <Repeat />
            Reuse a sent email
          </button>
        </div>

        {mode === "posting" ? (
          <form action={formAction} className="grid gap-4">
            <p className="adm-card-desc">
              The AI reads the posting and writes a tailored email. Best for a new kind of role.
            </p>
            <label className="adm-label">
              Posting text
              <textarea name="text" rows={10} className="adm-textarea" placeholder="Paste the post or job description" />
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
            <SubmitButton>
              <WandSparkles />
              Draft email
            </SubmitButton>
          </form>
        ) : (
          <div className="grid gap-4">
            <p className="adm-card-desc">
              Start from an email you already sent: no AI, no wait. Then change the address and company.
            </p>
            {history.length === 0 ? (
              <p className="adm-hint">Nothing sent yet. Send one from a job posting first.</p>
            ) : (
              <label className="adm-label">
                Sent email
                <select value={reuseId} onChange={(e) => setReuseId(Number(e.target.value))} className="adm-select">
                  {history.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.role}
                      {app.company ? ` · ${app.company}` : ""} · {shortDate(app.sentAt)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}
      </div>

      {mode === "posting" && state.draft ? (
        <DraftReview
          key={state.at}
          draft={state.draft}
          history={history}
          gmailReady={gmailReady}
          source={`Drafted by ${state.draft.model}.`}
        />
      ) : mode === "reuse" && reused ? (
        <DraftReview
          key={`reuse-${reused.id}`}
          draft={reuseDraft(reused)}
          history={history}
          gmailReady={gmailReady}
          source={`Reused from your email to ${reused.toEmail} on ${shortDate(reused.sentAt)}.`}
        />
      ) : (
        <div className="adm-card adm-empty">
          <Mail className="h-6 w-6 opacity-40" />
          <p className="font-semibold">No draft yet</p>
          <p>
            {mode === "posting"
              ? "Your email draft and a fit check will show up here. Free models can take a minute or two."
              : "Pick a sent email to reuse it."}
          </p>
        </div>
      )}
    </div>
  );
}

function DraftReview({
  draft,
  history,
  gmailReady,
  source,
}: {
  draft: ApplicationDraft;
  history: SentApplication[];
  gmailReady: boolean;
  source: string;
}) {
  const [sendState, sendAction] = useActionState<SendState, FormData>(sendApplicationAction, {});
  const [to, setTo] = useState(draft.applyEmail);
  const [company, setCompany] = useState(draft.company);
  // The company name currently written into the subject and body.
  const [companyInText, setCompanyInText] = useState(draft.company);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [copied, setCopied] = useState(false);

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
    <form action={sendAction} className="adm-card grid gap-4 p-6" aria-live="polite">
      <input type="hidden" name="role" value={draft.role} />

      <div>
        <h2 className="adm-card-title">{draft.role}</h2>
        {facts.length > 0 && <p className="adm-card-desc">{facts.join(" · ")}</p>}
      </div>

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

      <div className="adm-form-grid">
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
          <span className="adm-hint">Changing it updates the subject and email too.</span>
        </label>
      </div>
      <div className="grid gap-4">
        <label className="adm-label">
          Subject
          <input name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} className="adm-input" />
        </label>
        <label className="adm-label">
          Email
          <textarea name="body" required value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="adm-textarea" />
        </label>
      </div>

      {sendState.error && (
        <p className="adm-alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {sendState.error}
        </p>
      )}

      {sameAddressAgain && (
        <p className="adm-hint">Change the To address to send this to another company.</p>
      )}

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
        <a href="/resume.pdf" download="Subham-Kumar-Resume.pdf" className="adm-btn adm-btn-ghost">
          <Download />
          Resume
        </a>
      </div>
      <p className="adm-hint">
        {gmailReady
          ? "Send goes from your Gmail with your current resume attached."
          : "Connect Gmail (GMAIL_USER and GMAIL_APP_PASSWORD) to send from here. Until then, attach the resume in Gmail yourself."}{" "}
        {source}
      </p>
    </form>
  );
}
