export type Note = {
  slug: string;
  title: string;
  /** Shown as the H1 on the note page. Can be longer than the SEO title. */
  heading: string;
  /** 150-160 chars, used for meta description and OG description. */
  description: string;
  /** One-line summary used on cards. */
  excerpt: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  track: string;
  topicCount: number;
  /** Anchor list rendered as the in-page table of contents. */
  outline: { id: string; label: string }[];
  /** Rendered as FAQPage structured data on the note page. */
  faqs: { question: string; answer: string }[];
};

export const notes: Note[] = [
  {
    slug: "javascript-language-fundamentals",
    title: "JavaScript Language Fundamentals Explained Simply",
    heading: "JavaScript language fundamentals, in plain English",
    description:
      "var vs let vs const, hoisting, the temporal dead zone, coercion, shallow copies and more - 14 JavaScript fundamentals explained simply with diagrams and interview answers.",
    excerpt:
      "The 14 fundamentals every JavaScript interview starts with, explained in plain English with diagrams, gotchas and the answer to say out loud.",
    keywords: [
      "javascript fundamentals",
      "temporal dead zone",
      "javascript hoisting explained",
      "var let const difference",
      "shallow copy vs deep copy javascript",
      "javascript interview questions",
      "why 0.1 + 0.2 is not 0.3",
      "nullish coalescing vs or operator",
    ],
    publishedAt: "2026-08-28",
    updatedAt: "2026-08-28",
    readingMinutes: 24,
    track: "JavaScript",
    topicCount: 14,
    outline: [
      { id: "var-let-and-const", label: "var, let and const" },
      { id: "hoisting", label: "Hoisting" },
      { id: "primitives-and-objects", label: "Primitives and objects" },
      { id: "equality-truthy-and-falsy", label: "Equality, truthy and falsy" },
      { id: "typeof-and-instanceof", label: "typeof and instanceof" },
      { id: "destructuring", label: "Destructuring" },
      { id: "spread-rest-and-copying", label: "Spread, rest and copying" },
      { id: "optional-chaining-and-nullish-coalescing", label: "Optional chaining and ??" },
      { id: "template-literals", label: "Template literals" },
      { id: "strict-mode", label: "Strict mode" },
      { id: "floating-point-precision", label: "Floating point precision" },
      { id: "json-stringify-and-parse", label: "JSON stringify and parse" },
      { id: "symbols", label: "Symbols" },
      { id: "labels-and-switch", label: "Labels and switch" },
      { id: "ten-questions", label: "Ten questions" },
      { id: "six-exercises", label: "Six exercises" },
    ],
    faqs: [
      {
        question: "What is the temporal dead zone in JavaScript?",
        answer:
          "The temporal dead zone is the period between the start of a block and the line that declares a let or const variable. The variable already exists during this period but cannot be read, so accessing it throws a ReferenceError. It exists so that const can never be observed holding undefined.",
      },
      {
        question: "What is the difference between var, let and const?",
        answer:
          "var is function scoped and starts as undefined, so reading it early returns undefined. let and const are block scoped and stay locked until their declaration line runs, so reading them early throws a ReferenceError. const also prevents reassigning the variable, though you can still change the contents of an object it points to.",
      },
      {
        question: "Why does 0.1 + 0.2 not equal 0.3 in JavaScript?",
        answer:
          "Every JavaScript number is stored as a 64-bit binary floating point value. Numbers like 0.1 cannot be represented exactly in base 2, so the closest storable value is used. Adding two of those approximations makes the error visible, giving 0.30000000000000004. Compare floats with a tolerance such as Number.EPSILON, and store money as whole paise or cents instead.",
      },
      {
        question: "What is the difference between ?? and || in JavaScript?",
        answer:
          "The || operator falls back whenever the left side is any falsy value, including 0, an empty string and false. The ?? operator falls back only when the left side is null or undefined. For user settings and API data, ?? is usually correct because it preserves a deliberate 0 or empty string.",
      },
      {
        question: "Is JavaScript pass by value or pass by reference?",
        answer:
          "JavaScript is always pass by value. For objects, the value being copied is the reference itself. That is why changing a property inside a function is visible to the caller, while reassigning the whole parameter is not.",
      },
    ],
  },
];

export const notesBySlug = new Map(notes.map((note) => [note.slug, note]));

export function getNote(slug: string): Note | undefined {
  return notesBySlug.get(slug);
}

export function getAdjacentNotes(slug: string) {
  const index = notes.findIndex((note) => note.slug === slug);
  return {
    previous: index > 0 ? notes[index - 1] : null,
    next: index >= 0 && index < notes.length - 1 ? notes[index + 1] : null,
  };
}
