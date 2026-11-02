import { createHash } from "node:crypto";

export type PracticeTopic = { key: string; name: string; label: string; note?: string; count?: number };
export type PracticeSubject = {
  slug: string; title: string; eyebrow: string; description: string;
  topics: PracticeTopic[]; notesHref?: string; formatNote?: string;
  notesLabel?: string; optionsNote?: string; sourceNote?: string;
  questionCount?: number;
};
export type PracticeTopicRow = { subject: string; topic: string; count: number | string; position: number };

export function isPracticeSubjectSlug(value: string): boolean {
  return value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.exec(value)?.[0] === value;
}

export function practiceTopicKey(name: string): string {
  if (name === "Past Papers (TRE 1-3)") return "pyq";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "topic";
  // The suffix keeps keys stable when different names have the same slug.
  return `${slug}-${createHash("sha256").update(name).digest("hex").slice(0, 12)}`;
}

export function buildPracticeCatalog(rows: PracticeTopicRow[], legacy: readonly PracticeSubject[] = []): PracticeSubject[] {
  const subjects = new Map<string, PracticeSubject>();
  for (const row of rows) {
    if (!isPracticeSubjectSlug(row.subject) || typeof row.topic !== "string" || !row.topic.trim()) continue;
    const count = Number(row.count);
    if (!Number.isSafeInteger(count) || count < 1) continue;
    const previous = legacy.find((subject) => subject.slug === row.subject);
    let subject = subjects.get(row.subject);
    if (!subject) {
      const title = row.subject.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
      subject = {
        slug: row.subject, title, eyebrow: "Practice · Question bank", description: "",
        sourceNote: "Questions, answers and explanations follow the imported question bank. This is a practice resource, not an official answer key.",
        ...previous, topics: [], questionCount: 0,
      };
      subjects.set(row.subject, subject);
    }
    const existing = previous?.topics.find((topic) => topic.name === row.topic);
    subject.topics.push({ key: practiceTopicKey(row.topic), name: row.topic, label: row.topic, ...existing, count });
    subject.questionCount! += count;
  }
  return [...subjects.values()].map((subject) => ({
    ...subject,
    description: subject.description || `${subject.questionCount} questions across ${subject.topics.length} ${subject.topics.length === 1 ? "topic" : "topics"}, with explanations, timed tests and saved progress.`,
  }));
}
