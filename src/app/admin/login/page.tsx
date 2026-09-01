import Link from "next/link";
import { AlertCircle, ArrowLeft, LayoutDashboard, LogIn } from "lucide-react";
import { loginAction } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="adm grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--adm-muted)] transition-colors hover:text-[var(--adm-text)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <div className="adm-card p-7">
          <span className="adm-mark adm-mark-lg">
            <LayoutDashboard className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-[14px] leading-6 text-[var(--adm-muted)]">
            Sign in to manage portfolio content, SEO fields, and contact messages.
          </p>

          {params.error && (
            <p className="adm-alert mt-5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Invalid email or password.
            </p>
          )}

          <form action={loginAction} className="mt-6 grid gap-4">
            <label className="adm-label">
              Email
              <input name="email" type="email" autoComplete="email" required className="adm-input" />
            </label>
            <label className="adm-label">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="adm-input"
              />
            </label>
            <button className="adm-btn adm-btn-primary mt-1 w-full">
              <LogIn />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
