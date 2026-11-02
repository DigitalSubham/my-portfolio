# Importing practice banks

Once the dynamic practice routes are deployed, importing a bank is the only step needed to publish a new practice subject:

```sh
npm run db:import -- computer-fundamentals /path/to/questions.json
```

Choose a stable lowercase subject slug and keep existing question IDs and topic names stable. The importer validates the question array, writes it to `practice_questions`, and verifies every stored question against the input. It preserves other subjects and account saves. Repeat the command with the complete bank to update or add questions. It rejects banks that omit existing question IDs, which could break saved sessions.

The practice list, question counts, topics, quiz page, login return, and account saves discover the subject directly from those rows on the next request. There is no subject page, registry entry, generated topic file, or database schema migration to add. Direct database inserts using the same `subject`, `id`, `position`, and `data` columns work too.

Each question needs a unique `id`, `topic`, `subtopic`, `q`, five `opts`, an `ans` from A–E, `exp`, `type`, and `level` from 1–3. The quiz also supports `concept`, five `why` explanations, `code`, `work`, and `tip`.

The original four subjects retain compatibility metadata in `practice-legacy.ts` so their existing topic keys, account saves, public notes, and source annotations remain intact. That file does not control which subjects are published; new subjects need no entry there.
