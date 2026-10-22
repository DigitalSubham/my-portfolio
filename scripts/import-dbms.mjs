import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';

const root = fileURLToPath(new URL('..', import.meta.url));
const input = process.argv.slice(2).find((arg) => arg !== '--database');
const seed = join(root, 'db/seeds/dbms-questions.json');
const raw = await readFile(input ? resolve(input) : seed);
const questions = JSON.parse(raw.toString('utf8'));
if (!Array.isArray(questions) || !questions.length) throw new Error('Expected a non-empty question array.');
const ids = new Set();
const topics = [];
for (const q of questions) {
  if (!q || typeof q.id !== 'string' || ids.has(q.id) ||
      !['topic', 'subtopic', 'q', 'exp', 'concept', 'type'].every((key) => typeof q[key] === 'string' && q[key].trim()) ||
      !Array.isArray(q.opts) || q.opts.length !== 5 || !q.opts.every((v) => typeof v === 'string' && v.trim()) ||
      !Array.isArray(q.why) || q.why.length !== 5 || !q.why.every((v) => typeof v === 'string' && v.trim()) ||
      !/^[ABCDE]$/.test(q.ans) || ![1, 2, 3].includes(q.level) ||
      ['code', 'work', 'tip'].some((key) => q[key] !== undefined && typeof q[key] !== 'string')) throw new Error(`Invalid question: ${q?.id}`);
  ids.add(q.id);
  let topic = topics.find((topic) => topic.name === q.topic);
  if (!topic) {
    const prefix = q.id.split('-')[0].toLowerCase();
    const key = q.topic === 'Past Papers (TRE 1-3)' ? 'pyq' : prefix;
    if (!/^[a-z][a-z0-9-]*$/.test(key) || topics.some((topic) => topic.key === key)) throw new Error(`Topic key collision: ${q.topic}`);
    topic = { key, name: q.topic, label: q.topic, count: 0 };
    topics.push(topic);
  }
  topic.count++;
}
await mkdir(join(root, 'src/content/dbms'), { recursive: true });
await writeFile(seed, raw);
await writeFile(join(root, 'src/content/dbms/topics.json'), JSON.stringify(topics, null, 2) + '\n');
await writeFile(join(root, 'src/content/dbms/import-audit.json'), JSON.stringify({ count: questions.length, topics: topics.length, sourceSha256: createHash('sha256').update(raw).digest('hex') }, null, 2) + '\n');
console.log(`Prepared ${questions.length} unchanged questions across ${topics.length} DBMS topics.`);
if (!process.argv.includes('--database')) process.exit(0);
nextEnv.loadEnvConfig(root);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql = neon(process.env.DATABASE_URL);
await sql.transaction([
  sql`INSERT INTO practice_questions (subject, id, position, data)
    SELECT 'dbms', id, position, data FROM jsonb_to_recordset(${JSON.stringify(questions.map((data, position) => ({ id: data.id, position, data })))}::jsonb) AS items(id TEXT, position INT, data JSONB)
    ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data`,
]);
const rows = await sql`SELECT data FROM practice_questions WHERE subject = 'dbms' ORDER BY position, id`;
if (!isDeepStrictEqual(rows.map((row) => row.data), questions)) throw new Error('Database verification failed: DBMS bank does not match the source.');
console.log(`Imported and verified all ${rows.length} DBMS questions. Existing subjects and saves preserved.`);
