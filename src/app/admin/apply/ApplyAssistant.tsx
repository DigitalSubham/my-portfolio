"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Check, Copy, Download, Mail, TriangleAlert, WandSparkles } from "lucide-react";
import { SubmitButton } from "../_components/FormButtons";
import { draftApplicationAction, type DraftState } from "../actions";
import type { ApplicationDraft } from "@/lib/job-apply";

export default function ApplyAssistant() {
  const [state, formAction] = useActionState<DraftState, FormData>(draftApplicationAction, {});

  return (
    <div className="adm-apply">
      <form action={formAction} className="adm-card grid gap-4 p-6">
        <div>
          <h2 className="adm-card-title">Job posting</h2>
          <p className="adm-card-desc">Text, a screenshot, or both.</p>
        </div>
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

      {state.draft ? (
        <DraftReview key={state.at} draft={state.draft} />
      ) : (
        <div className="adm-card adm-empty">
          <Mail className="h-6 w-6 opacity-40" />
          <p className="font-semibold">No draft yet</p>
          <p>Your email draft and a fit check will show up here. Free models can take up to a minute.</p>
        </div>
      )}
    </div>
  );
}

function DraftReview({ draft }: { draft: ApplicationDraft }) {
  const [to, setTo] = useState(draft.applyEmail);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [copied, setCopied] = useState(false);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const facts = [draft.company, draft.experienceRequired, draft.location].filter(Boolean);

  async function copyEmail() {
    await navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="adm-card grid gap-4 p-6" aria-live="polite">
      <div>
        <h2 className="adm-card-title">{draft.role}</h2>
        {facts.length > 0 && <p className="adm-card-desc">{facts.join(" · ")}</p>}
      </div>

      {draft.dealbreakers.length > 0 && (
        <div className="adm-alert items-start">
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

      <label className="adm-label">
        To
        <input type="email" value={to} onChange={(e) => setTo(e.target.value)} className="adm-input" placeholder="hr@company.com" />
      </label>
      <label className="adm-label">
        Subject
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="adm-input" />
      </label>
      <label className="adm-label">
        Email
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="adm-textarea" />
      </label>

      <div className="flex flex-wrap gap-2">
        <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-primary">
          <Mail />
          Open in Gmail
        </a>
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
        Gmail can&apos;t attach files from a link: download the resume and attach it before sending. Drafted
        by {draft.model}.
      </p>
    </section>
  );
}
