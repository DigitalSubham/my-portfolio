import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import NoteContent from "@/components/practice/NoteContent";
import ReadingTools from "@/components/practice/ReadingTools";
import { getCompleteHistoryNotes, historyChapters } from "@/lib/history-notes";
import { continuousNoteContent } from "@/lib/continuous-notes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Complete Bihar History & Indian National Movement Notes", description: "Complete Hindi history notes with English meanings, timelines and revision tables on one page.", alternates: { canonical: "/practice/history/notes" } };

export default async function HistoryNotesPage() {
  const notes = await getCompleteHistoryNotes();
  const contents = historyChapters.map((topic) => <a key={topic.key} href={`#${topic.key}`} lang="hi">{topic.title}</a>);
  return <main className="reader-container">
    <nav className="reader-bar"><Link href="/practice"><ArrowLeft size={17} />All subjects</Link><div><ReadingTools chapter="complete" /><Link className="reader-button" href="/practice/history">Practise <ArrowRight size={16} /></Link><a className="reader-icon" href="/study/history/complete-notes-hindi.pdf" download title="Download complete PDF" aria-label="Download complete PDF"><Download size={16} /></a></div></nav>
    <header className="reader-heading"><p className="reader-eyebrow">BPSC · History · Notes</p><h1>Bihar History &amp; Indian National Movement</h1><p className="reader-muted">Complete Hindi notes with English meanings, timelines and revision tables.</p></header>
    <div className="reading-layout"><aside className="reading-sidebar"><p className="reader-eyebrow">Contents · विषय सूची</p><nav className="desktop-contents" aria-label="Notes contents">{contents}</nav><details className="mobile-contents"><summary>Contents · विषय सूची</summary><nav aria-label="Notes contents">{contents}</nav></details></aside>
      <article id="history-note" className="note-body" lang="hi">{notes.map((note) => <section className="continuous-topic" id={note.id} key={note.id}><NoteContent nodes={continuousNoteContent(note.content, note.id)} /></section>)}</article>
    </div>
    <footer className="source-disclosure"><Link href="/practice/history/notes/sources">Source notes, coverage and corrections <ArrowRight size={16} /></Link></footer>
  </main>;
}
