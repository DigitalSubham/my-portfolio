import chapters from "@/content/history/chapters.json";
import { topics as dsaTopics } from "./practice-quiz";

export type PracticeTopic = { key: string; name: string; label: string; note?: string };
export type PracticeSubject = {
  slug: string; title: string; eyebrow: string; description: string;
  topics: PracticeTopic[]; notesHref?: string; formatNote?: string;
};

export const practiceSubjects: PracticeSubject[] = [
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
