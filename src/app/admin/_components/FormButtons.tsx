"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="adm-btn adm-btn-primary" disabled={pending}>
      {pending && <Loader2 className="adm-spin" />}
      {children}
    </button>
  );
}

export function DeleteButton({
  action,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  label: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      formAction={action}
      formNoValidate
      disabled={pending}
      className="adm-btn adm-btn-danger"
      onClick={(event) => {
        if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <Trash2 />
      Delete
    </button>
  );
}
