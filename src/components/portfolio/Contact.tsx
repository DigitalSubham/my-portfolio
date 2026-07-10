import Link from "next/link";
import { submitContactMessage } from "@/app/actions";
import { getIcon } from "@/components/common/Icon";
import type { ContactChannel } from "@/lib/portfolio-types";
import SectionHeading from "./SectionHeading";

const fieldClass =
  "min-h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-white";

type Props = {
  channels: ContactChannel[];
};

const Contact = ({ channels }: Props) => {
  return (
    <section id="contact" className="bg-[#f7f7f5] py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Have a product, role, or collaboration in mind?"
          description="Send a message with a little context. I am happy to discuss frontend, mobile, portfolio, dashboard, and full-stack product work."
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="text-xl font-semibold text-gray-950 dark:text-white">
              Direct channels
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
              Prefer email for project details. LinkedIn and GitHub are best for
              quick profile checks and code references.
            </p>

            <div className="mt-6 grid gap-3">
              {channels.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex min-h-14 items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 transition-colors hover:border-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-white"
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.value}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <form
            action={submitContactMessage}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
                <input
                  type="text"
                  name="name"
                  className={fieldClass}
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
                <input
                  type="email"
                  name="email"
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
              <input
                type="text"
                name="subject"
                className={fieldClass}
                placeholder="Project, role, or collaboration"
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
              <textarea
                name="message"
                rows={5}
                className={`${fieldClass} min-h-36 py-3`}
                placeholder="Tell me what you are building and what kind of help you need."
              />
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gray-950 px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-950"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
