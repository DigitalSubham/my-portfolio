import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
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
    <AdminShell
      eyebrow="Content"
      title={section.title}
      description={section.description}
      actions={
        <Link href="/" target="_blank" className="adm-btn adm-btn-ghost">
          <ExternalLink />
          View site
        </Link>
      }
    >
      <div className="grid gap-6">
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
