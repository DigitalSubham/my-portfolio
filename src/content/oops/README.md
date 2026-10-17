# OOP study pack

The complete notes are authored in `lessons.mjs` and rendered together at
`/practice/oops/notes`. The original three PDFs, all
93 extracted source pages and all 199 printed questions remain preserved.
`reviews.json` maps each assignment number to a reviewed answer, lesson key and
explanation. A null answer means review-only: retain the question without scoring.

Assignment 1 prints questions 1-98 and 100. Its key entry 99 belongs to question
98; no question 99 is invented. Repeated questions in assignment 2 are retained.
Three wrapped C++ line comments are joined explicitly during import. The original
text and a visible transcription note remain available beside each affected item.

## Updating

1. Extract the supplied PDFs with `scripts/extract-oops.py` (requires pypdf).
2. Edit the authored lessons or individual review entries.
3. Run `node scripts/import-oops.mjs` to regenerate seeds and chapter metadata.
4. Run `npm run test:practice` and `npm run test:oops-code`.
5. Run `npm run db:oops` with the existing DATABASE_URL to upsert the OOP subject.
   The import does not change other subjects or saved progress.

Code checks require C/C++ compilers, Java 17, Python 3 and Node. Tests run only
explicitly classified safe assignment programs. Undefined expressions and
nonterminating examples receive syntax checks, never output-based validation.
Machine-size questions retain the assumptions printed in their question stems.

Separate comparison images and their page viewer have been removed. Existing
topic URLs redirect to anchors within the continuous notes page. Section IDs
are namespaced to keep all topic headings addressable without collisions.

Browser checks: `tests/oops-browser.mjs` verifies database notes, mobile reading,
review-only scoring, timed exclusions and cross-device saves using a temporary
test account removed afterward. `tests/practice-mobile-browser.mjs` checks sticky
navigation for all three subjects. Both accept PLAYWRIGHT_MODULE and
PRACTICE_TEST_URL for the available browser installation and test server.
