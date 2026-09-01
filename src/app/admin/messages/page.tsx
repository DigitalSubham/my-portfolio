import { Archive, Inbox, Mail, MailCheck, MailOpen, Trash2 } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import { markMessage } from "../actions";
import { getContactMessages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await getContactMessages();
  const unread = messages.filter((message) => !message.isRead && !message.isArchived).length;

  return (
    <AdminShell
      eyebrow="Inbox"
      title="Contact messages"
      description="Messages submitted from the public contact form."
      actions={
        <span className="adm-chip">
          <Inbox className="h-3.5 w-3.5" />
          {unread} unread · {messages.length} total
        </span>
      }
    >
      <div className="grid gap-4">
        {messages.length === 0 && (
          <div className="adm-card adm-empty">
            <Mail className="h-6 w-6 opacity-40" />
            <p className="font-semibold">No messages yet</p>
            <p>Submissions from the contact form will land here.</p>
          </div>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className="adm-msg"
            data-unread={!message.isRead && !message.isArchived}
            data-archived={message.isArchived}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="adm-avatar">{initials(message.name)}</span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[15px] font-semibold tracking-tight">
                      {message.subject || "Portfolio message"}
                    </h2>
                    {!message.isRead && <span className="adm-chip adm-chip-new">New</span>}
                    {message.isArchived && <span className="adm-chip">Archived</span>}
                  </div>
                  <p className="mt-1 text-[13px] text-[var(--adm-muted)]">
                    {message.name} ·{" "}
                    <a href={`mailto:${message.email}`} className="underline underline-offset-2">
                      {message.email}
                    </a>{" "}
                    · {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:shrink-0">
                <form action={markMessage.bind(null, message.id, message.isRead ? "unread" : "read")}>
                  <button className="adm-btn adm-btn-ghost">
                    {message.isRead ? <MailOpen /> : <MailCheck />}
                    Mark {message.isRead ? "unread" : "read"}
                  </button>
                </form>
                {!message.isArchived && (
                  <form action={markMessage.bind(null, message.id, "archive")}>
                    <button className="adm-btn adm-btn-ghost">
                      <Archive />
                      Archive
                    </button>
                  </form>
                )}
                <form action={markMessage.bind(null, message.id, "delete")}>
                  <button className="adm-btn adm-btn-danger">
                    <Trash2 />
                    Delete
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-wrap border-t border-[var(--adm-border)] pt-4 text-[14px] leading-7 text-[var(--adm-muted)]">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
