import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import OopCatalog from '@/components/practice/OopCatalog';

export const metadata: Metadata = { title: 'OOP Notes: A Python-to-C, C++ and Java Learning Path', alternates: { canonical: '/practice/oops/notes' } };
export default function OopNotes() {
  return <main className="reader-container"><nav className="reader-bar"><Link href="/practice"><ArrowLeft size={17} />Practice subjects</Link><Link className="reader-button" href="/practice/oops">Question bank<ArrowRight size={17} /></Link></nav>
    <header className="reader-heading"><p className="reader-eyebrow">BPSC TRE · Computer Science</p><h1>OOP, one concept at a time</h1><p>Start with the Python and JavaScript you know. Learn to read C, C++ and Java, then work through objects, inheritance, polymorphism and exam-style code.</p><p className="reader-muted">20 lessons · 51 worked examples · 199 original assignment questions</p></header>
    <OopCatalog />
    <div className="source-disclosure"><Link href="/practice/oops/notes/sources">Original PDFs, page coverage and answer corrections</Link><p className="reader-muted">All 45 original notes pages and both assignments are retained. Assignment 1 skips printed question 99. Its key numbered 99 corresponds to printed question 98.</p></div>
  </main>;
}
