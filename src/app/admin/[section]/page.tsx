import { notFound } from "next/navigation";
import AdminShell from "../_components/AdminShell";
import { CollectionEditor, SingletonForm } from "../_components/AdminForm";
import { getAdminSection } from "@/lib/admin-config";
import { getSingletonRow, getTableRows } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";

type Props = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({ params }: Props) {
  await requireAdmin();
  const { section: slug } = await params;
  const section = getAdminSection(slug);
  if (!section) notFound();

  const tableData = await Promise.all(
    section.tables.map(async (table) => ({
      table,
      rows: await getTableRows(table),
      singleton: table.singleton ? await getSingletonRow(table) : null,
    })),
  );

  return (
    <AdminShell>
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Content
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
          {section.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          {section.description}
        </p>
      </header>

      <div className="mt-8 grid gap-8">
        {tableData.map(({ table, rows, singleton }) =>
          table.singleton ? (
            <SingletonForm key={table.key} config={table} row={singleton || {}} />
          ) : (
            <CollectionEditor key={table.key} config={table} rows={rows} />
          ),
        )}
      </div>
    </AdminShell>
  );
}
