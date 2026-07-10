"use server";

import { redirect } from "next/navigation";
import { getSql, hasDatabase } from "@/lib/db";

function textField(formData: FormData, key: string): string {
  return String(formData.get(key) || "").trim();
}

export async function submitContactMessage(formData: FormData) {
  const name = textField(formData, "name");
  const email = textField(formData, "email");
  const subject = textField(formData, "subject");
  const message = textField(formData, "message");

  if (!name || !email || !message || !hasDatabase) {
    redirect("/#contact");
  }

  const sql = getSql();
  await sql`
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (${name}, ${email}, ${subject}, ${message})
  `;

  redirect("/#contact");
}
