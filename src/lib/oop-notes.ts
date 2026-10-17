import { getSql } from './db';
import chapters from '@/content/oops/chapters.json';
import type { HistoryNote } from './history-notes';

export { chapters as oopChapters };
export async function getCompleteOopNotes(): Promise<HistoryNote[]> {
  const rows = await getSql()`SELECT id, title, content FROM practice_notes WHERE subject = 'oops' ORDER BY position, id` as HistoryNote[];
  const byId = new Map(rows.map((row) => [row.id, row]));
  return chapters.map((chapter) => {
    const note = byId.get(chapter.key);
    if (!note) throw new Error(`OOP notes are incomplete: ${chapter.key}`);
    return note;
  });
}
