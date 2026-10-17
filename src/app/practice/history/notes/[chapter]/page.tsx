import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import NoteContent from "@/components/practice/NoteContent";
import ReadingTools from "@/components/practice/ReadingTools";
import { getHistoryNote, historyChapters, noteText } from "@/lib/history-notes";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ chapter: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapter } = await params;
  const entry = historyChapters.find((item) => item.key === chapter);
  return { title: entry?.title || "History Sources & Corrections", alternates: { canonical: `/practice/history/notes/${chapter}` } };
}

export default async function HistoryChapterPage({ params }: Props) {
  const { chapter } = await params;
  const index = historyChapters.findIndex((item) => item.key === chapter);
  if (index >= 0) permanentRedirect(`/practice/history/notes#${chapter}`);
  if (index < 0 && chapter !== "sources") notFound();
  const note = await getHistoryNote(chapter);
  if (!note) notFound();
  const headings = note.content.flatMap((node) => typeof node !== "string" && ["h2", "h3"].includes(node.tag) ? [{ id: node.attrs.id, title: noteText(node) }] : []);
  return <main className="reader-container">
    <nav className="reader-bar"><Link href="/practice/history/notes"><ArrowLeft size={17} />Complete notes</Link><div><ReadingTools chapter={chapter} /><a className="reader-icon" href="/study/history/complete-notes-hindi.pdf" download title="Download complete PDF" aria-label="Download complete PDF"><Download size={18} /></a></div></nav>
    <div className="reading-layout"><aside className="reading-sidebar"><p className="reader-eyebrow">Source notes</p><p className="reader-muted">Coverage, corrections and source limits</p><nav className="desktop-contents" aria-label="On this page">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} lang="hi">{heading.title}</a>)}</nav><details className="mobile-contents"><summary>On this page · इस अध्याय में</summary><nav aria-label="On this page">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} lang="hi">{heading.title}</a>)}</nav></details></aside>
      <article id="history-note" className="note-body" lang="hi"><NoteContent nodes={note.content} />
        {chapter === "sources" && <section lang="en"><h2>Source files</h2><p><a href="/study/history/coverage-and-corrections.md" download>Coverage and corrections</a> · <a href="/study/history/source-mcq-coverage.json" download>Source question reconciliation</a></p><p>200 source items mapped to practice questions; 6 uncertain items are not scored; 75 items are outside this history pack. The practice bank contains 880 questions. These categories are not additional scored questions.</p></section>}
      </article>
    </div>
  </main>;
}
