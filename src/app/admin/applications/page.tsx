import Link from "next/link";
import { ChevronDown, MailCheck, Repeat, Send } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import LinkPending from "../_components/LinkPending";
import { requireAdmin } from "@/lib/auth";
import { getSentApplications } from "@/lib/job-apply";

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function AdminApplicationsPage() {
  await requireAdmin();
  const applications = await getSentApplications();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = applications.filter((app) => new Date(app.sentAt).getTime() > weekAgo).length;

  return (
    <AdminShell
      eyebrow="Jobs"
      title="Applications"
      description="Every application sent from the Apply page, newest first."
      actions={
        <>
          <span className="adm-chip">
            <MailCheck className="h-3.5 w-3.5" />
            {applications.length} sent · {thisWeek} this week
          </span>
          <Link href="/admin/apply" className="adm-btn adm-btn-primary">
            <Send />
            New application
            <LinkPending />
          </Link>
        </>
      }
    >
      <section className="adm-card overflow-hidden">
        {applications.length === 0 ? (
          <div className="adm-empty">
            <MailCheck className="h-6 w-6 opacity-40" />
            <p className="font-semibold">No applications sent yet</p>
            <p>Applications you send from the Apply page will be listed here.</p>
          </div>
        ) : (
          applications.map((app, index) => (
            <details key={app.id} className="adm-record">
              <summary className="adm-record-summary">
                <span className="adm-record-id">{applications.length - index}</span>
                <span className="adm-record-title">
                  {app.role}
                  {app.company && <span className="adm-app-company"> · {app.company}</span>}
                </span>
                <span className="adm-app-meta">
                  <span className="adm-app-to">{app.toEmail}</span>
                  <span>{dateTime(app.sentAt)}</span>
                </span>
                <ChevronDown className="adm-record-chev h-4 w-4" />
              </summary>
              <div className="adm-record-body">
                <dl className="adm-app-fields">
                  <dt>To</dt>
                  <dd>{app.toEmail}</dd>
                  <dt>Subject</dt>
                  <dd>{app.subject}</dd>
                  <dt>Sent</dt>
                  <dd>{dateTime(app.sentAt)} with resume attached</dd>
                </dl>
                <p className="adm-app-body">{app.body}</p>
                <div>
                  <Link href={`/admin/apply?reuse=${app.id}`} className="adm-btn adm-btn-ghost">
                    <Repeat />
                    Reuse for another company
                    <LinkPending />
                  </Link>
                </div>
              </div>
            </details>
          ))
        )}
      </section>
    </AdminShell>
  );
}
