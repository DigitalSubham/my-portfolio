import { NextResponse, type NextRequest } from "next/server";

const authCookieName = "portfolio_admin_token";
const encoder = new TextEncoder();

function base64UrlEncode(value: ArrayBuffer): string {
  let binary = "";
  new Uint8Array(value).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
}

async function verifyJwt(token: string) {
  try {
    if (!process.env.JWT_SECRET) return false;
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return false;
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(process.env.JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${payload}`));
    if (base64UrlEncode(expected) !== signature) return false;
    const parsed = JSON.parse(base64UrlDecode(payload)) as { exp?: number };
    return Boolean(parsed.exp && parsed.exp >= Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(authCookieName)?.value;
  if (token && (await verifyJwt(token))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
