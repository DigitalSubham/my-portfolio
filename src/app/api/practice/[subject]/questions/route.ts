import { NextResponse } from "next/server";
import { getPracticeQuestions } from "@/lib/practice-db";
import { getPracticeSubject } from "@/lib/practice-subjects";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ subject: string }> }) {
  const { subject } = await context.params;
  if (!getPracticeSubject(subject)) return NextResponse.json({ error: "Unknown practice subject." }, { status: 404 });
  try {
    return NextResponse.json({ questions: await getPracticeQuestions(subject) }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (error) {
    console.error("Unable to load practice questions.", error);
    return NextResponse.json({ error: "Questions could not be loaded. Please try again." }, { status: 503 });
  }
}
