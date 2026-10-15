import { NextResponse } from "next/server";
import { getPracticeQuestions } from "@/lib/practice-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ questions: await getPracticeQuestions() }, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (error) {
    console.error("Unable to load DSA questions.", error);
    return NextResponse.json({ error: "Questions could not be loaded. Please try again." }, { status: 503 });
  }
}
