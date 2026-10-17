import { getSql } from "./db";
import chapters from "@/content/history/chapters.json";

export { chapters as historyChapters };
export type NoteNode = string | { tag: string; attrs: Record<string, string>; children: NoteNode[] };
export type HistoryNote = { id: string; title: string; content: NoteNode[] };

export async function getCompleteHistoryNotes(): Promise<HistoryNote[]> {
  const rows = await getSql()`SELECT id, title, content FROM practice_notes WHERE subject = 'history' ORDER BY position, id` as HistoryNote[];
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ['introduction', ...chapters.map((chapter) => chapter.key)].map((id) => {
    const note = byId.get(id);
    if (!note) throw new Error(`History notes are incomplete: ${id}`);
    return note;
  });
}

export async function getHistoryNote(id: string): Promise<HistoryNote | null> {
  if (!["introduction", "sources", ...chapters.map((chapter) => chapter.key)].includes(id)) return null;
  const [row] = await getSql()`SELECT id, title, content FROM practice_notes WHERE subject = 'history' AND id = ${id}` as HistoryNote[];
  return row || null;
}

export function noteText(node: NoteNode): string {
  return typeof node === "string" ? node : node.children.map(noteText).join("");
}

export function noteHref(href: string) {
  if (/^#chapter-\d+$/.test(href)) return `/practice/history/notes#chapter-${href.slice(9).padStart(2, "0")}`;
  if (href === "#coverage") return "/practice/history/notes/sources";
  return /^(https?:\/\/|#)/.test(href) ? href : undefined;
}
