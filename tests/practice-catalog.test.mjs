import assert from "node:assert/strict";
import test from "node:test";
import { buildPracticeCatalog, practiceTopicKey, isPracticeSubjectSlug } from "../src/lib/practice-catalog.ts";
import { validateQuestionBank } from "../scripts/import-practice.mjs";

const rows = [
  { subject: "new-subject", topic: "Basics", count: 50, position: 0 },
  { subject: "new-subject", topic: "Past Papers (TRE 1-3)", count: 13, position: 50 },
];

test("database rows alone create a subject, topics, title and live counts", () => {
  const [subject] = buildPracticeCatalog(rows);
  assert.equal(subject.slug, "new-subject");
  assert.equal(subject.title, "New Subject");
  assert.equal(subject.questionCount, 63);
  assert.match(subject.description, /63 questions across 2 topics/);
  assert.equal(subject.topics[0].key, practiceTopicKey("Basics"));
  assert.equal(subject.topics[1].key, "pyq");
  assert.equal(buildPracticeCatalog([...rows, { subject: "another-subject", topic: "New", count: 1, position: 0 }]).length, 2);
  assert.deepEqual(buildPracticeCatalog([]), []);
});

test("existing notes, topic keys and saved-session identities survive catalog discovery", () => {
  const legacy = [{ slug: "new-subject", title: "Custom title", eyebrow: "Course", description: "Study", notesHref: "/notes", topics: [{ key: "old-key", name: "Basics", label: "Original basics" }] }];
  const [subject] = buildPracticeCatalog(rows, legacy);
  assert.equal(subject.topics[0].key, "old-key");
  assert.equal(subject.topics[0].count, 50);
  assert.equal(subject.notesHref, "/notes");
  assert.equal(subject.title, "Custom title");
  assert.equal(subject.questionCount, 63);
  assert.deepEqual(buildPracticeCatalog([], legacy), [], "metadata cannot publish a subject with no questions");
});

test("topic keys are stable across order changes, additions and names sharing a slug", () => {
  assert.notEqual(practiceTopicKey("A & B"), practiceTopicKey("A / B"));
  assert.notEqual(practiceTopicKey("हिंदी"), practiceTopicKey("हिन्दी"));
  const [subject] = buildPracticeCatalog(rows.toReversed());
  assert.equal(subject.topics.find((topic) => topic.name === "Basics").key, practiceTopicKey("Basics"));
  for (const value of ["../admin", "a/b", "", "a".repeat(81)]) assert.equal(isPracticeSubjectSlug(value), false);
});

const question = { id: "Q-1", topic: "Basics", subtopic: "Introduction", q: "Question?", opts: ["A", "B", "C", "D", "E"], ans: "A", exp: "Explanation", type: "concept", level: 1 };
test("generic imports preserve content and reject malformed or duplicate questions", () => {
  const bank = [structuredClone(question)];
  assert.equal(validateQuestionBank(bank), bank);
  for (const invalid of [[], null, [question, question], [{ ...question, ans: "Z" }], [{ ...question, opts: ["A"] }], [{ ...question, why: [] }], [{ ...question, topic: "" }], [{ ...question, level: 9 }]]) {
    assert.throws(() => validateQuestionBank(invalid));
  }
});
