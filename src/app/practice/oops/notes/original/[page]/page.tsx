import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pages from '@/content/oops/pages.json';
import chapters from '@/content/oops/chapters.json';

export default async function OriginalNote({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const entry = pages.find((entry) => String(entry.number) === page);
  if (!entry) notFound();
  return <main className="reader-container"><nav className="reader-bar"><Link href="/practice/oops/notes/sources">All source pages</Link><a href={`/study/oops/notes.pdf#page=${page}`}>Open original PDF</a></nav><header className="reader-heading"><h1>Original notes · page {page}</h1><p>Unedited source page. Read the related lesson for explanations and corrections.</p><p>{chapters.filter((chapter) => chapter.pages.includes(entry.number)).map((chapter, index) => <span key={chapter.key}>{index ? ' · ' : ''}<Link href={`/practice/oops/notes/${chapter.key}`}>{chapter.title}</Link></span>)}</p></header>
    <Image className="source-page-image" src={`/study/oops/pages/${page}.webp`} width={entry.width} height={entry.height} alt={`Original OOP notes, page ${page}. Full text and diagrams are also available in the linked PDF.`} unoptimized />
    <nav className="chapter-pagination" aria-label="Original page navigation">{entry.number > 1 ? <Link className="reader-button" href={`/practice/oops/notes/original/${entry.number - 1}`}>Previous page</Link> : <span />}{entry.number < 45 && <Link className="reader-button" href={`/practice/oops/notes/original/${entry.number + 1}`}>Next page</Link>}</nav></main>;
}
