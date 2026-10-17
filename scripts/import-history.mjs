import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { neon } from "@neondatabase/serverless";
import nextEnv from "@next/env";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("..", import.meta.url));
nextEnv.loadEnvConfig(root);
const folder = process.argv[2];
if (!folder || !process.env.DATABASE_URL) throw new Error("Usage: npm run db:history -- <study-pack-folder>, with DATABASE_URL configured.");
const source = resolve(folder);
const questions = JSON.parse(await readFile(join(source, "BPSC_History_Practice_English.json"), "utf8"));
const coverage = JSON.parse(await readFile(join(source, "BPSC_Source_MCQ_Coverage.json"), "utf8"));
const ids = new Set();
for (const q of questions) {
  if (!q.id || ids.has(q.id) || !q.topic || !q.subtopic || !q.q || !q.exp || !q.concept || q.opts?.length !== 5 || q.why?.length !== 5 || !/^[ABCDE]$/.test(q.ans) || ![1, 2, 3].includes(q.level)) throw new Error(`Invalid question: ${q.id}`);
  ids.add(q.id);
}
for (const item of coverage) for (const id of item.question_ids || []) if (!ids.has(id)) throw new Error(`Missing source mapping: ${id}`);
const document = parse(await readFile(join(source, "BPSC_Complete_Notes_Hindi.html"), "utf8"));
const find = (node, tag) => node.tagName === tag ? node : node.childNodes?.map((child) => find(child, tag)).find(Boolean);
const text = (node) => node.value || (node.childNodes || []).map(text).join("");
const attrs = (node) => Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
const main = find(document, "main");
const allowed = new Set(["p", "h1", "h2", "h3", "b", "strong", "span", "table", "thead", "tr", "th", "tbody", "td", "aside", "ul", "li", "i", "div", "br", "a"]);
function convert(node) {
  if (node.nodeName === "#text") return node.value;
  if (!allowed.has(node.tagName)) throw new Error(`Unexpected notes element: ${node.tagName || node.nodeName}`);
  const attributes = {};
  for (const [key, value] of Object.entries(attrs(node))) {
    if (!["class", "href", "scope", "id", "lang"].includes(key)) throw new Error(`Unexpected notes attribute: ${key}`);
    if (key === "href" && !/^(https?:\/\/|#)/.test(value)) throw new Error(`Unsafe link: ${value}`);
    attributes[key] = value;
  }
  return { tag: node.tagName, attrs: attributes, children: (node.childNodes || []).map(convert) };
}
const articles = main.childNodes.filter((node) => node.tagName === "article");
const chapters = articles.map((article, index) => {
  const number = index + 1, key = `chapter-${String(number).padStart(2, "0")}`;
  const matches = questions.filter((q) => q.topic.startsWith(`${String(number).padStart(2, "0")}. `));
  if (!matches.length || new Set(matches.map((q) => q.topic)).size !== 1 || attrs(article).id !== `chapter-${number}`) throw new Error(`Chapter alignment failed: ${number}`);
  return { number, key, title: text(find(article, "h1")), name: matches[0].topic, count: matches.length, subtopics: [...new Set(matches.map((q) => q.subtopic))] };
});
if (chapters.length !== 24 || chapters.reduce((sum, chapter) => sum + chapter.count, 0) !== questions.length) throw new Error("Incomplete chapter or question coverage.");
const documents = [...articles.map((article, index) => ({ id: chapters[index].key, title: chapters[index].title, position: index + 1, content: article.childNodes.map(convert) })),
  { id: "introduction", title: "बिहार इतिहास और भारतीय राष्ट्रीय आंदोलन", position: 0, content: find(main, "header").childNodes.map(convert) },
  { id: "sources", title: "विषय मिलान और स्रोत-जाँच", position: 25, content: find(main, "footer").childNodes.map(convert) }];
const sourceNodes = [...articles, find(main, "header"), find(main, "footer")];
const hash = (value) => createHash("sha256").update(value).digest("hex");
const audit = {
  questionHash: hash(JSON.stringify(questions)),
  pdfHash: hash(await readFile(join(source, "BPSC_Complete_Notes_Hindi.pdf"))),
  documents: documents.map((doc, index) => ({ id: doc.id, textHash: hash(text(sourceNodes[index])) })),
};
for (const doc of documents) {
  let section = 0;
  for (const node of doc.content) if (typeof node !== "string" && ["h2", "h3"].includes(node.tag)) node.attrs.id ||= `section-${++section}`;
}
await mkdir(join(root, "src/content/history"), { recursive: true });
await mkdir(join(root, "public/study/history"), { recursive: true });
await mkdir(join(root, "db/seeds"), { recursive: true });
await writeFile(join(root, "src/content/history/chapters.json"), JSON.stringify(chapters, null, 2) + "\n");
await writeFile(join(root, "src/content/history/import-audit.json"), JSON.stringify(audit, null, 2) + "\n");
await writeFile(join(root, "db/seeds/history-questions.json"), JSON.stringify(questions, null, 2) + "\n");
await writeFile(join(root, "db/seeds/history-notes.json"), JSON.stringify(documents, null, 2) + "\n");
for (const [original, target] of [["BPSC_Complete_Notes_Hindi.pdf", "complete-notes-hindi.pdf"], ["BPSC_Coverage_and_Corrections.md", "coverage-and-corrections.md"], ["BPSC_Source_MCQ_Coverage.json", "source-mcq-coverage.json"]]) await copyFile(join(source, original), join(root, "public/study/history", target));
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(join(root, "db/practice.sql"), "utf8");
for (const statement of schema.split(";").map((s) => s.trim()).filter(Boolean)) await sql.query(statement);
await sql.transaction([
  sql`INSERT INTO practice_questions (subject, id, position, data)
    SELECT 'history', id, position, data FROM jsonb_to_recordset(${JSON.stringify(questions.map((data, position) => ({ id: data.id, position, data })))}::jsonb) AS items(id TEXT, position INT, data JSONB)
    ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, data = EXCLUDED.data`,
  sql`INSERT INTO practice_notes (subject, id, position, title, content)
    SELECT 'history', id, position, title, content FROM jsonb_to_recordset(${JSON.stringify(documents)}::jsonb) AS items(id TEXT, position INT, title TEXT, content JSONB)
    ON CONFLICT (subject, id) DO UPDATE SET position = EXCLUDED.position, title = EXCLUDED.title, content = EXCLUDED.content`,
]);
console.log(`Imported ${questions.length} history questions, ${chapters.length} chapters, introduction and source notes. Existing DSA data and all saved progress preserved.`);
