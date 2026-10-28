import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHmac, randomUUID, scryptSync } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

nextEnv.loadEnvConfig(process.cwd());
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const sql = neon(process.env.DATABASE_URL);
const baseURL = process.env.PRACTICE_TEST_URL || "http://localhost:3000";
const questions = JSON.parse(await readFile(new URL("../db/seeds/dsa-questions.json", import.meta.url), "utf8"));
const answerFor = new Map(questions.map((q) => [q.id, "ABCDE".indexOf(q.ans)]));
const email = `practice-test-${randomUUID()}@example.invalid`;
const password = randomUUID();
const salt = randomUUID();
const hash = scryptSync(password, salt, 64).toString("hex");
const [admin] = await sql`INSERT INTO admins (email, password_hash, password_salt) VALUES (${email}, ${hash}, ${salt}) RETURNING id`;
const unsigned = [
  { alg: "HS256", typ: "JWT" },
  { sub: String(admin.id), email, exp: Math.floor(Date.now() / 1000) + 3600 },
].map((value) => Buffer.from(JSON.stringify(value)).toString("base64url")).join(".");
const token = `${unsigned}.${createHmac("sha256", process.env.JWT_SECRET).update(unsigned).digest("base64url")}`;
const cookie = { name: "portfolio_admin_token", value: token, url: baseURL };
let browser;
try {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const errors = [];
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await desktop.addCookies([cookie]);
  const page = await desktop.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  const calls = [];
  page.on("request", (request) => { if (request.url().includes("/api/practice/")) calls.push({ method: request.method(), url: request.url() }); });
  const redirect = await desktop.request.get(`${baseURL}/dsa-practice.html`, { maxRedirects: 0 });
  assert.equal(redirect.status(), 308);
  assert.equal(new URL(redirect.headers().location, baseURL).pathname, "/practice/dsa");
  await page.goto(`${baseURL}/practice/dsa`);
  await page.getByRole("heading", { name: "TRE DSA Question Bank" }).waitFor();
  assert.equal(calls.length, 2);
  await page.locator('#t-stacks [data-act="setup"]').click();
  await page.locator('label[for="ps-3"]').click();
  await page.locator('[data-act="start"][data-key="stacks"]').click();
  const firstId = await page.locator(".qid").innerText();
  for (let i = 0; i < 44; i++) {
    const id = await page.locator(".qid").innerText();
    await page.locator(`[data-act="pick"][data-i="${answerFor.get(id)}"]`).click();
    await page.locator('[data-act="next"]').click();
  }
  assert.match(await page.locator(".qbar .right").innerText(), /45 \/ 137/);
  const currentId = await page.locator(".qid").innerText();
  assert.notEqual(currentId, firstId);
  assert.equal(calls.length, 2, "answering 44 questions must not issue API requests");
  await page.locator('[data-act="previous"]').click();
  assert.equal(await page.locator(".opt.picked").count(), 1);
  await page.locator('[data-act="next"]').click();
  assert.equal(await page.locator(".qid").innerText(), currentId);
  const wrongPick = (answerFor.get(currentId) + 1) % 5;
  await page.locator(`[data-act="pick"][data-i="${wrongPick}"]`).click();
  await page.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  assert.equal(calls.filter((call) => call.method === "POST").length, 1);
  const before = await desktop.request.get(`${baseURL}/api/practice/dsa/progress`);
  const firstSave = await before.json();
  assert.equal(firstSave.snapshot.session.i, 44);
  assert.equal(Object.keys(firstSave.snapshot.session.picks).length, 45);
  await page.reload();
  await page.locator(".qid").waitFor();
  assert.equal(await page.locator(".qid").innerText(), currentId);
  await mkdir("screenshots/practice", { recursive: true });
  await page.screenshot({ path: "screenshots/practice/desktop-question.png", fullPage: true });

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  await phone.addCookies([cookie]);
  const mobile = await phone.newPage();
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(`${baseURL}/practice/dsa`);
  await mobile.locator(".qid").waitFor();
  assert.equal(await mobile.locator(".qid").innerText(), currentId, "fresh device resumes saved question 45");
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.screenshot({ path: "screenshots/practice/mobile-question.png", fullPage: true });
  await mobile.locator('[data-act="next"]').click();
  await mobile.getByRole("button", { name: "Save progress", exact: true }).click();
  await mobile.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await page.locator('[data-act="next"]').click();
  await page.locator('[data-act="quit"]').click();
  await page.getByRole("status").filter({ hasText: "newer save exists" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Load saved progress" }).count(), 1);

  await mobile.locator('[data-act="quit"]').click();
  await mobile.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await mobile.locator('[data-act="reset"]').click();
  await mobile.getByRole("button", { name: "Yes, clear my progress" }).click();
  await mobile.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await mobile.reload();
  await mobile.getByRole("heading", { name: "TRE DSA Question Bank" }).waitFor();
  assert.match(await mobile.locator(".summary .stat").first().innerText(), /^0\n/);
  assert.equal(await mobile.locator('[data-act="resume"]').count(), 0);
  await mobile.screenshot({ path: "screenshots/practice/mobile-topics.png", fullPage: true });

  await mobile.locator('[data-act="setup"][data-key="test"]').click();
  await mobile.locator('[data-act="start-test"]').click();
  const testQuestion = await mobile.locator(".qid").innerText();
  await mobile.locator('[data-act="pick"][data-i="0"]').click();
  await mobile.locator('[data-act="next"]').click();
  await mobile.locator('[data-act="previous"]').click();
  assert.equal(await mobile.locator(".qid").innerText(), testQuestion);
  await mobile.locator('[data-act="quit"]').click();
  await mobile.getByRole("button", { name: "Save progress", exact: true }).click();
  await mobile.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await mobile.reload();
  await mobile.locator('[data-act="resume"]').click();
  assert.equal(await mobile.locator(".qid").innerText(), testQuestion);
  await mobile.locator('[data-act="finish"]').click();
  await mobile.getByRole("heading", { name: "Review", exact: true }).waitFor();
  assert.ok((await mobile.locator(".review details").count()) > 0);

  const guest = await browser.newContext();
  for (const subject of ["dsa", "dbms", "oops", "history"]) {
    const path = `/practice/${subject}?chapter=chapter-01`;
    const deniedPage = await guest.request.get(`${baseURL}${path}`, { maxRedirects: 0 });
    assert.equal(deniedPage.status(), 307);
    const login = new URL(deniedPage.headers().location, baseURL);
    assert.equal(login.pathname, "/admin/login");
    assert.equal(login.searchParams.get("next"), path);
    const deniedBank = await guest.request.get(`${baseURL}/api/practice/${subject}/questions`);
    assert.equal(deniedBank.status(), 401);
    assert.equal(deniedBank.headers()["cache-control"], "private, no-store");
  }
  const invalidSession = await browser.newContext();
  await invalidSession.addCookies([{ ...cookie, value: `${token}invalid` }]);
  assert.equal((await invalidSession.request.get(`${baseURL}/practice/dsa`, { maxRedirects: 0 })).status(), 307);
  assert.equal((await invalidSession.request.get(`${baseURL}/api/practice/dsa/questions`)).status(), 401);
  await invalidSession.close();
  assert.equal((await guest.request.get(`${baseURL}/practice`)).status(), 200);
  assert.equal((await guest.request.get(`${baseURL}/practice/oops/notes`)).status(), 200);
  const denied = await guest.request.get(`${baseURL}/api/practice/dsa/progress`);
  assert.equal(denied.status(), 401);
  const deniedSave = await guest.request.post(`${baseURL}/api/practice/dsa/progress`, { headers: { Origin: baseURL }, data: {} });
  assert.equal(deniedSave.status(), 401);
  const invalid = await desktop.request.post(`${baseURL}/api/practice/dsa/progress`, { headers: { Origin: baseURL }, data: { revision: 0, snapshot: { version: 1 } } });
  assert.equal(invalid.status(), 400);
  await sql`DELETE FROM practice_saves WHERE admin_id = ${admin.id} AND subject = 'dsa'`;
  const guestPage = await guest.newPage();
  await guestPage.goto(`${baseURL}/practice/dsa`);
  assert.equal(new URL(guestPage.url()).pathname, "/admin/login");
  assert.equal(await guestPage.locator('[data-act="start"]').count(), 0);
  await guestPage.getByText("Sign in to start practising and save your progress to your account.").waitFor();
  await guestPage.getByLabel("Email", { exact: true }).fill(email);
  await guestPage.getByLabel("Password", { exact: true }).fill(password);
  await guestPage.getByRole("button", { name: "Sign in", exact: true }).click();
  await guestPage.waitForURL(`${baseURL}/practice/dsa`);
  await guestPage.locator('#t-arrays [data-act="setup"]').click();
  await guestPage.locator('[data-act="start"][data-key="arrays"]').click();
  const guestQuestion = await guestPage.locator(".qid").innerText();
  await guestPage.keyboard.press("ABCDE"[answerFor.get(guestQuestion)]);
  assert.equal(await guestPage.locator(".opt.picked").count(), 1);
  await guestPage.getByRole("button", { name: "Save progress", exact: true }).click();
  await guestPage.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await guestPage.locator('[data-act="next"]').click();
  await guestPage.goto(baseURL);
  // Browser instrumentation detaches keepalive traffic from the old document.
  // Verify the durable save after navigation instead of awaiting network events.
  let stored;
  for (let attempt = 0; attempt < 20; attempt++) {
    [stored] = await sql`SELECT snapshot FROM practice_saves WHERE admin_id = ${admin.id} AND subject = 'dsa'`;
    if (stored?.snapshot?.session?.i === 1) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.equal(stored?.snapshot?.session?.i, 1);
  const resumed = await (await guest.request.get(`${baseURL}/api/practice/dsa/progress`)).json();
  assert.equal(resumed.snapshot.session.i, 1, "leaving the page saves the latest position without clicking Save");
  const raceWriter = randomUUID();
  const sendSequence = (sequence, position, writerId = raceWriter, revision = resumed.revision) => guest.request.post(`${baseURL}/api/practice/dsa/progress`, {
    headers: { Origin: baseURL },
    data: { revision, writerId, sequence, snapshot: { ...resumed.snapshot, session: { ...resumed.snapshot.session, i: position } } },
  });
  const latest = await sendSequence(2, 3);
  assert.equal(latest.status(), 200);
  const delayed = await sendSequence(1, 2);
  assert.equal(delayed.status(), 200);
  const afterRace = await (await guest.request.get(`${baseURL}/api/practice/dsa/progress`)).json();
  assert.equal(afterRace.snapshot.session.i, 3, "an older wrong-answer save cannot overwrite the exit checkpoint");
  assert.equal((await sendSequence(1, 4, randomUUID(), afterRace.revision)).status(), 200);
  assert.equal((await sendSequence(3, 5)).status(), 409, "another device's save must still block stale writers");
  const unavailable = await browser.newContext();
  await unavailable.addCookies([cookie]);
  const unavailablePage = await unavailable.newPage();
  await unavailablePage.route("**/api/practice/dsa/progress", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Unavailable" }) }));
  await unavailablePage.goto(`${baseURL}/practice/dsa`);
  await unavailablePage.getByRole("alert").filter({ hasText: "Saved practice could not be loaded" }).waitFor();
  assert.equal(await unavailablePage.locator('[data-act="start"]').count(), 0, "practice cannot start while the account save is unavailable");
  await unavailable.close();
  await guestPage.goto(`${baseURL}/practice/dsa`);
  await guestPage.locator(".qid").waitFor();
  await guest.clearCookies();
  await guestPage.getByRole("button", { name: "Save progress", exact: true }).click();
  await guestPage.getByRole("link", { name: "Sign in to practise", exact: true }).waitFor();
  assert.equal(await guestPage.locator('[data-act="pick"]').count(), 0, "practice stops when the session expires during a save");
  assert.deepEqual(errors, []);
  console.log("Passed: DB bank load, no requests for correct answers or navigation, wrong-answer autosave, leave autosave, question-45 cross-device resume, Previous, stale-save conflict, reset, timed tests, mobile layout, access controls, and sign-in return.");
} finally {
  if (browser) await browser.close();
  await sql`DELETE FROM admins WHERE id = ${admin.id} AND email = ${email}`;
}
