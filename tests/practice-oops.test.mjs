import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { emptyQuiz, quizStats, recordAnswer, quizSnapshot } from '../src/lib/practice-quiz.ts';
import { validatePracticeSnapshot } from '../src/lib/practice-state.ts';

const json = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const sources = await json('../db/seeds/oops-source.json');
const questions = await json('../db/seeds/oops-questions.json');
const chapters = await json('../src/content/oops/chapters.json');
const bank = questions.map((q) => ({ ...q, k: chapters.find((c) => c.title === q.topic).key }));

test('all 199 printed OOP questions and all five original options are preserved', () => {
  assert.equal(bank.length, 199);
  assert.equal(new Set(bank.map((q) => q.id)).size, 199);
  for (const source of sources.slice(1)) {
    for (const original of source.questions) {
      const q = bank.find((q) => q.source.document === source.id && q.source.number === original.number);
      assert.ok(q);
      assert.equal(q.source.originalText, original.text);
      const markers = [...original.text.matchAll(/^\s*([A-E])[).]\s*/gm)];
      assert.deepEqual(q.opts, markers.map((m, i) => original.text.slice(m.index + m[0].length, markers[i + 1]?.index).trim()));
      assert.match(q.ans, /^[ABCDE]$/);
      assert.ok(q.exp.length > 80);
      assert.ok(chapters.some((c) => q.noteHref.endsWith('/' + c.key)));
    }
  }
  assert.equal(bank.find((q) => q.id === 'OOP-A1-098').source.keyNumber, 99);
  assert.equal(bank.some((q) => q.id === 'OOP-A1-099'), false);
});

test('all source PDFs are unchanged and all 45 notes pages have lesson coverage and images', async () => {
  for (const source of sources) {
    const pdf = await readFile(new URL(`../public/study/oops/${source.id}.pdf`, import.meta.url));
    assert.equal(createHash('sha256').update(pdf).digest('hex'), source.sha256);
  }
  assert.equal(chapters.length, 20);
  const pages = await json('../src/content/oops/pages.json');
  assert.equal(pages.length, 45);
  for (const page of pages) {
    assert.ok(chapters.some((c) => c.pages.includes(page.number)));
    assert.ok((await readFile(new URL(`../public/study/oops/pages/${page.number}.webp`, import.meta.url))).length > 1000);
  }
  const notes = await json('../db/seeds/oops-notes.json');
  assert.deepEqual(notes.map((n) => n.id), chapters.map((c) => c.key));
});

test('review-only answers retain a resumable choice without affecting accuracy or wrong-answer records', () => {
  const q = bank.find((q) => q.unscored);
  const initial = emptyQuiz();
  assert.equal(recordAnswer(initial, q, false), initial);
  assert.equal(recordAnswer(initial, q, true), initial);
  assert.equal(quizStats(initial, bank).total, 160);
  const state = { ...initial, view: 'q', session: { kind: 'practice', title: 'Review', list: [q.id], i: 0, picks: { [q.id]: 2 }, key: q.k, done: false } };
  const saved = validatePracticeSnapshot(quizSnapshot(state), bank, chapters.map((c) => ({ key: c.key, name: c.title })));
  assert.equal(saved.session.picks[q.id], 2);
  assert.deepEqual(saved.progress, {});
});

test('known erroneous keys and PDF comment wraps retain explicit corrections', () => {
  const expected = { 'OOP-A2-014': 'C', 'OOP-A2-019': 'E', 'OOP-A2-052': 'E', 'OOP-A2-057': 'B', 'OOP-A2-060': 'E', 'OOP-A2-061': 'E', 'OOP-A2-062': 'E', 'OOP-A2-100': 'A' };
  for (const [id, answer] of Object.entries(expected)) assert.equal(bank.find((q) => q.id === id).ans, answer);
  for (const number of ['039', '040', '042']) assert.ok(bank.find((q) => q.id === `OOP-A2-${number}`).transcriptionNote);
});
