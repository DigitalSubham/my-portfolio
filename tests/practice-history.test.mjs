import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { validatePracticeSnapshot } from "../src/lib/practice-state.ts";

const json = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const questions = json("../db/seeds/history-questions.json");
const documents = json("../db/seeds/history-notes.json");
const chapters = json("../src/content/history/chapters.json");
const audit = json("../src/content/history/import-audit.json");
const coverage = json("../public/study/history/source-mcq-coverage.json");
const hash = (value) => createHash("sha256").update(value).digest("hex");
const text = (node) => typeof node === "string" ? node : node.children.map(text).join("");

test("all 880 original questions and all 24 chapter counts are preserved exactly", () => {
  assert.equal(questions.length, 880);
  assert.equal(new Set(questions.map((q) => q.id)).size, 880);
  assert.equal(hash(JSON.stringify(questions)), audit.questionHash);
  assert.equal(chapters.length, 24);
  assert.equal(chapters.reduce((sum, c) => sum + c.count, 0), 880);
  for (const chapter of chapters) assert.equal(questions.filter((q) => q.topic === chapter.name).length, chapter.count);
  for (const q of questions) { assert.equal(q.opts.length, 5); assert.equal(q.why.length, 5); assert.match(q.ans, /^[ABCDE]$/); }
});

test("the reader retains every character, English gloss, source link and study table", () => {
  assert.equal(documents.length, 26);
  let glosses = 0, tables = 0;
  const allowed = new Set(["p", "h1", "h2", "h3", "b", "strong", "span", "table", "thead", "tr", "th", "tbody", "td", "aside", "ul", "li", "i", "div", "br", "a"]);
  function check(node) {
    if (typeof node === "string") return;
    assert.ok(allowed.has(node.tag));
    for (const name of Object.keys(node.attrs)) assert.ok(["class", "href", "scope", "id", "lang"].includes(name));
    if (node.attrs.href) assert.match(node.attrs.href, /^(https?:\/\/|#)/);
    if (node.attrs.class?.split(" ").includes("gloss")) glosses++;
    if (node.tag === "table") tables++;
    node.children.forEach(check);
  }
  for (const doc of documents) {
    assert.equal(hash(doc.content.map(text).join("")), audit.documents.find((item) => item.id === doc.id).textHash, doc.id);
    doc.content.forEach(check);
  }
  assert.equal(glosses, 417);
  assert.equal(tables, 53);
  assert.equal(hash(readFileSync(new URL("../public/study/history/complete-notes-hindi.pdf", import.meta.url))), audit.pdfHash);
});

test("source reconciliation keeps uncertain and out-of-scope items out of scoring", () => {
  assert.equal(coverage.length, 281);
  assert.equal(coverage.filter((row) => row.status === "adapted").length, 200);
  assert.equal(coverage.filter((row) => row.status === "unscored_uncertainty").length, 6);
  assert.equal(coverage.filter((row) => row.status === "outside_requested_history_scope").length, 75);
  for (const row of coverage) for (const id of row.question_ids) assert.ok(questions.some((q) => q.id === id));
});

test("history saves validate chapter keys and cannot contain DSA progress", () => {
  const topics = chapters.map((c) => ({ key: c.key, name: c.name }));
  const snapshot = { version: 1, view: "q", progress: { "chapter-01": { r: { "HIST01-001": [1, 0, 0] }, h: "0" } }, session: { kind: "practice", title: chapters[0].name, list: questions.slice(0, 10).map((q) => q.id), i: 4, picks: { "HIST01-001": 1 }, key: "chapter-01", done: false } };
  assert.deepEqual(validatePracticeSnapshot(snapshot, questions, topics), snapshot);
  assert.throws(() => validatePracticeSnapshot(snapshot, questions), /Invalid practice save/);
  const wrongTopic = structuredClone(snapshot); wrongTopic.progress["chapter-02"] = wrongTopic.progress["chapter-01"]; delete wrongTopic.progress["chapter-01"];
  assert.throws(() => validatePracticeSnapshot(wrongTopic, questions, topics), /Invalid practice save/);
  const dsa = structuredClone(snapshot); dsa.session.list[0] = "PYQ-01";
  assert.throws(() => validatePracticeSnapshot(dsa, questions, topics), /Invalid practice save/);
});
