import { ChevronDown, Plus } from "lucide-react";
import type { AdminField, AdminTableConfig } from "@/lib/admin-config";
import { createRecord, deleteRecord, saveSingleton, updateRecord } from "../actions";
import AddRecordModal from "./AddRecordModal";
import { DeleteButton, SubmitButton } from "./FormButtons";

type Row = Record<string, unknown>;

const wideTypes = new Set<AdminField["type"]>(["textarea", "array"]);

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

function truthy(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function AdminInput({ field, row }: { field: AdminField; row: Row }) {
  const common = { id: field.name, name: field.name, required: field.required };

  if (wideTypes.has(field.type)) {
    return (
      <textarea
        {...common}
        rows={field.type === "array" ? 4 : 5}
        className="adm-textarea"
        defaultValue={valueForField(row, field)}
        placeholder={field.type === "array" ? "One item per line" : undefined}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        {...common}
        className="adm-select"
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
      className="adm-input"
      defaultValue={valueForField(row, field)}
      placeholder={field.type === "url" ? "https://…" : undefined}
    />
  );
}

function Field({ field, row }: { field: AdminField; row: Row }) {
  if (field.type === "boolean") {
    return (
      <label className="adm-switch self-end">
        <input id={field.name} name={field.name} type="checkbox" defaultChecked={truthy(row[field.name])} />
        {field.label}
      </label>
    );
  }

  return (
    <label className={`adm-label ${wideTypes.has(field.type) ? "adm-form-wide" : ""}`}>
      <span className="flex items-baseline justify-between gap-2">
        {field.label}
        {field.type === "array" && <span className="adm-hint">one per line</span>}
        {!field.required && field.type !== "array" && <span className="adm-hint">optional</span>}
      </span>
      <AdminInput field={field} row={row} />
    </label>
  );
}

function FormFields({ config, row }: { config: AdminTableConfig; row: Row }) {
  return (
    <div className="adm-form-grid">
      {config.fields.map((field) => (
        <Field key={field.name} field={field} row={row} />
      ))}
    </div>
  );
}

function recordTitle(row: Row, fallback: string) {
  return String(row.title || row.name || row.label || row.company || row.email || fallback);
}

export function SingletonForm({ config, row }: { config: AdminTableConfig; row: Row }) {
  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2 className="adm-card-title">{config.title}</h2>
          <p className="adm-card-desc">Changes go live on the public site right after saving.</p>
        </div>
      </div>
      <form action={saveSingleton.bind(null, config.key)} className="grid gap-5 p-5">
        <FormFields config={config} row={row} />
        <div className="adm-actions">
          <SubmitButton>Save changes</SubmitButton>
        </div>
      </form>
    </section>
  );
}

export function CollectionEditor({ config, rows }: { config: AdminTableConfig; rows: Row[] }) {
  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2 className="adm-card-title">{config.title}</h2>
          <p className="adm-card-desc">
            {rows.length} {rows.length === 1 ? "record" : "records"}
          </p>
        </div>
        <AddRecordModal title={`New ${config.title.toLowerCase()}`}>
          <form action={createRecord.bind(null, config.key)} className="grid gap-5">
            <FormFields config={config} row={{ is_published: true, sort_order: rows.length + 1 }} />
            <div className="adm-actions">
              <SubmitButton>
                <Plus />
                Create record
              </SubmitButton>
            </div>
          </form>
        </AddRecordModal>
      </div>

      {rows.length === 0 ? (
        <div className="adm-empty">
          <p className="font-semibold">No records yet</p>
          <p>Use “Add record” to create the first one.</p>
        </div>
      ) : (
        rows.map((row) => {
          const id = Number(row.id);
          const title = recordTitle(row, config.title);
          const published = truthy(row.is_published);
          const hasPublishField = config.fields.some((field) => field.name === "is_published");

          return (
            <details key={id} className="adm-record">
              <summary className="adm-record-summary">
                <span className="adm-record-id">{id}</span>
                <span className="adm-record-title">{title}</span>
                {hasPublishField && (
                  <span className={`adm-chip ${published ? "adm-chip-ok" : ""}`}>
                    {published ? "Published" : "Draft"}
                  </span>
                )}
                <ChevronDown className="adm-record-chev h-4 w-4" />
              </summary>
              <form action={updateRecord.bind(null, config.key, id)} className="adm-record-body">
                <FormFields config={config} row={row} />
                <div className="adm-actions">
                  <SubmitButton>Save</SubmitButton>
                  <DeleteButton action={deleteRecord.bind(null, config.key, id)} label={title} />
                </div>
              </form>
            </details>
          );
        })
      )}
    </section>
  );
}
