import type { Metadata } from 'next';
import Link from 'next/link';
import chapters from '@/content/oops/chapters.json';
import questions from '../../../../../../db/seeds/oops-questions.json';

export const metadata: Metadata = { title: 'OOP Sources, Coverage & Corrections', alternates: { canonical: '/practice/oops/notes/sources' } };
const references = [
  ['C++17: constructors', 'https://timsong-cpp.github.io/cppwp/n4659/class.ctor'],
  ['C++17: virtual functions', 'https://timsong-cpp.github.io/cppwp/n4659/class.virtual'],
  ['C++17: destruction', 'https://timsong-cpp.github.io/cppwp/n4659/class.dtor'],
  ['C++17: evaluation and undefined behaviour', 'https://timsong-cpp.github.io/cppwp/n4659/intro.execution'],
  ['Java 17: classes and methods', 'https://docs.oracle.com/javase/specs/jls/se17/html/jls-8.html'],
  ['Java 17: interfaces', 'https://docs.oracle.com/javase/specs/jls/se17/html/jls-9.html'],
  ['Python: classes', 'https://docs.python.org/3.12/tutorial/classes.html'],
  ['Python: abstract base classes', 'https://docs.python.org/3/library/abc.html'],
];
export default function OopSources() {
  const reviewed = questions.filter((q) => q.unscored || q.ans !== q.source.answer || q.source.keyNumber !== q.source.number);
  return <main className="reader-container"><nav className="reader-bar"><Link href="/practice/oops/notes">Back to lessons</Link><Link href="/practice/oops">Practise</Link></nav><article className="note-body"><h1>Sources, coverage and corrections</h1>
    <p>The three supplied Infeepedia PDFs are preserved unchanged below. The web lessons explain the same topic areas in a new learning order and add foundations for readers who know Python and JavaScript. Source statements and answer keys can contain errors; use the reviewed explanation alongside the original.</p>
    <ul><li><a href="/study/oops/notes.pdf" download>Complete original notes · 45 pages</a></li><li><a href="/study/oops/assignment-1.pdf" download>Assignment 1 · 20 pages · 99 printed questions</a></li><li><a href="/study/oops/assignment-2.pdf" download>Assignment 2 · 28 pages · 100 printed questions</a></li></ul>
    <p>All 199 printed questions, including duplicates, retain their wording, choices, source page and number. Assignment 1 has no printed question 99. Its answer-key entry 99 matches printed question 98 (const member-function overloading); this mapping is explicit. No missing question has been invented.</p>
    <p>There are {questions.filter((q) => !q.unscored).length} scored questions and {questions.filter((q) => q.unscored).length} review-only questions. The latter remain in topic practice but do not enter timed tests, accuracy or wrong-answer lists. These assignments are not represented as official BPSC papers or official answer keys.</p>
    <h2>Original page coverage</h2><p>Every notes page is available as a readable image, including the original diagrams and tables. Links beside it identify the related rewritten lessons.</p>
    <div className="table-scroll"><table><thead><tr><th>Original page</th><th>Related lessons</th></tr></thead><tbody>{Array.from({ length: 45 }, (_, i) => i + 1).map((page) => <tr key={page}><td><Link href={`/practice/oops/notes/original/${page}`}>Page {page}</Link></td><td>{chapters.filter((chapter) => chapter.pages.includes(page)).map((chapter, i) => <span key={chapter.key}>{i ? ' · ' : ''}<Link href={`/practice/oops/notes/${chapter.key}`}>{chapter.title}</Link></span>)}</td></tr>)}</tbody></table></div>
    <h2>Assignment corrections and ambiguous items</h2><p>Open an entry to compare the supplied key with the review. Every other question also includes its original key after you answer.</p>
    {reviewed.map((q) => <details key={q.id} className="source-key"><summary>Assignment {q.source.document.slice(-1)}, Q{q.source.number}: {q.unscored ? 'review only' : `key ${q.source.answer}, reviewed ${q.ans}`}</summary><p>{q.q}</p><p>{q.exp}</p><p><Link href={q.noteHref}>Related lesson</Link> · <a href={`/study/oops/${q.source.document}.pdf#page=${q.source.pages[0]}`} target="_blank" rel="noopener noreferrer">Original page</a></p></details>)}
    <h2>Language references</h2><p>The teaching baseline is C17, C++17 and Java 17, with Python 3 comparisons. The 51 complete worked examples have automated output or expected-compilation-error checks. Syntax fragments and intentionally undefined assignment expressions are not claimed to produce a portable output.</p><ul>{references.map(([title, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer">{title}</a></li>)}</ul>
  </article></main>;
}
