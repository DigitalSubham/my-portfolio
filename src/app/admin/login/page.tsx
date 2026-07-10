import Link from "next/link";
import { loginAction } from "../actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f5] px-4 text-gray-900">
      <div className="w-full max-w-md border border-gray-200 bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-950">
          Back to portfolio
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950">
          Admin login
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Sign in to manage portfolio content, SEO fields, and contact messages.
        </p>
        {params.error && (
          <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            Invalid email or password.
          </p>
        )}
        <form action={loginAction} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Email
            <input
              name="email"
              type="email"
              required
              className="min-h-12 border border-gray-200 bg-white px-3 text-gray-950 outline-none focus:border-gray-950"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Password
            <input
              name="password"
              type="password"
              required
              className="min-h-12 border border-gray-200 bg-white px-3 text-gray-950 outline-none focus:border-gray-950"
            />
          </label>
          <button className="min-h-12 bg-gray-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
