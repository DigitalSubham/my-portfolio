import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { validatePracticeSnapshot } from "../src/lib/practice-state.ts";

const questions = JSON.parse(readFileSync(new URL("../db/seeds/dsa-questions.json", import.meta.url), "utf8"));
const snapshot = () => ({
  version: 1,
  progress: { pyq: { r: { "PYQ-01": [1, 1, 1] }, h: "1" } },
  session: {
    kind: "practice", title: "All DSA questions", list: questions.slice(0, 100).map((q) => q.id),
    i: 44, picks: { "PYQ-01": 0 }, key: null, done: false,
  },
  view: "q",
});

test("the database seed keeps all original question content and explanations", () => {
  assert.equal(questions.length, 1044);
  assert.equal(new Set(questions.map((q) => q.id)).size, 1044);
  for (const q of questions) {
    assert.ok(q.q && q.topic && q.exp && q.concept, q.id);
    assert.equal(q.opts.length, 5, q.id);
    assert.match(q.ans, /^[A-E]$/, q.id);
  }
});

test("a saved session preserves question 45, order and previous answers exactly", () => {
  const input = snapshot();
  input.session.list.reverse();
  const result = validatePracticeSnapshot(input, questions);
  assert.deepEqual(result, input);
  assert.equal(result.session.i, 44);
});

test("unfinished tests preserve remaining time and can be paused on the topics screen", () => {
  const input = snapshot();
  input.session = { ...input.session, kind: "test", limit: 6000, remainingSeconds: 5471, used: 529 };
  assert.deepEqual(validatePracticeSnapshot(input, questions), input);
  input.view = "home";
  assert.deepEqual(validatePracticeSnapshot(input, questions), input);
});

test("reset clears session and attempt history in the same save", () => {
  const input = { version: 1, progress: {}, session: null, view: "home" };
  assert.deepEqual(validatePracticeSnapshot(input, questions), input);
});

test("invalid question positions, picks, histories and time are rejected", () => {
  const changes = [
    (s) => { s.session.i = 100; },
    (s) => { s.session.i = -1; },
    (s) => { s.session.list[1] = s.session.list[0]; },
    (s) => { s.session.list[0] = "unknown"; },
    (s) => { s.session.picks["PYQ-01"] = 5; },
    (s) => { s.session.picks.unknown = 0; },
    (s) => { s.progress.pyq.r["PYQ-01"] = [1, 2, 1]; },
    (s) => { s.progress.pyq.h = "1".repeat(51); },
    (s) => { s.session = null; },
    (s) => { s.view = "done"; },
    (s) => { s.session = { ...s.session, kind: "test", limit: 6000, remainingSeconds: 6001, used: -1 }; },
  ];
  for (const change of changes) {
    const input = snapshot();
    change(input);
    assert.throws(() => validatePracticeSnapshot(input, questions), /Invalid practice save/);
  }
});

test("saved topic sessions reject invalid positions, picks and mismatched topic keys", () => {
  const input = snapshot();
  const session = { ...input.session, key: "arrays" };
  input.sessions = { arrays: session };
  assert.deepEqual(validatePracticeSnapshot(input, questions), input);
  for (const sessions of [
    null,
    { missing: session },
    { stacks: session },
    { arrays: { ...session, i: session.list.length } },
    { arrays: { ...session, picks: { [session.list[0]]: 5 } } },
    { arrays: { ...session, list: ["removed-question"] } },
    { $test: session },
  ]) {
    assert.throws(() => validatePracticeSnapshot({ ...input, sessions }, questions), /Invalid practice save/);
  }
});

test("archived sessions contain only questions belonging to their topic", () => {
  const list = questions.filter((q) => q.topic === "Arrays & Basics").slice(0, 10).map((q) => q.id);
  const input = { version: 1, progress: {}, session: null, view: "home", sessions: { arrays: { kind: "practice", title: "Arrays", key: "arrays", list, i: 0, picks: {}, done: false } } };
  const allowedTopics = [{ key: "arrays", name: "Arrays & Basics" }];
  assert.deepEqual(validatePracticeSnapshot(input, questions, allowedTopics), input);
  input.sessions.arrays.list = [questions.find((q) => q.topic !== "Arrays & Basics").id];
  assert.throws(() => validatePracticeSnapshot(input, questions, allowedTopics), /Invalid practice save/);
});
