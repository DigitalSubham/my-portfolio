"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authCookieName, authenticateAdmin, requireAdmin, signJwt } from "@/lib/auth";
import { getAdminTable, type AdminField } from "@/lib/admin-config";
import { getSql, hasDatabase } from "@/lib/db";

function fieldValue(field: AdminField, formData: FormData) {
  if (field.type === "boolean") return formData.get(field.name) === "on";
  const raw = String(formData.get(field.name) || "").trim();
  if (field.type === "number") return Number(raw || 0);
  if (field.type === "array") {
    return JSON.stringify(
      raw
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  }
  return raw;
}

function assignmentSql(fields: AdminField[], offset = 1) {
  return fields.map((field, index) => `${field.name} = $${index + offset}`).join(", ");
}

function insertSql(fields: AdminField[]) {
  const columns = fields.map((field) => field.name).join(", ");
  const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");
  return { columns, placeholders };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const admin = await authenticateAdmin(email, password);

  if (!admin) {
    redirect("/admin/login?error=1");
  }

  const token = await signJwt({ sub: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set(authCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(authCookieName);
  redirect("/admin/login");
}

export async function saveSingleton(tableKey: string, formData: FormData) {
  await requireAdmin();
  if (!hasDatabase) redirect(`/admin/${tableKey}?error=db`);
  const config = getAdminTable(tableKey);
  if (!config || !config.singleton) throw new Error("Invalid singleton table.");

  const values = config.fields.map((field) => fieldValue(field, formData));
  const sql = getSql();
  await sql.query(
    `UPDATE ${config.table} SET ${assignmentSql(config.fields)}, updated_at = now() WHERE id = 1`,
    values,
  );
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/admin/${tableKey}`);
}

export async function createRecord(tableKey: string, formData: FormData) {
  await requireAdmin();
  const config = getAdminTable(tableKey);
  if (!config || config.singleton) throw new Error("Invalid collection table.");

  const values = config.fields.map((field) => fieldValue(field, formData));
  const { columns, placeholders } = insertSql(config.fields);
  const sql = getSql();
  await sql.query(
    `INSERT INTO ${config.table} (${columns}) VALUES (${placeholders})`,
    values,
  );
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function updateRecord(tableKey: string, id: number, formData: FormData) {
  await requireAdmin();
  const config = getAdminTable(tableKey);
  if (!config || config.singleton) throw new Error("Invalid collection table.");

  const values = config.fields.map((field) => fieldValue(field, formData));
  const sql = getSql();
  await sql.query(
    `UPDATE ${config.table} SET ${assignmentSql(config.fields)}, updated_at = now() WHERE id = $1`,
    [id, ...values],
  );
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function deleteRecord(tableKey: string, id: number) {
  await requireAdmin();
  const config = getAdminTable(tableKey);
  if (!config || config.singleton) throw new Error("Invalid collection table.");

  const sql = getSql();
  await sql.query(`DELETE FROM ${config.table} WHERE id = $1`, [id]);
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function markMessage(id: number, action: "read" | "unread" | "archive" | "delete") {
  await requireAdmin();
  const sql = getSql();
  if (action === "delete") {
    await sql`DELETE FROM contact_messages WHERE id = ${id}`;
  } else if (action === "archive") {
    await sql`UPDATE contact_messages SET is_archived = true WHERE id = ${id}`;
  } else {
    await sql`
      UPDATE contact_messages
      SET is_read = ${action === "read"}
      WHERE id = ${id}
    `;
  }
  revalidatePath("/admin/messages");
}
