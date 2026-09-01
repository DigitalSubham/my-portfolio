"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function AddRecordModal({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="adm-btn adm-btn-primary">
        <Plus />
        Add record
      </button>

      {open && (
        <div
          className="adm-modal-wrap"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => event.target === event.currentTarget && setOpen(false)}
        >
          <div className="adm-modal">
            <div className="adm-card-head shrink-0">
              <div>
                <p className="adm-eyebrow">New record</p>
                <h2 id={titleId} className="mt-1 text-lg font-semibold tracking-tight">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="adm-icon-btn"
                aria-label="Close"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="adm-modal-body">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
