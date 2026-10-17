import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PRACTICE_TEST_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let activePage;
await mkdir("screenshots/practice", { recursive: true });

async function dockIsReachable(page) {
  assert.equal(await page.locator(".qnav").evaluate((node) => getComputedStyle(node).position), "fixed");
  for (const action of ["previous", "next"]) {
    const visible = await page.locator(`[data-act="${action}"]`).evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth
        && node.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    });
    assert.equal(visible, true, `${action} stays visible and unobstructed`);
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

try {
  for (const subject of ["dsa", "history"]) {
    const response = await fetch(`${base}/api/practice/${subject}/questions`);
    const bank = (await response.json()).questions;
    const answers = new Map(bank.map((q) => [q.id, "ABCDE".indexOf(q.ans)]));
    for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      console.log(`Checking ${subject} at ${viewport.width} x ${viewport.height}`);
      const context = await browser.newContext({ viewport, isMobile: true, hasTouch: true });
      const page = await context.newPage();
      activePage = page;
      page.setDefaultTimeout(10000);
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("dialog", (dialog) => dialog.accept());
      const calls = [];
      page.on("request", (request) => { if (request.url().includes("/api/practice/")) calls.push(request.method()); });
      await page.goto(`${base}/practice/${subject}`);
      await page.locator(".ledger").waitFor({ timeout: 30000 });
      const key = subject === "dsa" ? "arrays" : "chapter-01";
      await page.locator(`[data-act="setup"][data-key="${key}"]`).click();
      const sizeOption = page.locator('label[for="ps-0"]');
      await sizeOption.scrollIntoViewIfNeeded();
      const sizeBounds = await sizeOption.boundingBox();
      await page.touchscreen.tap(sizeBounds.x + sizeBounds.width / 2, sizeBounds.y + sizeBounds.height / 2);
      assert.equal(await page.locator("#ps-0").isChecked(), true);
      await page.locator(`[data-act="start"][data-key="${key}"]`).click();
      await dockIsReachable(page);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      const back = await page.locator('[data-act="quit"]').boundingBox();
      const save = await page.getByRole("link", { name: "Sign in to save" }).boundingBox();
      assert.ok(back.x + back.width < save.x, "Topics and Save occupy opposite sides");
      assert.equal(await page.locator('[data-act="next"]').isDisabled(), true);
      const firstId = await page.locator(".qid").innerText();
      await page.locator(`[data-act="pick"][data-i="${answers.get(firstId)}"]`).click();
      await page.locator(".teach").waitFor();
      await dockIsReachable(page);
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await dockIsReachable(page);
      await page.locator('[data-act="reset-session"]').scrollIntoViewIfNeeded();
      const reset = await page.locator('[data-act="reset-session"]').boundingBox();
      const dock = await page.locator(".qnav").boundingBox();
      assert.ok(reset.y + reset.height <= dock.y, "bottom controls do not hide reset or final content");
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      if (viewport.width === 390) await page.screenshot({ path: `screenshots/practice/${subject}-sticky-navigation.png` });
      await page.locator('[data-act="next"]').click();
      assert.notEqual(await page.locator(".qid").innerText(), firstId);
      await page.locator('[data-act="previous"]').click();
      assert.equal(await page.locator(".qid").innerText(), firstId);
      assert.equal(calls.length, 2, "correct answers and navigation still make no extra API requests");
      await page.locator('[data-act="quit"]').click();
      await page.locator('[data-act="setup"][data-key="test"]').click();
      await page.locator('[data-act="start-test"]').click();
      await dockIsReachable(page);
      await page.locator('[data-act="skip"]').click();
      assert.match(await page.locator(".qbar .right").innerText(), /2 \/ 16/);
      await page.locator('[data-act="previous"]').click();
      await dockIsReachable(page);
      if (viewport.width === 390) await page.screenshot({ path: `screenshots/practice/${subject}-sticky-timed-test.png` });
      await page.locator('[data-act="finish"]').click();
      await page.getByRole("heading", { name: "Review", exact: true }).waitFor();
      assert.equal(await page.locator(".qnav").count(), 0, "dock disappears outside a question session");
      await context.close();
    }
  }
  assert.deepEqual(errors, []);
  console.log("Passed: DSA/history mobile and landscape sticky navigation, separated header actions, reachable Next before/after answers and scrolling, no obscured final content, Previous, timed Skip/Finish, and unchanged API behaviour.");
} catch (error) {
  if (activePage && !activePage.isClosed()) await activePage.screenshot({ path: "screenshots/practice/sticky-navigation-failure.png" });
  throw error;
} finally {
  await browser.close();
}
