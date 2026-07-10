import Link from "next/link";
import { LogOut } from "lucide-react";
import { adminSections } from "@/lib/admin-config";
import { logoutAction } from "../actions";
import AdminNav from "./AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-gray-900">
      <div className="min-h-screen lg:pl-72">
        <aside className="border-b border-gray-200 bg-white p-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/admin" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Portfolio
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">
                Admin CMS
              </h1>
            </Link>
            <form action={logoutAction} className="lg:hidden">
              <button className="inline-flex min-h-10 items-center gap-2 border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>

          <AdminNav sections={adminSections} />

          <form action={logoutAction} className="mt-8 hidden lg:block">
            <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </aside>
        <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-10">{children}</section>
      </div>
    </main>
  );
}
