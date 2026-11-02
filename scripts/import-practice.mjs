import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

export function validateQuestionBank(questions) {
  if (!Array.isArray(questions) || !questions.length) throw new Error("Expected a non-empty question array.");
  const ids = new Set();
  for (const q of questions) {
    if (!q || typeof q.id !== "string" || !q.id.trim() || ids.has(q.id) ||
      !["topic", "subtopic", "q", "exp", "type"].every((key) => typeof q[key] === "string" && q[key].trim()) ||
      !Array.isArray(q.opts) || q.opts.length !== 5 || !q.opts.every((value) => typeof value === "string" && value.trim()) ||
      !/^[ABCDE]$/.test(q.ans) || ![1, 2, 3].includes(q.level) ||
      q.why !== undefined && (!Array.isArray(q.why) || q.why.length !== 5 || !q.why.every((value) => typeof value === "string" && value.trim())) ||
      ["concept", "code", "work", "tip"].some((key) => q[key] !== undefined && typeof q[key] !== "string") ||
      q.unscored !== undefined && typeof q.unscored !== "boolean") throw new Error(`Invalid question: ${q?.id}`);
    ids.add(q.id);
  }
  return questions;
}

export async function importQuestionBank(sql, subject, questions) {
  if (typeof subject !== "string" || subject.length > 80 || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(subject)?.[0] !== subject) throw new Error("Use a subject slug such as computer-fundamentals.");
  validateQuestionBank(questions);
  const ids = questions.map((q) => q.id);
  const [removed] = await sql`SELECT count(*)::int AS count FROM practice_questions WHERE subject = ${subject} AND NOT (id = ANY(${ids}::text[]))`;
  if (removed.count) throw new Error("This bank omits existing questions. Import the complete bank so saved sessions stay valid.");
  const items = questions.map((data, position) => ({ id: data.id, position, data }));
  await sql.transaction([
    sql`INSERT INTO practice_questions (subject, id, position, data)
      SELECT ${subject}, id, position, data
      FROM jsonb_to_recordset(${JSON.stringify(items)}::jsonb) AS items(id TEXT, position INT, data JSONB)
      ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data`,
  ]);
  const rows = await sql`SELECT data FROM practice_questions WHERE subject = ${subject} ORDER BY position, id`;
  if (!isDeepStrictEqual(rows.map((row) => row.data), questions)) throw new Error("Database verification failed: imported bank does not match the source.");
  return rows.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [subject, file, ...extra] = process.argv.slice(2);
  if (!subject || !file || extra.length) throw new Error("Usage: npm run db:import -- <subject-slug> <questions.json>");
  const questions = validateQuestionBank(JSON.parse(await readFile(resolve(file), "utf8")));
  nextEnv.loadEnvConfig(fileURLToPath(new URL("..", import.meta.url)));
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const count = await importQuestionBank(neon(process.env.DATABASE_URL), subject, questions);
  console.log(`Imported and verified ${count} questions for ${subject}. The subject and topics are discovered automatically; no page or configuration changes are needed. Existing saves and other subjects are preserved.`);
}
