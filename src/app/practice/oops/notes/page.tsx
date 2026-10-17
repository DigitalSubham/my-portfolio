import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import NoteContent from '@/components/practice/NoteContent';
import ReadingTools from '@/components/practice/ReadingTools';
import { getCompleteOopNotes, oopChapters } from '@/lib/oop-notes';
import { continuousNoteContent } from '@/lib/continuous-notes';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Complete OOP & Language Foundations Notes', alternates: { canonical: '/practice/oops/notes' } };
export default async function OopNotes() {
  const notes = await getCompleteOopNotes();
  const contents = oopChapters.map((topic) => <a key={topic.key} href={`#${topic.key}`}>{topic.title}</a>);
  return <main className="reader-container"><nav className="reader-bar"><Link href="/practice"><ArrowLeft size={17} />Practice subjects</Link><div><ReadingTools chapter="complete" subject="oops" /><Link className="reader-button" href="/practice/oops">Question bank<ArrowRight size={17} /></Link></div></nav>
    <header className="reader-heading"><p className="reader-eyebrow">BPSC TRE · Computer Science</p><h1>OOP &amp; Language Foundations</h1><p>Complete notes with Python and JavaScript comparisons, C, C++ and Java foundations, and 51 worked examples.</p></header>
    <div className="reading-layout"><aside className="reading-sidebar"><p className="reader-eyebrow">Contents</p><nav className="desktop-contents" aria-label="Notes contents">{contents}</nav><details className="mobile-contents"><summary>Contents</summary><nav aria-label="Notes contents">{contents}</nav></details></aside>
      <article id="oops-note" className="note-body">{notes.map((note) => <section className="oop-topic" id={note.id} key={note.id}><NoteContent nodes={continuousNoteContent(note.content, note.id)} /></section>)}</article>
    </div>
    <footer className="source-disclosure"><Link href="/practice/oops/notes/sources">Answer corrections and PDF downloads</Link></footer>
  </main>;
}
