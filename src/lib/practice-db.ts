import { getSql } from "./db";
import type { PracticeQuestion } from "./practice-state";

export async function getPracticeQuestions(subject = "dsa"): Promise<PracticeQuestion[]> {
  const rows = await getSql()`SELECT data FROM practice_questions WHERE subject = ${subject} ORDER BY position, id` as { data: PracticeQuestion }[];
  if (!rows.length) throw new Error("This question bank has not been imported.");
  return rows.map((row) => row.data as PracticeQuestion);
}
