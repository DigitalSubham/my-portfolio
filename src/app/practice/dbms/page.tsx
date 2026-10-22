import type { Metadata } from 'next';
import Quiz from '@/components/practice/Quiz';
import { getPracticeSubject } from '@/lib/practice-subjects';

export const metadata: Metadata = {
  title: 'DBMS Practice | BPSC TRE Question Bank',
  description: '635 DBMS questions across 14 topics with explanations, timed tests and saved progress.',
  alternates: { canonical: '/practice/dbms' },
};

export default async function DbmsPractice({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const subject = getPracticeSubject('dbms')!;
  return <Quiz subject={subject} initialTopic={subject.topics.some((entry) => entry.key === topic) ? topic : null} />;
}
