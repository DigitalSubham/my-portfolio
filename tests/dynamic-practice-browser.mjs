import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHmac, randomUUID, scryptSync } from "node:crypto";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { importQuestionBank } from "../scripts/import-practice.mjs";

nextEnv.loadEnvConfig(process.cwd());
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PRACTICE_TEST_URL || "http://localhost:3000";
const sql = neon(process.env.DATABASE_URL);
const subject = `dynamic-check-${randomUUID()}`;
const title = subject.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const email = `practice-dynamic-${randomUUID()}@example.invalid`, salt = randomUUID();
const hash = scryptSync(randomUUID(), salt, 64).toString("hex");
const [admin] = await sql`INSERT INTO admins (email, password_hash, password_salt) VALUES (${email}, ${hash}, ${salt}) RETURNING id`;
const unsigned = [{ alg: "HS256", typ: "JWT" }, { sub: String(admin.id), email, exp: Math.floor(Date.now() / 1000) + 3600 }].map((value) => Buffer.from(JSON.stringify(value)).toString("base64url")).join(".");
const token = `${unsigned}.${createHmac("sha256", process.env.JWT_SECRET).update(unsigned).digest("base64url")}`;
const cookie = { name: "portfolio_admin_token", value: token, url: base };
const question = (id, topic) => ({ id, topic, subtopic: "Introduction", q: `Sample ${id}?`, opts: ["One", "Two", "Three", "More than one", "None"], ans: "A", exp: "One is correct.", level: 1, type: "concept" });
const bank = [question("DYN-1", "New topic"), question("DYN-2", "New topic"), question("DYN-3", "New topic")];
let browser;

try {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext();
  await context.addCookies([cookie]);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Warm both routes before inserting anything: cached lists/404s must not hide imports.
  await page.goto(`${base}/practice`);
  assert.equal(await page.locator(`a[href="/practice/${subject}"]`).count(), 0);
  assert.equal((await context.request.get(`${base}/practice/${subject}`)).status(), 404);
  assert.equal((await context.request.get(`${base}/api/practice/${subject}/questions`)).status(), 404);
  assert.equal(await importQuestionBank(sql, subject, bank), 3);

  await page.reload();
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await card.getByRole("link", { name: "Practise", exact: true }).click();
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
  await page.locator(".ledger > article").first().waitFor();
  assert.equal(await page.locator(".ledger > article").count(), 1);
  const key = (await page.locator(".ledger > article").first().getAttribute("id")).slice(2);
  await page.locator(`[data-act="setup"][data-key="${key}"]`).click();
  await page.locator(`[data-act="start"][data-key="${key}"]`).click();
  const firstId = await page.locator(".qid").innerText();
  await page.locator('[data-act="pick"][data-i="0"]').click();
  await page.locator('[data-act="next"]').click();
  const secondId = await page.locator(".qid").innerText();
  await page.locator('[data-act="quit"]').click();
  await page.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  const stored = (await (await context.request.get(`${base}/api/practice/${subject}/progress`)).json()).snapshot;
  assert.equal(stored.session.i, 1);
  assert.equal(stored.session.picks[firstId], 0);

  // Adding a topic changes the live catalog but does not rename existing topic keys.
  const expanded = [...bank, question("DYN-4", "Another new topic")];
  assert.equal(await importQuestionBank(sql, subject, expanded), 4);
  assert.equal(await importQuestionBank(sql, subject, expanded), 4, "reimport is idempotent");
  await assert.rejects(() => importQuestionBank(sql, subject, bank), /omits existing questions/);
  assert.equal((await sql`SELECT count(*)::int AS count FROM practice_questions WHERE subject = ${subject}`)[0].count, 4);
  await page.goto(`${base}/practice/${subject}?topic=${key}`);
  await page.locator(".qid").waitFor();
  assert.equal(await page.locator(".qid").innerText(), secondId, "a direct topic link resumes the original session after import");
  await page.locator('[data-act="quit"]').click();
  await page.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  assert.equal(await page.locator(".ledger > article").count(), 2);
  assert.equal(await page.locator(`#t-${key} [data-act="resume-topic"]`).count(), 1);
  await page.goto(`${base}/practice`);
  await page.getByRole("article").filter({ has: page.getByRole("heading", { name: title, exact: true }) }).getByText("4 questions · 2 topics", { exact: true }).waitFor();

  const guest = await browser.newContext();
  const denied = await guest.request.get(`${base}/practice/${subject}?topic=${key}`, { maxRedirects: 0 });
  assert.equal(denied.status(), 307);
  assert.equal(new URL(denied.headers().location, base).searchParams.get("next"), `/practice/${subject}?topic=${key}`);
  assert.equal((await guest.request.get(`${base}/api/practice/${subject}/questions`)).status(), 401);
  for (const path of ["/practice/oops/notes", "/practice/history/notes"]) assert.equal((await guest.request.get(`${base}${path}`)).status(), 200);
  assert.deepEqual(errors, []);
  console.log("Passed: a database-only import creates a subject, page, topics and counts without restart; live additions, idempotent imports, omitted-question protection, account saving, direct-link resume, authentication and existing public notes.");
} finally {
  if (browser) await browser.close();
  await sql`DELETE FROM practice_questions WHERE subject = ${subject}`;
  await sql`DELETE FROM admins WHERE id = ${admin.id} AND email = ${email}`;
}
