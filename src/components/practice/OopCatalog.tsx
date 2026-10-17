'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import chapters from '@/content/oops/chapters.json';

export default function OopCatalog() {
  const [query, setQuery] = useState('');
  const [resume, setResume] = useState('');
  useEffect(() => { try { setResume(JSON.parse(localStorage.getItem('oops-reading-v1') || 'null')?.chapter || ''); } catch { /* Reading remains available without storage. */ } }, []);
  const last = chapters.find((chapter) => chapter.key === resume);
  const matches = chapters.filter((chapter) => `${chapter.title} ${chapter.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <section>
    <div className="catalog-heading"><h2>Lessons</h2>{last && <Link className="reader-button" href={`/practice/oops/notes/${last.key}`}>Continue: {last.title}<ArrowRight size={16} /></Link>}</div>
    <label className="chapter-search"><Search size={19} /><input aria-label="Search OOP lessons" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search classes, constructors, pointers..." /></label>
    <p className="reader-muted">{matches.length} of {chapters.length} lessons</p>
    <ol className="chapter-list">{matches.map((chapter) => <li key={chapter.key}><span className="chapter-number">{String(chapter.number).padStart(2, '0')}</span><div><h3><Link href={`/practice/oops/notes/${chapter.key}`}>{chapter.title}</Link></h3><p>{chapter.summary}</p><small>{chapter.count} assignment questions</small></div><nav><Link className="reader-button" href={`/practice/oops/notes/${chapter.key}`}>Read</Link>{chapter.count > 0 && <Link className="reader-button" href={`/practice/oops?chapter=${chapter.key}`}>Practise</Link>}</nav></li>)}</ol>
    {!matches.length && <p>No matching lessons.</p>}
  </section>;
}
