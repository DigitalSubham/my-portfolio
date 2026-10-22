import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validatePracticeSnapshot } from '../src/lib/practice-state.ts';

const raw = readFileSync(new URL('../db/seeds/dbms-questions.json', import.meta.url));
const bank = JSON.parse(raw);
const topics = JSON.parse(readFileSync(new URL('../src/content/dbms/topics.json', import.meta.url)));
const audit = JSON.parse(readFileSync(new URL('../src/content/dbms/import-audit.json', import.meta.url)));

test('all 635 DBMS questions retain the imported source bytes and valid topic assignments', () => {
  assert.equal(bank.length, 635);
  assert.equal(new Set(bank.map((q) => q.id)).size, 635);
  assert.equal(createHash('sha256').update(raw).digest('hex'), audit.sourceSha256);
  assert.equal(topics.length, 14);
  assert.equal(new Set(topics.map((topic) => topic.key)).size, 14);
  assert.equal(topics.reduce((sum, topic) => sum + topic.count, 0), 635);
  assert.equal(topics.find((topic) => topic.key === 'pyq').count, 35);
  for (const topic of topics) assert.equal(bank.filter((q) => q.topic === topic.name).length, topic.count);
  for (const q of bank) {
    assert.equal(q.opts.length, 5);
    assert.equal(q.why.length, 5);
    assert.match(q.ans, /^[ABCDE]$/);
    assert.ok(q.q && q.exp && q.concept);
    assert.ok(topics.some((topic) => topic.name === q.topic));
  }
});

test('DBMS snapshots retain question position and cannot contain another subject’s questions', () => {
  const topic = topics[0];
  const questions = bank.filter((q) => q.topic === topic.name);
  const snapshot = { version: 1, progress: { [topic.key]: { r: { [questions[0].id]: [1, 0, 0] }, h: '0' } }, view: 'q', session: { kind: 'practice', title: topic.label, list: questions.map((q) => q.id), i: 30, picks: { [questions[0].id]: 0 }, key: topic.key, done: false } };
  assert.deepEqual(validatePracticeSnapshot(snapshot, bank, topics), snapshot);
  const invalid = structuredClone(snapshot);
  invalid.session.list[0] = 'HIST01-001';
  assert.throws(() => validatePracticeSnapshot(invalid, bank, topics), /Invalid practice save/);
});
