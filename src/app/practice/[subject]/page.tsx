import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Quiz from "@/components/practice/Quiz";
import { getPracticeSubject } from "@/lib/practice-subjects";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ topic?: string; chapter?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = await getPracticeSubject((await params).subject);
  if (!subject) notFound();
  return {
    title: subject.title,
    description: subject.description,
    alternates: { canonical: `/practice/${subject.slug}` },
  };
}

export default async function PracticeQuizPage({ params, searchParams }: Props) {
  const subject = await getPracticeSubject((await params).subject);
  if (!subject) notFound();
  const { topic, chapter } = await searchParams;
  const selected = topic ?? chapter;
  return <Quiz key={subject.slug} subject={subject} initialTopic={subject.topics.some((entry) => entry.key === selected) ? selected : null} />;
}
