import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { emptyQuiz, quizSnapshot, quizStats, recordAnswer, remainingTime, restoreQuiz, savedQuizSession, switchQuizSession, topics, topicStatus } from "../src/lib/practice-quiz.ts";
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

const topicSession = (key, size = 50) => ({
  kind: "practice", key, title: key, list: questions.filter((q) => q.k === key).slice(0, size).map((q) => q.id),
  i: 0, picks: {}, done: false,
});

test("switching topics and restoring an account save preserves question 26 of the original 50", () => {
  const arrays = topicSession("arrays");
  arrays.i = 25;
  arrays.list.reverse();
  arrays.picks = Object.fromEntries(arrays.list.slice(0, 25).map((id) => [id, 0]));
  const original = { ...emptyQuiz(), session: arrays, view: "q" };
  let state = switchQuizSession(original, topicSession("stacks"));
  state = { ...state, session: { ...state.session, i: 7, picks: { [state.session.list[0]]: 1 } } };
  const restored = restoreQuiz(validatePracticeSnapshot(quizSnapshot(state, true), questions));
  const resumed = switchQuizSession(restored, savedQuizSession(restored, "arrays"));
  assert.deepEqual(resumed.session, arrays);
  assert.equal(resumed.session.i + 1, 26);
  assert.equal(resumed.session.list.length, 50);
  assert.equal(Object.keys(resumed.session.picks).length, 25);
  assert.equal(savedQuizSession(resumed, "stacks").i, 7);
  assert.deepEqual(original.sessions, undefined, "switching does not mutate the previous checkpoint");
});

test("starting over in one topic keeps other topics and reset clears every saved session", () => {
  let state = switchQuizSession(emptyQuiz(), { ...topicSession("arrays"), i: 25 });
  state = switchQuizSession(state, { ...topicSession("stacks"), i: 8 });
  state = switchQuizSession(state, topicSession("arrays", 10));
  assert.equal(state.session.i, 0);
  assert.equal(state.session.list.length, 10);
  assert.equal(savedQuizSession(state, "stacks").i, 8);
  assert.equal(savedQuizSession(emptyQuiz(), "arrays"), null);
  assert.equal(quizSnapshot(emptyQuiz()).sessions, undefined);
});

test("switching from a timed test pauses its timer while topic practice continues", () => {
  const timed = { kind: "test", key: null, title: "Timed test", list: questions.slice(0, 16).map((q) => q.id), i: 4, picks: {}, done: false, limit: 960, used: 0, start: 1_000_000 };
  let state = switchQuizSession({ ...emptyQuiz(), session: timed, view: "q" }, topicSession("arrays"), 1_045_000);
  const parked = savedQuizSession(state, "$test");
  assert.equal(parked.remainingSeconds, 915);
  assert.equal(parked.start, undefined);
  state = switchQuizSession(state, parked, 2_000_000);
  assert.equal(remainingTime(state, 2_000_000), 915);
  assert.equal(state.session.i, 4);
  assert.equal(savedQuizSession(state, "arrays").i, 0);
  const saved = quizSnapshot(state, true, 2_005_000);
  assert.equal(saved.sessions.$test.remainingSeconds, 910);
  assert.ok(Object.values(saved.sessions).every((session) => session.start === undefined));
  assert.deepEqual(validatePracticeSnapshot(saved, questions), saved);
});
