"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Search } from "lucide-react";
import chapters from "@/content/history/chapters.json";

export default function HistoryCatalog() {
  const [search, setSearch] = useState("");
  const [continueKey, setContinueKey] = useState("");
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem("history-reading-v1") || "null"); if (chapters.some((chapter) => chapter.key === saved?.chapter)) setContinueKey(saved.chapter); } catch { /* A fresh browser starts without a reading bookmark. */ }
  }, []);
  const filtered = chapters.filter((chapter) => `${chapter.title} ${chapter.name} ${chapter.subtopics.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <section aria-labelledby="chapter-list">
    <div className="catalog-heading"><h2 id="chapter-list">Chapters</h2>{continueKey && <Link className="reader-button" prefetch={false} href={`/practice/history/notes/${continueKey}`}><BookOpen size={16} />Continue reading</Link>}</div>
    <label className="chapter-search"><Search size={18} /><span className="sr-only">Search chapters</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chapters, people or events" /></label>
    <p className="reader-muted" role="status">{filtered.length} of {chapters.length} chapters</p>
    <ol className="chapter-list">{filtered.map((chapter) => <li key={chapter.key}>
      <span className="chapter-number">{String(chapter.number).padStart(2, "0")}</span>
      <div><h3 lang="hi"><Link prefetch={false} href={`/practice/history/notes/${chapter.key}`}>{chapter.title}</Link></h3><p>{chapter.name.replace(/^\d+\. /, "")}</p><small>{chapter.count} questions</small></div>
      <nav aria-label={`Chapter ${chapter.number}`}><Link className="reader-button" prefetch={false} href={`/practice/history/notes/${chapter.key}`}>Read notes <BookOpen size={16} /></Link><Link className="reader-button" prefetch={false} href={`/practice/history?chapter=${chapter.key}`}>Practise <ArrowRight size={16} /></Link></nav>
    </li>)}</ol>
    {!filtered.length && <p>No chapters match your search.</p>}
  </section>;
}
