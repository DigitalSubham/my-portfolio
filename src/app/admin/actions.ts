"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  authCookieName,
  authenticateAdmin,
  requireAdmin,
  resetAdminPassword,
  signJwt,
} from "@/lib/auth";
import { getAdminTable, type AdminField } from "@/lib/admin-config";
import { addResume, deleteResume, getSql, hasDatabase, setDefaultResume } from "@/lib/db";
import {
  draftApplication,
  sendApplication,
  type ApplicationDraft,
} from "@/lib/job-apply";

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
  const next = formData.get("next") === "/dsa-practice.html" ? "/dsa-practice.html" : "/admin";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const admin = await authenticateAdmin(email, password);

  if (!admin) {
    redirect(`/admin/login?error=1${next === "/dsa-practice.html" ? "&next=/dsa-practice.html" : ""}`);
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
  redirect(next);
}

export async function resetPasswordAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const recoveryKey = String(formData.get("recoveryKey") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) redirect("/admin/forgot-password?error=short");
  if (password !== confirm) redirect("/admin/forgot-password?error=mismatch");
  if (!(await resetAdminPassword(email, recoveryKey, password))) {
    redirect("/admin/forgot-password?error=invalid");
  }
  redirect("/admin/login?reset=1");
}

export async function uploadResumeAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const bestFor = String(formData.get("bestFor") || "").trim();
  const file = formData.get("resume");
  if (!name) redirect("/admin/resume?error=name");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/resume?error=missing");
  if (file.size > 4 * 1024 * 1024) redirect("/admin/resume?error=size");

  const pdf = Buffer.from(await file.arrayBuffer());
  if (pdf.subarray(0, 5).toString() !== "%PDF-") redirect("/admin/resume?error=type");

  await addResume({ name, bestFor, pdf, makeDefault: formData.get("makeDefault") === "on" });
  redirect("/admin/resume?uploaded=1");
}

export async function setDefaultResumeAction(id: number) {
  await requireAdmin();
  await setDefaultResume(id);
  revalidatePath("/admin/resume");
}

export async function deleteResumeAction(id: number) {
  await requireAdmin();
  await deleteResume(id);
  revalidatePath("/admin/resume");
}

export type DraftState = {
  draft?: ApplicationDraft;
  error?: string;
  at?: number;
};

export async function draftApplicationAction(_prev: DraftState, formData: FormData): Promise<DraftState> {
  await requireAdmin();
  const text = String(formData.get("text") || "").trim();
  const image = formData.get("image");
  const hasImage = image instanceof File && image.size > 0;

  if (!text && !hasImage) return { error: "Paste the job posting text or add a screenshot." };
  if (hasImage && !image.type.startsWith("image/")) return { error: "The screenshot must be an image." };
  if (hasImage && image.size > 3 * 1024 * 1024) return { error: "The screenshot must be 3 MB or smaller." };

  const imageDataUrl = hasImage
    ? `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}`
    : undefined;

  try {
    return { draft: await draftApplication({ text, imageDataUrl }), at: Date.now() };
  } catch (error) {
    console.error("Failed to draft application.", error);
    return { error: error instanceof Error ? error.message : "Drafting failed. Try again." };
  }
}

export type SendState = { error?: string; sentTo?: string };

export async function sendApplicationAction(_prev: SendState, formData: FormData): Promise<SendState> {
  await requireAdmin();
  const field = (name: string) => String(formData.get(name) || "").trim();
  try {
    await sendApplication({
      to: field("to"),
      subject: field("subject"),
      body: String(formData.get("body") || ""),
      company: field("company"),
      role: field("role"),
      resumeId: Number(formData.get("resumeId")) || 0,
    });
    return { sentTo: field("to") };
  } catch (error) {
    console.error("Failed to send application.", error);
    return { error: error instanceof Error ? error.message : "Sending failed. Try again." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(authCookieName);
  redirect("/admin/login");
}

// Public pages are prerendered, so refresh all of them (/, /projects, /blog, …) after any content
// change instead of listing pages and missing one.
function revalidatePublicSite() {
  revalidatePath("/", "layout");
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
  revalidatePublicSite();
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
  revalidatePublicSite();
  revalidatePath("/admin");
}

export async function updateRecord(tableKey: string, id: number, formData: FormData) {
  await requireAdmin();
  const config = getAdminTable(tableKey);
  if (!config || config.singleton) throw new Error("Invalid collection table.");

  const values = config.fields.map((field) => fieldValue(field, formData));
  const sql = getSql();
  await sql.query(
    `UPDATE ${config.table} SET ${assignmentSql(config.fields, 2)}, updated_at = now() WHERE id = $1`,
    [id, ...values],
  );
  revalidatePublicSite();
  revalidatePath("/admin");
}

export async function deleteRecord(tableKey: string, id: number) {
  await requireAdmin();
  const config = getAdminTable(tableKey);
  if (!config || config.singleton) throw new Error("Invalid collection table.");

  const sql = getSql();
  await sql.query(`DELETE FROM ${config.table} WHERE id = $1`, [id]);
  revalidatePublicSite();
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
