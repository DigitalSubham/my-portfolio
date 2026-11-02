import { cache } from "react";
import { getSql } from "./db";
import { buildPracticeCatalog, isPracticeSubjectSlug, type PracticeTopicRow } from "./practice-catalog";
import { legacyPracticeSubjects } from "./practice-legacy";

export type { PracticeSubject, PracticeTopic } from "./practice-catalog";

// Request-scoped only: an imported bank is visible on the next request.
export const getPracticeSubjects = cache(async () => {
  const rows = await getSql()`
    SELECT subject, data->>'topic' AS topic, count(*)::int AS count, min(position)::int AS position
    FROM practice_questions
    GROUP BY subject, data->>'topic'
    ORDER BY subject, min(position), data->>'topic'
  ` as PracticeTopicRow[];
  return buildPracticeCatalog(rows, legacyPracticeSubjects);
});

export const getPracticeSubject = cache(async (slug: string) => {
  if (!isPracticeSubjectSlug(slug)) return undefined;
  const rows = await getSql()`
    SELECT subject, data->>'topic' AS topic, count(*)::int AS count, min(position)::int AS position
    FROM practice_questions WHERE subject = ${slug}
    GROUP BY subject, data->>'topic'
    ORDER BY min(position), data->>'topic'
  ` as PracticeTopicRow[];
  return buildPracticeCatalog(rows, legacyPracticeSubjects)[0];
});
