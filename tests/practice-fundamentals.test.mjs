import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { buildPracticeCatalog } from "../src/lib/practice-catalog.ts";
import { validatePracticeSnapshot } from "../src/lib/practice-state.ts";
import { validateQuestionBank } from "../scripts/import-practice.mjs";

const bank = JSON.parse(readFileSync(new URL("../db/seeds/computer-fundamentals-questions.json", import.meta.url)));
const groups = new Map();
for (const [position, q] of bank.entries()) {
  const row = groups.get(q.topic) || { subject: "computer-fundamentals", topic: q.topic, position, count: 0 };
  row.count++;
  groups.set(q.topic, row);
}
const [subject] = buildPracticeCatalog([...groups.values()]);

test("the 263-question bank discovers its subject and topics entirely from question rows", () => {
  assert.equal(validateQuestionBank(bank), bank);
  assert.equal(bank.length, 263);
  assert.equal(subject.title, "Computer Fundamentals");
  assert.equal(subject.topics.length, 2);
  assert.equal(subject.topics.find((topic) => topic.key === "pyq").count, 13);
  assert.equal(subject.topics.find((topic) => topic.name === "Computer Fundamentals").count, 250);
});

test("discovered topic keys support position-preserving account saves and subject isolation", () => {
  const topic = subject.topics[0];
  const questions = bank.filter((q) => q.topic === topic.name);
  const snapshot = { version: 1, progress: { [topic.key]: { r: { [questions[0].id]: [1, 0, 0] }, h: "0" } }, view: "q", session: { kind: "practice", title: topic.label, list: questions.map((q) => q.id), i: 30, picks: { [questions[0].id]: 0 }, key: topic.key, done: false } };
  assert.deepEqual(validatePracticeSnapshot(snapshot, bank, subject.topics), snapshot);
  const invalid = structuredClone(snapshot);
  invalid.session.list[0] = "HIST01-001";
  assert.throws(() => validatePracticeSnapshot(invalid, bank, subject.topics), /Invalid practice save/);
});
