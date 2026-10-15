import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(fileURLToPath(new URL("..", import.meta.url)));
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL("../db/practice.sql", import.meta.url), "utf8");
for (const statement of schema.split(";").map((part) => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}
const bank = JSON.parse(await readFile(new URL("../db/seeds/dsa-questions.json", import.meta.url), "utf8"));
if (!Array.isArray(bank) || bank.length !== new Set(bank.map((question) => question.id)).size) {
  throw new Error("Question IDs must be unique.");
}
// Rerunning the import preserves questions edited in the database and all saved sessions.
for (let offset = 0; offset < bank.length; offset += 100) {
  const batch = bank.slice(offset, offset + 100).map((data, index) => ({ id: data.id, position: offset + index, data }));
  await sql`
    INSERT INTO practice_questions (subject, id, position, data)
    SELECT 'dsa', id, position, data
    FROM jsonb_to_recordset(${JSON.stringify(batch)}::jsonb) AS items(id TEXT, position INTEGER, data JSONB)
    ON CONFLICT (subject, id) DO NOTHING
  `;
}
const [result] = await sql`SELECT count(*) AS count FROM practice_questions WHERE subject = 'dsa'`;
console.log(`Practice database ready: ${result.count} DSA questions. Existing saves preserved.`);
