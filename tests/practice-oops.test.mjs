import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { emptyQuiz, quizStats, recordAnswer, quizSnapshot } from '../src/lib/practice-quiz.ts';
import { validatePracticeSnapshot } from '../src/lib/practice-state.ts';
import { continuousOopContent } from '../src/lib/oop-note-content.ts';

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
      assert.ok(chapters.some((c) => q.noteHref === '/practice/oops/notes#' + c.key));
    }
  }
  assert.equal(bank.find((q) => q.id === 'OOP-A1-098').source.keyNumber, 99);
  assert.equal(bank.some((q) => q.id === 'OOP-A1-099'), false);
});

test('all source PDFs are unchanged and all 45 notes pages retain content coverage', async () => {
  for (const source of sources) {
    const pdf = await readFile(new URL(`../public/study/oops/${source.id}.pdf`, import.meta.url));
    assert.equal(createHash('sha256').update(pdf).digest('hex'), source.sha256);
  }
  assert.equal(chapters.length, 20);
  for (let page = 1; page <= 45; page++) assert.ok(chapters.some((c) => c.pages.includes(page)));
  const notes = await json('../db/seeds/oops-notes.json');
  assert.deepEqual(notes.map((n) => n.id), chapters.map((c) => c.key));
});

test('continuous notes retain every character and example with unique heading anchors', async () => {
  const notes = await json('../db/seeds/oops-notes.json');
  const text = (nodes) => nodes.map((node) => typeof node === 'string' ? node : text(node.children)).join('');
  const ids = new Set();
  let examples = 0;
  function check(nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') continue;
      assert.notEqual(node.tag, 'h1');
      if (node.attrs.id) {
        assert.ok(!ids.has(node.attrs.id), `Duplicate anchor: ${node.attrs.id}`);
        ids.add(node.attrs.id);
        if (node.attrs.id.includes('-example-')) examples++;
      }
      check(node.children);
    }
  }
  for (const note of notes) {
    const combined = continuousOopContent(note.content, note.id);
    assert.equal(text(combined), text(note.content));
    check(combined);
  }
  assert.equal(examples, 51);
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
