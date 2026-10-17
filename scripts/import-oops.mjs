import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import nextEnv from '@next/env';
import { lessons } from '../src/content/oops/lessons.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const sources = JSON.parse(await readFile(join(root, 'db/seeds/oops-source.json'), 'utf8'));
const reviews = JSON.parse(await readFile(join(root, 'src/content/oops/reviews.json'), 'utf8'));
const questions = [];
for (const document of sources.slice(1)) {
  for (const original of document.questions) {
    const id = `A${document.id.slice(-1)}-${String(original.number).padStart(3, '0')}`;
    const review = reviews[id];
    if (!review) throw new Error(`Missing review: ${id}`);
    const lesson = lessons.find((entry) => entry.key === review[1]);
    const markers = [...original.text.matchAll(/^\s*([A-E])[).]\s*/gm)];
    if (!lesson || markers.map((m) => m[1]).join('') !== 'ABCDE') throw new Error(`Invalid topic/options: ${id}`);
    let stem = original.text.slice(0, markers[0].index).trim();
    const wrappedComments = {
      'A2-039': ['instance of an\nabstract class', 'instance of an abstract class'],
      'A2-040': ['instantiate Derived\nwithout overriding', 'instantiate Derived without overriding'],
      'A2-042': ['scope resolution\nhere', 'scope resolution here'],
    };
    const wrap = wrappedComments[id];
    if (wrap) {
      if (!stem.includes(wrap[0])) throw new Error(`Comment-wrap source changed: ${id}`);
      stem = stem.replace(wrap[0], wrap[1]);
    }
    if (id === 'A1-081') stem = stem.replace('\nThe above program violates the feature of', '');
    const opts = markers.map((m, index) => original.text.slice(m.index + m[0].length, markers[index + 1]?.index).trim());
    const codeStart = stem.search(/^(?:#\s*include|(?:public\s+)?class\s+\w+\s*[{:]|using namespace|int main\s*\()/m);
    const keyNumber = id === 'A1-098' ? 99 : original.number;
    const sourceAnswer = document.answers.find((entry) => entry.number === keyNumber);
    if (!sourceAnswer || opts.some((value) => !value)) throw new Error(`Incomplete question: ${id}`);
    questions.push({
      id: `OOP-${id}`, topic: lesson.title, subtopic: `Assignment ${document.id.slice(-1)}`,
      q: (codeStart > 0 ? stem.slice(0, codeStart).trim() : stem) + (id === 'A1-081' ? '\nThe above program violates the feature of' : ''),
      ...(codeStart > 0 ? { code: stem.slice(codeStart) } : {}),
      opts, ans: review[0] || sourceAnswer.answer, unscored: review[0] === null,
      exp: review[2], concept: lesson.summary, level: codeStart >= 0 ? 2 : 1,
      type: codeStart >= 0 ? 'code' : 'concept', noteHref: `/practice/oops/notes#${lesson.key}`,
      ...(wrap ? { transcriptionNote: 'The PDF wraps a // comment onto the next printed line. It is joined here so the comment remains a comment; no executable statement was changed.' } : {}),
      source: { document: document.id, number: original.number, pages: original.pages, keyNumber, answer: sourceAnswer.answer, explanation: sourceAnswer.text, originalText: original.text },
    });
  }
}
if (questions.length !== 199 || Object.keys(reviews).length !== questions.length) throw new Error('Incomplete question coverage');
const chapters = lessons.map((lesson, index) => ({ key: lesson.key, number: index + 1, title: lesson.title, summary: lesson.summary, pages: lesson.pages, count: questions.filter((q) => q.topic === lesson.title).length }));
const covered = new Set(chapters.flatMap((chapter) => chapter.pages));
if (covered.size !== 45) throw new Error(`Missing notes pages: ${Array.from({ length: 45 }, (_, i) => i + 1).filter((p) => !covered.has(p))}`);
const documents = lessons.map((lesson, index) => {
  let heading = 0;
  const content = structuredClone(lesson.content);
  for (const node of content) if (['h2', 'h3'].includes(node.tag)) node.attrs.id ||= `section-${++heading}`;
  return { id: lesson.key, position: index, title: lesson.title, content };
});
await mkdir(join(root, 'public/study/oops'), { recursive: true });
for (const source of sources) {
  const path = join(homedir(), 'Downloads', source.filename);
  if (createHash('sha256').update(await readFile(path)).digest('hex') !== source.sha256) throw new Error(`Source changed: ${source.id}`);
  await copyFile(path, join(root, 'public/study/oops', `${source.id}.pdf`));
}
for (const [path, data] of [['src/content/oops/chapters.json', chapters], ['db/seeds/oops-questions.json', questions], ['db/seeds/oops-notes.json', documents]]) await writeFile(join(root, path), JSON.stringify(data, null, 2) + '\n');
console.log(`Prepared ${chapters.length} lessons, ${questions.length} questions (${questions.filter((q) => q.unscored).length} review-only).`);
if (!process.argv.includes('--database')) process.exit(0);
nextEnv.loadEnvConfig(root);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const sql = neon(process.env.DATABASE_URL);
await sql.transaction([
  sql`INSERT INTO practice_questions (subject, id, position, data)
    SELECT 'oops', id, position, data FROM jsonb_to_recordset(${JSON.stringify(questions.map((data, position) => ({ id: data.id, position, data })))}::jsonb) AS items(id TEXT, position INT, data JSONB)
    ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data`,
  sql`INSERT INTO practice_notes (subject, id, position, title, content)
    SELECT 'oops', id, position, title, content FROM jsonb_to_recordset(${JSON.stringify(documents)}::jsonb) AS items(id TEXT, position INT, title TEXT, content JSONB)
    ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, title = EXCLUDED.title, content = EXCLUDED.content`,
]);
console.log('OOP lessons and questions imported. Other subjects and saved progress preserved.');
