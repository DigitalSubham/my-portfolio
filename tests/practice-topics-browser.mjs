import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHmac, randomUUID, scryptSync } from "node:crypto";
import { readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

nextEnv.loadEnvConfig(process.cwd());
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PRACTICE_TEST_URL || "http://localhost:3000";
const sql = neon(process.env.DATABASE_URL);
const bank = JSON.parse(await readFile(new URL("../db/seeds/dsa-questions.json", import.meta.url), "utf8"));
const answers = new Map(bank.map((q) => [q.id, "ABCDE".indexOf(q.ans)]));
const email = `practice-topics-${randomUUID()}@example.invalid`, salt = randomUUID();
const hash = scryptSync(randomUUID(), salt, 64).toString("hex");
const [admin] = await sql`INSERT INTO admins (email, password_hash, password_salt) VALUES (${email}, ${hash}, ${salt}) RETURNING id`;
const unsigned = [{ alg: "HS256", typ: "JWT" }, { sub: String(admin.id), email, exp: Math.floor(Date.now() / 1000) + 3600 }].map((value) => Buffer.from(JSON.stringify(value)).toString("base64url")).join(".");
const token = `${unsigned}.${createHmac("sha256", process.env.JWT_SECRET).update(unsigned).digest("base64url")}`;
const cookie = { name: "portfolio_admin_token", value: token, url: base };
let browser;

try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addCookies([cookie]);
  const page = await context.newPage();
  const errors = [], dialogs = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("dialog", async (dialog) => { dialogs.push(dialog.message()); await dialog.dismiss(); });
  const saved = (target) => target.getByRole("status").filter({ hasText: "Saved to your account" }).waitFor();
  await page.goto(`${base}/practice/dsa`);
  await page.locator('#t-arrays [data-act="setup"]').click();
  await page.locator('label[for="ps-2"]').click();
  await page.locator('[data-act="start"][data-key="arrays"]').click();
  const firstId = await page.locator(".qid").innerText();
  for (let i = 0; i < 25; i++) {
    const id = await page.locator(".qid").innerText();
    await page.locator(`[data-act="pick"][data-i="${answers.get(id)}"]`).click();
    await page.locator('[data-act="next"]').click();
  }
  const question26 = await page.locator(".qid").innerText();
  assert.match(await page.locator(".qbar .right").innerText(), /26 \/ 50/);
  await page.locator('[data-act="quit"]').click();
  await saved(page);
  await page.locator('#t-arrays [data-act="resume-topic"]').getByText("Continue · 26 / 50").waitFor();

  await page.locator('#t-stacks [data-act="setup"]').click();
  await page.locator('label[for="ps-0"]').click();
  await page.locator('[data-act="start"][data-key="stacks"]').click();
  await saved(page);
  const stacksFirst = await page.locator(".qid").innerText();
  await page.locator(`[data-act="pick"][data-i="${answers.get(stacksFirst)}"]`).click();
  await page.locator('[data-act="next"]').click();
  const stacksSecond = await page.locator(".qid").innerText();
  await page.locator('[data-act="quit"]').click();
  await saved(page);
  await page.locator('#t-arrays [data-act="resume-topic"]').click();
  assert.equal(await page.locator(".qid").innerText(), question26);
  assert.match(await page.locator(".qbar .right").innerText(), /26 \/ 50/);
  await saved(page);
  assert.deepEqual(dialogs, [], "switching between topics must not warn or reset a session");
  await page.locator('[data-act="previous"]').click();
  assert.equal(await page.locator(".opt.picked").count(), 1, "the original 25 answers remain in the session");
  await page.locator('[data-act="next"]').click();
  await page.getByRole("button", { name: "Save progress", exact: true }).click();
  await saved(page);
  await page.reload();
  await page.locator(".qid").waitFor();
  assert.equal(await page.locator(".qid").innerText(), question26);

  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  await phone.addCookies([cookie]);
  const mobile = await phone.newPage();
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(`${base}/practice/dsa`);
  await mobile.locator(".qid").waitFor();
  assert.equal(await mobile.locator(".qid").innerText(), question26, "another device resumes question 26 of the original 50");
  await mobile.locator('[data-act="quit"]').click();
  await saved(mobile);
  await mobile.locator('#t-stacks [data-act="resume-topic"]').click();
  assert.equal(await mobile.locator(".qid").innerText(), stacksSecond);
  assert.match(await mobile.locator(".qbar .right").innerText(), /2 \/ 10/);
  await mobile.locator('[data-act="quit"]').click();
  await saved(mobile);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

  const snapshot = (await (await phone.request.get(`${base}/api/practice/dsa/progress`)).json()).snapshot;
  assert.equal(snapshot.sessions.arrays.list.length, 50);
  assert.equal(snapshot.sessions.arrays.list[0], firstId);
  assert.equal(snapshot.sessions.arrays.i, 25);
  assert.equal(Object.keys(snapshot.sessions.arrays.picks).length, 25);
  assert.equal(snapshot.sessions.stacks.i, 1);

  const warnings = [];
  mobile.on("dialog", async (dialog) => { warnings.push(dialog.message()); await dialog.dismiss(); });
  await mobile.locator('#t-arrays [data-act="setup"]').click();
  await mobile.locator('[data-act="start"][data-key="arrays"]').click();
  assert.equal(warnings.length, 1, "deliberately replacing the same topic still asks for confirmation");
  assert.match(warnings[0], /only this topic's unfinished session/);
  await mobile.locator('#t-arrays [data-act="resume-topic"]').first().click();
  assert.equal(await mobile.locator(".qid").innerText(), question26, "cancelling a new session keeps the saved position");
  await mobile.locator('[data-act="quit"]').click();
  await saved(mobile);
  await mobile.locator('[data-act="reset"]').click();
  await mobile.getByRole("button", { name: "Yes, clear my progress" }).click();
  await saved(mobile);
  assert.equal(await mobile.locator('[data-act="resume-topic"]').count(), 0);
  const cleared = (await (await phone.request.get(`${base}/api/practice/dsa/progress`)).json()).snapshot;
  assert.equal(cleared.session, null);
  assert.equal(cleared.sessions, undefined);
  assert.deepEqual(errors, []);
  console.log("Passed: question 26/50 resume, original order and answers, independent topic positions, switching without warnings, database round-trip, reload and cross-device resume, explicit restart confirmation, mobile layout, and full reset.");
} finally {
  if (browser) await browser.close();
  await sql`DELETE FROM admins WHERE id = ${admin.id} AND email = ${email}`;
}
