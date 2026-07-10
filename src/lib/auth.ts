import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { getSql, hasDatabase } from "./db";

export const authCookieName = "portfolio_admin_token";

type JwtPayload = {
  sub: string;
  email: string;
  exp: number;
};

const encoder = new TextEncoder();

function base64UrlEncode(value: string | ArrayBuffer): string {
  const bytes =
    typeof value === "string"
      ? encoder.encode(value)
      : new Uint8Array(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
}

async function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required.");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signJwt(payload: Omit<JwtPayload, "exp">): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const fullPayload: JwtPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(
    JSON.stringify(fullPayload),
  )}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await signingKey(),
    encoder.encode(unsigned),
  );
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;
    const unsigned = `${header}.${payload}`;
    const expected = await crypto.subtle.sign(
      "HMAC",
      await signingKey(),
      encoder.encode(unsigned),
    );
    if (base64UrlEncode(expected) !== signature) return null;
    const parsed = JSON.parse(base64UrlDecode(payload)) as JwtPayload;
    if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const candidate = Buffer.from(hashPassword(password, salt), "hex");
  const stored = Buffer.from(hash, "hex");
  return candidate.length === stored.length && timingSafeEqual(candidate, stored);
}

export async function authenticateAdmin(email: string, password: string) {
  if (!hasDatabase) return null;
  const sql = getSql();
  const rows = (await sql`
    SELECT id, email, password_hash, password_salt
    FROM admins
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `) as Record<string, unknown>[];
  const admin = rows[0];
  if (!admin) return null;
  const isValid = verifyPassword(
    password,
    String(admin.password_hash),
    String(admin.password_salt),
  );
  if (!isValid) return null;
  return { id: String(admin.id), email: String(admin.email) };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
