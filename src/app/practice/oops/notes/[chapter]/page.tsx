import { notFound, permanentRedirect } from 'next/navigation';
import { oopChapters } from '@/lib/oop-notes';

export default async function OopTopicRedirect({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  if (!oopChapters.some((topic) => topic.key === chapter)) notFound();
  permanentRedirect(`/practice/oops/notes#${chapter}`);
}
