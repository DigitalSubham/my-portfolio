import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PRACTICE_TEST_URL || 'http://localhost:3000';
const notes = JSON.parse(await readFile(new URL('../db/seeds/oops-notes.json', import.meta.url), 'utf8'));
const text = (nodes) => nodes.map((node) => typeof node === 'string' ? node : text(node.children)).join('');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
await mkdir('screenshots/practice', { recursive: true });
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${base}/practice/oops/notes`);
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText(), 'OOP & Language Foundations');
    assert.equal(await page.locator('#oops-note > .oop-topic').count(), 20);
    assert.equal(await page.locator('#oops-note section[id*="-example-"]').count(), 51);
    for (const note of notes) assert.equal(await page.locator(`#${note.id}`).textContent(), text(note.content));
    assert.equal(await page.locator('a[href*="/notes/original/"],img,.chapter-pagination,.chapter-list').count(), 0);
    const uniqueIds = await page.locator('[id]').evaluateAll((nodes) => nodes.map((node) => node.id));
    assert.equal(uniqueIds.length, new Set(uniqueIds).size);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (viewport.width < 850) await page.locator('.mobile-contents summary').click();
    await page.locator('nav[aria-label="Notes contents"]:visible a[href="#constructors"]').click();
    assert.equal(new URL(page.url()).pathname, '/practice/oops/notes');
    assert.equal(new URL(page.url()).hash, '#constructors');
    await page.waitForFunction(() => Math.abs(document.getElementById('constructors').getBoundingClientRect().top) < 100);
    await page.screenshot({ path: `screenshots/practice/oops-continuous-${viewport.width}.png` });
    await page.goto(`${base}/practice/oops/notes`);
    await page.getByRole('button', { name: 'Increase text size' }).click();
    assert.equal(await page.locator('.reading-tools output').innerText(), '19');
    await page.getByRole('button', { name: 'Print complete notes' }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(600);
    const position = await page.evaluate(() => JSON.parse(localStorage.getItem('oops-reading-v1')).scroll);
    await page.reload();
    await page.waitForFunction((position) => Math.abs(scrollY - position) < 50, position);
    assert.equal(await page.locator('.reading-tools output').innerText(), '19');
    await page.goto(`${base}/practice/oops/notes/static`);
    assert.equal(new URL(page.url()).pathname, '/practice/oops/notes');
    assert.equal(new URL(page.url()).hash, '#static');
    assert.equal((await context.request.get(`${base}/practice/oops/notes/original/2`)).status(), 404);
    assert.equal((await context.request.get(`${base}/study/oops/pages/2.webp`)).status(), 404);
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log('Passed: all notes and 51 examples on one page, exact text retained, unique anchors, mobile layout, topic jumps, font size, reading resume, old-link redirects and removed images.');
} finally { await browser.close(); }
