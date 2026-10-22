import chapters from "@/content/history/chapters.json";
import oopChapters from "@/content/oops/chapters.json";
import dbmsTopics from "@/content/dbms/topics.json";
import { topics as dsaTopics } from "./practice-quiz";

export type PracticeTopic = { key: string; name: string; label: string; note?: string };
export type PracticeSubject = {
  slug: string; title: string; eyebrow: string; description: string;
  topics: PracticeTopic[]; notesHref?: string; formatNote?: string;
  notesLabel?: string; optionsNote?: string; sourceNote?: string;
};

export const practiceSubjects: PracticeSubject[] = [
  {
    slug: "dbms", title: "TRE DBMS Question Bank", eyebrow: "BPSC TRE · Computer Science · Database Management Systems",
    description: "Database fundamentals, SQL, normalization, transactions, indexing and more, including 35 past-paper questions.",
    topics: dbmsTopics,
    sourceNote: "Questions, answers and explanations are preserved from the supplied DBMS question bank. Past-paper labels follow that file; this is a practice resource, not an official answer key.",
  },
  {
    slug: "oops", title: "OOP & Language Foundations", eyebrow: "BPSC TRE · Computer Science · C / C++ / Java / Python",
    description: "Both assignments, with explanations and a beginner-friendly path from Python to C, C++ and Java.",
    topics: oopChapters.filter((chapter) => chapter.count > 0).map((chapter) => ({ key: chapter.key, name: chapter.title, label: chapter.title })),
    notesHref: "/practice/oops/notes", notesLabel: "Read notes",
    formatNote: "199 original questions: 160 scored and 39 review-only. Unclear questions remain available with explanations but are excluded from timed tests and accuracy.",
    optionsNote: "Read all five choices as printed. D and E do not always mean multiple answers or none. Review-only questions have no uniquely defensible answer under the stated language baseline.",
    sourceNote: "The supplied assignments are study material, not an official BPSC answer key. Original numbering and source keys are retained. Corrections use C17, C++17 and Java 17; ambiguous items are discussed without scoring.",
  },
  {
    slug: "dsa", title: "TRE DSA Question Bank", eyebrow: "BPSC TRE 4.0 · Computer Science · Class 11–12",
    description: "Questions from arrays to P vs NP, including the 47 DSA questions from TRE 1–3.", topics: dsaTopics,
  },
  {
    slug: "history", title: "Bihar History & Indian National Movement", eyebrow: "BPSC · History · 24 chapters",
    description: "English practice questions, with Hindi chapter notes, timelines and revision tables.",
    topics: chapters.map((chapter) => ({ key: chapter.key, name: chapter.name, label: chapter.name })),
    notesHref: "/practice/history/notes",
    formatNote: "These questions use the supplied practice format: A–C are substantive choices, D means more than one, and E means none. This is not an official OMR simulation. Check the latest exam instructions for answer and skip options.",
  },
];

export function getPracticeSubject(slug: string) {
  return practiceSubjects.find((subject) => subject.slug === slug);
}

export function practiceReturnPath(value: unknown) {
  if (value === "/dsa-practice.html") return "/practice/dsa";
  return practiceSubjects.some((subject) => value === `/practice/${subject.slug}`) ? String(value) : "/admin";
}
