import Link from "next/link";
import { SubmitButton } from "../_components/FormButtons";
import LinkPending from "../_components/LinkPending";
import { AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { resetPasswordAction } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

const errors: Record<string, string> = {
  invalid: "Email or recovery key is incorrect.",
  short: "New password must be at least 8 characters.",
  mismatch: "New passwords do not match.",
};

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const error = params.error && errors[params.error];

  return (
    <div className="adm grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-[400px]">
        <Link
          href="/admin/login"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--adm-muted)] transition-colors hover:text-[var(--adm-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
          <LinkPending />
        </Link>

        <div className="adm-card p-7">
          <span className="adm-mark adm-mark-lg">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="mt-2 text-[14px] leading-6 text-[var(--adm-muted)]">
            Enter your admin email, the recovery key from your environment variables, and a new
            password.
          </p>

          {error && (
            <p className="adm-alert mt-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <form action={resetPasswordAction} className="mt-6 grid gap-4">
            <label className="adm-label">
              Email
              <input name="email" type="email" autoComplete="email" required className="adm-input" />
            </label>
            <label className="adm-label">
              Recovery key
              <input
                name="recoveryKey"
                type="password"
                autoComplete="off"
                required
                className="adm-input"
              />
            </label>
            <label className="adm-label">
              New password
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="adm-input"
              />
            </label>
            <label className="adm-label">
              Confirm new password
              <input
                name="confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="adm-input"
              />
            </label>
            <SubmitButton className="adm-btn adm-btn-primary mt-1 w-full">
              <KeyRound />
              Reset password
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
