import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { emptyQuiz, quizSnapshot, quizStats, recordAnswer, remainingTime, restoreQuiz, topics, topicStatus } from "../src/lib/practice-quiz.ts";
import { validatePracticeSnapshot } from "../src/lib/practice-state.ts";

const bank = JSON.parse(readFileSync(new URL("../db/seeds/dsa-questions.json", import.meta.url), "utf8"));
const questions = bank.map((q) => ({ ...q, k: topics.find((t) => t.name === q.topic).key }));

test("the React quiz records correct and wrong attempts without changing earlier checkpoints", () => {
  const before = emptyQuiz();
  const first = recordAnswer(before, questions[0], false);
  const second = recordAnswer(first, questions[0], true);
  assert.deepEqual(before.progress, {});
  assert.deepEqual(first.progress.pyq.r[questions[0].id], [1, 0, 0]);
  assert.deepEqual(second.progress.pyq.r[questions[0].id], [2, 1, 1]);
  assert.equal(quizStats(second, questions).wrong, 0);
  assert.equal(quizStats(second, questions).acc, 0.5);
});

test("the new page can restore the former HTML quiz's question-45 snapshot unchanged", () => {
  const saved = {
    ...emptyQuiz(), view: "q", progress: { pyq: { r: { "PYQ-01": [2, 1, 1] }, h: "01" } },
    session: { kind: "practice", title: "DSA", list: questions.slice(0, 100).map((q) => q.id), i: 44, picks: { "PYQ-01": 0 }, key: null, done: false },
  };
  const state = restoreQuiz(validatePracticeSnapshot(saved, questions));
  assert.deepEqual(quizSnapshot(state), saved);
});

test("timed tests preserve elapsed time and resume from a valid database snapshot", () => {
  const state = {
    ...emptyQuiz(), view: "q",
    session: { kind: "test", title: "Timed test", list: questions.slice(0, 16).map((q) => q.id), i: 4, picks: {}, key: null, done: false, limit: 960, start: 1_000_000, used: 0 },
  };
  assert.equal(remainingTime(state, 1_045_000), 915);
  const saved = quizSnapshot(state, true, 1_045_000);
  assert.equal(saved.session.start, undefined);
  assert.equal(saved.session.remainingSeconds, 915);
  assert.equal(saved.session.used, 45);
  assert.deepEqual(validatePracticeSnapshot(saved, questions), saved);
  assert.equal(remainingTime(restoreQuiz(saved)), 915);
  assert.equal(quizSnapshot({ ...state, view: "home", session: { ...state.session, used: 45 } }, true).view, "q");
});

test("readiness continues to use the last 50 attempts at the 85 percent threshold", () => {
  let state = emptyQuiz();
  for (let i = 0; i < 55; i++) state = recordAnswer(state, questions[0], i >= 5);
  assert.equal(state.progress.pyq.h.length, 50);
  const stats = quizStats(state, questions.filter((q) => q.k === "pyq"), state.progress.pyq.h);
  assert.equal(topicStatus(stats).cls, "ready");
  assert.equal(topicStatus(quizStats(emptyQuiz(), questions)).text, "Not started");
});
