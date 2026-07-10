import { Archive, MailCheck, MailOpen, Trash2 } from "lucide-react";
import AdminShell from "../_components/AdminShell";
import { markMessage } from "../actions";
import { getContactMessages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await getContactMessages();

  return (
    <AdminShell>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Inbox
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
          Contact messages
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Messages submitted from the public contact form.
        </p>
      </header>

      <div className="mt-8 grid gap-4">
        {messages.length === 0 && (
          <div className="border border-gray-200 bg-white p-6 text-sm text-gray-500">
            No messages yet.
          </div>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`border bg-white p-5 shadow-sm ${
              message.isArchived
                ? "border-gray-200 opacity-60"
                : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-950">
                    {message.subject || "Portfolio message"}
                  </h2>
                  {!message.isRead && (
                    <span className="bg-gray-950 px-2 py-1 text-xs font-semibold text-white">
                      New
                    </span>
                  )}
                  {message.isArchived && (
                    <span className="border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-500">
                      Archived
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {message.name} · {message.email} · {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={markMessage.bind(null, message.id, message.isRead ? "unread" : "read")}>
                  <button className="inline-flex min-h-10 items-center gap-2 border border-gray-200 px-3 text-sm font-semibold transition-colors hover:border-gray-950">
                    {message.isRead ? <MailOpen className="h-4 w-4" /> : <MailCheck className="h-4 w-4" />}
                    {message.isRead ? "Unread" : "Read"}
                  </button>
                </form>
                <form action={markMessage.bind(null, message.id, "archive")}>
                  <button className="inline-flex min-h-10 items-center gap-2 border border-gray-200 px-3 text-sm font-semibold transition-colors hover:border-gray-950">
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                </form>
                <form action={markMessage.bind(null, message.id, "delete")}>
                  <button className="inline-flex min-h-10 items-center gap-2 border border-red-200 px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
