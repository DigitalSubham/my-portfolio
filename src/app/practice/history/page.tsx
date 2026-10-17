import type { Metadata } from "next";
import Quiz from "@/components/practice/Quiz";
import { getPracticeSubject } from "@/lib/practice-subjects";

export const metadata: Metadata = {
  title: "Bihar History & Indian National Movement Practice",
  description: "880 history practice questions across 24 chapters, with Hindi notes and saved progress.",
  alternates: { canonical: "/practice/history" },
};

export default async function HistoryPracticePage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter } = await searchParams;
  const subject = getPracticeSubject("history")!;
  return <Quiz subject={subject} initialTopic={subject.topics.some((t) => t.key === chapter) ? chapter : null} />;
}
