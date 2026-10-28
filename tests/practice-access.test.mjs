import assert from "node:assert/strict";
import test from "node:test";
import { isPracticeQuizPath, practiceReturnPath } from "../src/lib/practice-access.ts";

test("all quiz pages require login while notes and the subject list stay public", () => {
  for (const subject of ["dbms", "oops", "dsa", "history"]) {
    assert.equal(isPracticeQuizPath(`/practice/${subject}`), true);
    assert.equal(isPracticeQuizPath(`/practice/${subject}/notes`), false);
    assert.equal(isPracticeQuizPath(`/practice/${subject}/notes/chapter-01`), false);
  }
  assert.equal(isPracticeQuizPath("/practice"), false);
  assert.equal(isPracticeQuizPath("/practice/missing"), false);
});

test("login returns to the chosen subject and preserves chapter or topic filters", () => {
  for (const path of ["/practice/dsa", "/practice/history?chapter=chapter-01", "/practice/dbms?topic=sqq"]) {
    assert.equal(practiceReturnPath(path), path);
  }
  assert.equal(practiceReturnPath("/dsa-practice.html"), "/practice/dsa");
});

test("login rejects external and unexpected return destinations", () => {
  for (const value of [null, undefined, 42, "https://example.com/practice/dsa", "//example.com/practice/dsa", "/practice/dsa/../../admin", "/practice/dsa#test", "/practice/missing", "/practice/dsa\\example.com", "/practice/dsa\n"]) {
    assert.equal(practiceReturnPath(value), "/admin");
  }
});
