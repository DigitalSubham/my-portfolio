"use client";

import { Plus, X } from "lucide-react";
import { useId, useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AddRecordModal({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center justify-center gap-2 border border-gray-950 bg-gray-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        <Plus className="h-4 w-4" />
        Add record
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-gray-950/35 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  New record
                </p>
                <h2 id={titleId} className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 min-w-10 items-center justify-center border border-gray-200 text-gray-600 transition-colors hover:border-gray-950 hover:text-gray-950"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto bg-[#fbfbfa] p-5">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
