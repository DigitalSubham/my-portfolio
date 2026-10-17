import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import HistoryCatalog from "@/components/practice/HistoryCatalog";
import NoteContent from "@/components/practice/NoteContent";
import { getHistoryNote } from "@/lib/history-notes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bihar History & Indian National Movement Notes", description: "24 chapters of Hindi history notes with English meanings, timelines and revision tables.", alternates: { canonical: "/practice/history/notes" } };

export default async function HistoryNotesPage() {
  const intro = await getHistoryNote("introduction");
  return <main className="reader-container">
    <nav className="reader-bar"><Link href="/practice"><ArrowLeft size={17} />All subjects</Link><div><Link className="reader-button" href="/practice/history">Practise <ArrowRight size={16} /></Link><a className="reader-button" href="/study/history/complete-notes-hindi.pdf" download><Download size={16} />Download PDF</a></div></nav>
    <header className="reader-heading"><p className="reader-eyebrow">BPSC · History · Notes</p><h1>Bihar History & Indian National Movement</h1><p className="reader-muted">24 chapters · Hindi notes with English meanings · 880 English practice questions</p></header>
    <HistoryCatalog />
    <details className="source-disclosure"><summary>About this study pack · अध्ययन सामग्री के बारे में</summary><div className="note-body" lang="hi">{intro && <NoteContent nodes={intro.content} />}</div></details>
    <Link className="reader-button" href="/practice/history/notes/sources">Source notes, coverage and corrections <ArrowRight size={16} /></Link>
  </main>;
}
