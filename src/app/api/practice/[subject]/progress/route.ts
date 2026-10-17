import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getSql } from "@/lib/db";
import { getPracticeQuestions } from "@/lib/practice-db";
import { validatePracticeSnapshot } from "@/lib/practice-state";
import { getPracticeSubject } from "@/lib/practice-subjects";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type SavedRow = { snapshot: unknown; revision: number; updated_at: string };

export async function GET(_request: Request, context: { params: Promise<{ subject: string }> }) {
  const { subject } = await context.params;
  if (!getPracticeSubject(subject)) return NextResponse.json({ error: "Unknown practice subject." }, { status: 404, headers });
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Sign in to save your practice across devices." }, { status: 401, headers });
  try {
    const [row] = await getSql()`SELECT snapshot, revision, updated_at FROM practice_saves WHERE admin_id = ${admin.sub} AND subject = ${subject}` as SavedRow[];
    return NextResponse.json({ owner: admin.sub, snapshot: row?.snapshot ?? null, revision: row?.revision ?? 0, updatedAt: row?.updated_at ?? null }, { headers });
  } catch (error) {
    console.error("Unable to load practice save.", error);
    return NextResponse.json({ error: "Your saved practice could not be loaded. Please try again." }, { status: 503, headers });
  }
}

export async function POST(request: Request, context: { params: Promise<{ subject: string }> }) {
  const { subject } = await context.params;
  const config = getPracticeSubject(subject);
  if (!config) return NextResponse.json({ error: "Unknown practice subject." }, { status: 404, headers });
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers });
  }
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Sign in to save your practice across devices." }, { status: 401, headers });
  const text = await request.text();
  if (text.length > 1_000_000) return NextResponse.json({ error: "Practice save is too large." }, { status: 413, headers });
  let snapshot;
  let revision;
  let writerId = "", sequence = 0;
  let questions;
  try {
    questions = await getPracticeQuestions(subject);
  } catch (error) {
    console.error("Unable to validate practice save.", error);
    return NextResponse.json({ error: "Saving is temporarily unavailable. Your practice remains in this browser; please retry." }, { status: 503, headers });
  }
  try {
    const input = JSON.parse(text);
    revision = input.revision;
    if (!Number.isSafeInteger(revision) || revision < 0) throw new Error("Invalid save revision.");
    if (input.writerId !== undefined) {
      if (typeof input.writerId !== "string" || !/^[a-f0-9-]{36}$/i.test(input.writerId) ||
        !Number.isSafeInteger(input.sequence) || input.sequence < 1) throw new Error("Invalid save writer.");
      writerId = input.writerId;
      sequence = input.sequence;
    }
    snapshot = validatePracticeSnapshot(input.snapshot, questions, config.topics);
  } catch {
    return NextResponse.json({ error: "Invalid practice save. Reload the quiz and try again." }, { status: 400, headers });
  }
  try {
    const sql = getSql();
    // Sequence saves from one tab so a leave checkpoint wins even if an earlier
    // wrong-answer request arrives later. Other tabs must still match the revision.
    const rows = await sql`
      INSERT INTO practice_saves (admin_id, subject, snapshot, writer_id, writer_sequence, writer_base_revision)
      SELECT ${admin.sub}, ${subject}, ${JSON.stringify(snapshot)}::jsonb, ${writerId}, ${sequence}, ${revision}
      WHERE ${revision} = 0 OR EXISTS (SELECT 1 FROM practice_saves WHERE admin_id = ${admin.sub} AND subject = ${subject})
      ON CONFLICT (admin_id, subject) DO UPDATE
      SET snapshot = EXCLUDED.snapshot, revision = practice_saves.revision + 1,
          writer_id = EXCLUDED.writer_id, writer_sequence = EXCLUDED.writer_sequence,
          writer_base_revision = EXCLUDED.writer_base_revision, updated_at = now()
      WHERE practice_saves.revision = ${revision}
        OR (${writerId} <> '' AND practice_saves.writer_id = ${writerId}
          AND practice_saves.writer_base_revision = ${revision} AND practice_saves.writer_sequence < ${sequence})
      RETURNING revision, updated_at
    ` as Pick<SavedRow, "revision" | "updated_at">[];
    if (!rows.length && writerId) {
      const [newer] = await sql`SELECT revision, updated_at FROM practice_saves
        WHERE admin_id = ${admin.sub} AND subject = ${subject} AND writer_id = ${writerId}
          AND writer_base_revision = ${revision} AND writer_sequence >= ${sequence}` as Pick<SavedRow, "revision" | "updated_at">[];
      if (newer) return NextResponse.json({ revision: newer.revision, updatedAt: newer.updated_at }, { headers });
    }
    if (!rows.length) return NextResponse.json({ error: "A newer save exists on another tab or device. Load it before saving again." }, { status: 409, headers });
    return NextResponse.json({ revision: rows[0].revision, updatedAt: rows[0].updated_at }, { headers });
  } catch (error) {
    console.error("Unable to save practice.", error);
    return NextResponse.json({ error: "Saving failed. Your practice is still available in this browser; please retry." }, { status: 503, headers });
  }
}
