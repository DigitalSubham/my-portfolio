"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

// While the form submits, the spinner replaces the button's own icon (see .adm-btn[aria-busy] in admin.css).
export function SubmitButton({
  children,
  className = "adm-btn adm-btn-primary",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button {...props} className={className} disabled={pending} aria-busy={pending}>
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
      aria-busy={pending}
      className="adm-btn adm-btn-danger"
      onClick={(event) => {
        if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      {pending && <Loader2 className="adm-spin" />}
      <Trash2 />
      Delete
    </button>
  );
}
