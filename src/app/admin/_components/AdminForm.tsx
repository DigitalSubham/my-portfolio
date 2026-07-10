import { Trash2 } from "lucide-react";
import type { AdminField, AdminTableConfig } from "@/lib/admin-config";
import { createRecord, deleteRecord, saveSingleton, updateRecord } from "../actions";
import AddRecordModal from "./AddRecordModal";

type Row = Record<string, unknown>;

const inputClass =
  "min-h-11 w-full border border-gray-200 bg-white px-3 text-sm text-gray-950 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-950";

function valueForField(row: Row, field: AdminField): string {
  const value = row[field.name];
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  }
  return value === null || value === undefined ? "" : String(value);
}

function isChecked(row: Row, field: AdminField) {
  const value = row[field.name];
  return value === true || value === "true" || value === 1 || value === "1";
}

function AdminInput({ field, row }: { field: AdminField; row: Row }) {
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
  };

  if (field.type === "textarea" || field.type === "array") {
    return (
      <textarea
        {...common}
        rows={field.type === "array" ? 4 : 5}
        className={`${inputClass} py-3`}
        defaultValue={valueForField(row, field)}
        placeholder={field.type === "array" ? "One item per line" : undefined}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <input
        id={field.name}
        name={field.name}
        type="checkbox"
        defaultChecked={isChecked(row, field)}
        className="h-5 w-5 border-gray-300 text-gray-950"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        {...common}
        className={inputClass}
        defaultValue={valueForField(row, field) || field.options?.[0]}
      >
        {field.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      {...common}
      type={field.type}
      className={inputClass}
      defaultValue={valueForField(row, field)}
    />
  );
}

function FormFields({ config, row }: { config: AdminTableConfig; row: Row }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {config.fields.map((field) => (
        <label
          key={field.name}
          className={`grid gap-2 text-sm font-medium text-gray-700 ${
            field.type === "textarea" || field.type === "array" ? "md:col-span-2" : ""
          }`}
        >
          <span>{field.label}</span>
          <AdminInput field={field} row={row} />
        </label>
      ))}
    </div>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="min-h-11 justify-self-start bg-gray-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
      {children}
    </button>
  );
}

function recordTitle(row: Row, fallback: string) {
  return String(row.title || row.name || row.label || row.company || row.email || fallback);
}

export function SingletonForm({ config, row }: { config: AdminTableConfig; row: Row }) {
  const action = saveSingleton.bind(null, config.key);

  return (
    <section className="border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-xl font-semibold text-gray-950">{config.title}</h2>
        <p className="mt-1 text-sm text-gray-500">Changes update the public site after save.</p>
      </div>
      <form action={action} className="grid gap-5 p-5">
        <FormFields config={config} row={row} />
        <PrimaryButton>Save changes</PrimaryButton>
      </form>
    </section>
  );
}

export function CollectionEditor({ config, rows }: { config: AdminTableConfig; rows: Row[] }) {
  const createAction = createRecord.bind(null, config.key);

  return (
    <section className="border border-gray-200 bg-white shadow-sm">
      <div className="relative flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-950">{config.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{rows.length} records</p>
        </div>
        <AddRecordModal title={`Add ${config.title}`}>
          <div className="border border-gray-200 bg-white p-5">
            <form action={createAction} className="grid gap-5">
              <FormFields config={config} row={{ is_published: true, sort_order: rows.length + 1 }} />
              <PrimaryButton>Create</PrimaryButton>
            </form>
          </div>
        </AddRecordModal>
      </div>

      <div className="divide-y divide-gray-200">
        {rows.length === 0 && (
          <div className="p-5 text-sm text-gray-500">No records yet.</div>
        )}

        {rows.map((row) => {
          const id = Number(row.id);
          const updateAction = updateRecord.bind(null, config.key, id);
          const deleteAction = deleteRecord.bind(null, config.key, id);

          return (
            <details key={id} className="group bg-white open:bg-[#fbfbfa]">
              <summary className="grid cursor-pointer list-none gap-2 px-5 py-4 transition-colors hover:bg-[#f7f7f5] sm:grid-cols-[72px_1fr_auto] sm:items-center">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  #{id}
                </span>
                <span className="font-semibold text-gray-950">{recordTitle(row, config.title)}</span>
                <span className="text-sm font-medium text-gray-500">Edit</span>
              </summary>
              <form action={updateAction} className="grid gap-5 border-t border-gray-200 bg-[#fbfbfa] p-5">
                <FormFields config={config} row={row} />
                <div className="flex flex-wrap gap-3">
                  <PrimaryButton>Save</PrimaryButton>
                  <button
                    formAction={deleteAction}
                    className="inline-flex min-h-11 items-center gap-2 border border-red-200 bg-white px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </form>
            </details>
          );
        })}
      </div>
    </section>
  );
}
