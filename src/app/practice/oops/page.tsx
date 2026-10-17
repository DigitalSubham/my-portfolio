import type { Metadata } from 'next';
import Quiz from '@/components/practice/Quiz';
import { getPracticeSubject } from '@/lib/practice-subjects';

export const metadata: Metadata = { title: 'OOP Practice | C, C++, Java & Python', description: '199 assignment questions with reviewed explanations and beginner-friendly OOP lessons.', alternates: { canonical: '/practice/oops' } };
export default async function OopPractice({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter } = await searchParams;
  const subject = getPracticeSubject('oops')!;
  return <Quiz subject={subject} initialTopic={subject.topics.some((topic) => topic.key === chapter) ? chapter : null} />;
}
