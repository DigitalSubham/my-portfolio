import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import NoteContent from '@/components/practice/NoteContent';
import ReadingTools from '@/components/practice/ReadingTools';
import { getOopNote, oopChapters } from '@/lib/oop-notes';
import { noteText } from '@/lib/history-notes';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ chapter: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter } = await params;
  return { title: oopChapters.find((item) => item.key === chapter)?.title || 'OOP Notes', alternates: { canonical: `/practice/oops/notes/${chapter}` } };
}
export default async function OopChapter({ params }: Props) {
  const { chapter } = await params;
  const index = oopChapters.findIndex((item) => item.key === chapter);
  if (index < 0) notFound();
  const note = await getOopNote(chapter);
  if (!note) notFound();
  const entry = oopChapters[index], previous = oopChapters[index - 1], next = oopChapters[index + 1];
  const headings = note.content.flatMap((node) => typeof node !== 'string' && ['h2', 'h3'].includes(node.tag) ? [{ id: node.attrs.id, title: noteText(node) }] : []);
  const contents = headings.map((heading) => <a key={heading.id} href={`#${heading.id}`}>{heading.title}</a>);
  return <main className="reader-container"><nav className="reader-bar"><Link href="/practice/oops/notes"><ArrowLeft size={17} />All lessons</Link><div><ReadingTools chapter={chapter} subject="oops" />{entry.count > 0 && <Link className="reader-button" href={`/practice/oops?chapter=${chapter}`}>Practise lesson<ArrowRight size={16} /></Link>}</div></nav>
    <div className="reading-layout"><aside className="reading-sidebar"><p className="reader-eyebrow">Lesson {index + 1} / {oopChapters.length}</p><nav className="desktop-contents" aria-label="On this page">{contents}</nav><details className="mobile-contents"><summary>On this page</summary><nav aria-label="On this page">{contents}</nav></details><Link href="/practice/oops/notes/sources">Source notes & corrections</Link></aside>
      <article id="oops-note" className="note-body"><NoteContent nodes={note.content} /><section className="source"><h2>Original notes pages</h2><p>{entry.pages.map((page, i) => <span key={page}>{i ? ', ' : ''}<Link href={`/practice/oops/notes/original/${page}`}>Page {page}</Link></span>)}</p><p>The lesson expands and corrects the supplied notes. Original pages remain unchanged for comparison.</p></section></article></div>
    <nav className="chapter-pagination" aria-label="Lesson navigation">{previous ? <Link className="reader-button" href={`/practice/oops/notes/${previous.key}`}><ArrowLeft size={16} />{previous.title}</Link> : <span />}{next && <Link className="reader-button" href={`/practice/oops/notes/${next.key}`}>{next.title}<ArrowRight size={16} /></Link>}</nav>
  </main>;
}
