import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getPracticeQuestions } from "@/lib/practice-db";
import { getPracticeSubject } from "@/lib/practice-subjects";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(_request: Request, context: { params: Promise<{ subject: string }> }) {
  const { subject } = await context.params;
  if (!getPracticeSubject(subject)) return NextResponse.json({ error: "Unknown practice subject." }, { status: 404, headers });
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Sign in to practise and save your progress." }, { status: 401, headers });
  try {
    return NextResponse.json({ questions: await getPracticeQuestions(subject) }, { headers });
  } catch (error) {
    console.error("Unable to load practice questions.", error);
    return NextResponse.json({ error: "Questions could not be loaded. Please try again." }, { status: 503, headers });
  }
}
