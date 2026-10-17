import { getSql } from './db';
import chapters from '@/content/oops/chapters.json';
import type { HistoryNote } from './history-notes';

export { chapters as oopChapters };
export async function getOopNote(id: string): Promise<HistoryNote | null> {
  if (!chapters.some((chapter) => chapter.key === id)) return null;
  const [row] = await getSql()`SELECT id, title, content FROM practice_notes WHERE subject = 'oops' AND id = ${id}` as HistoryNote[];
  return row || null;
}
