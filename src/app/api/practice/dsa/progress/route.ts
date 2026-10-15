import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { getPracticeQuestions } from "@/lib/practice-db";
import { validatePracticeSnapshot } from "@/lib/practice-state";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type SavedRow = { snapshot: unknown; revision: number; updated_at: string };

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Sign in to save your practice across devices." }, { status: 401, headers });
  try {
    const [row] = await getSql()`SELECT snapshot, revision, updated_at FROM practice_saves WHERE admin_id = ${admin.sub} AND subject = 'dsa'` as SavedRow[];
    return NextResponse.json({ owner: admin.sub, snapshot: row?.snapshot ?? null, revision: row?.revision ?? 0, updatedAt: row?.updated_at ?? null }, { headers });
  } catch (error) {
    console.error("Unable to load practice save.", error);
    return NextResponse.json({ error: "Your saved practice could not be loaded. Please try again." }, { status: 503, headers });
  }
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Sign in to save your practice across devices." }, { status: 401, headers });
  const text = await request.text();
  if (text.length > 1_000_000) return NextResponse.json({ error: "Practice save is too large." }, { status: 413, headers });
  let snapshot;
  let revision;
  let questions;
  try {
    questions = await getPracticeQuestions();
  } catch (error) {
    console.error("Unable to validate practice save.", error);
    return NextResponse.json({ error: "Saving is temporarily unavailable. Your practice remains in this browser; please retry." }, { status: 503, headers });
  }
  try {
    const input = JSON.parse(text);
    revision = input.revision;
    if (!Number.isSafeInteger(revision) || revision < 0) throw new Error("Invalid save revision.");
    snapshot = validatePracticeSnapshot(input.snapshot, questions);
  } catch {
    return NextResponse.json({ error: "Invalid practice save. Reload the quiz and try again." }, { status: 400, headers });
  }
  try {
    const sql = getSql();
    // Compare revisions atomically so a stale device cannot overwrite a newer save.
    const rows = (revision === 0
      ? await sql`INSERT INTO practice_saves (admin_id, subject, snapshot)
          VALUES (${admin.sub}, 'dsa', ${JSON.stringify(snapshot)}::jsonb)
          ON CONFLICT (admin_id, subject) DO NOTHING RETURNING revision, updated_at`
      : await sql`UPDATE practice_saves SET snapshot = ${JSON.stringify(snapshot)}::jsonb, revision = revision + 1, updated_at = now()
          WHERE admin_id = ${admin.sub} AND subject = 'dsa' AND revision = ${revision} RETURNING revision, updated_at`) as Pick<SavedRow, "revision" | "updated_at">[];
    if (!rows.length) return NextResponse.json({ error: "A newer save exists on another tab or device. Load it before saving again." }, { status: 409, headers });
    return NextResponse.json({ revision: rows[0].revision, updatedAt: rows[0].updated_at }, { headers });
  } catch (error) {
    console.error("Unable to save practice.", error);
    return NextResponse.json({ error: "Saving failed. Your practice is still available in this browser; please retry." }, { status: 503, headers });
  }
}
