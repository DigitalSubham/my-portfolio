export type PracticeQuestion = {
  id: string;
  topic: string;
  subtopic: string;
  q: string;
  opts: string[];
  ans: string;
  exp: string;
  level: number;
  type: string;
  [key: string]: unknown;
};

export type PracticeSnapshot = {
  version: 1;
  progress: Record<string, { r: Record<string, [number, number, number]>; h: string }>;
  session: null | {
    kind: "practice" | "test";
    title: string;
    list: string[];
    i: number;
    picks: Record<string, number>;
    key: string | null;
    done: boolean;
    limit?: number;
    remainingSeconds?: number;
    used?: number;
  };
  view: "home" | "q" | "done";
};

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validatePracticeSnapshot(value: unknown, questions: PracticeQuestion[]): PracticeSnapshot {
  const fail = (): never => { throw new Error("Invalid practice save. Reload the quiz and try again."); };
  if (!object(value) || value.version !== 1 || !object(value.progress) || !["home", "q", "done"].includes(String(value.view))) return fail();
  const byId = new Map(questions.map((question) => [question.id, question]));
  const progress: PracticeSnapshot["progress"] = {};
  const topicKeys = new Set(["pyq", "arrays", "lists", "stacks", "queues", "trees", "sorting", "graphs", "hashing", "analysis", "paradigms"]);
  for (const [key, entry] of Object.entries(value.progress)) {
    if (!topicKeys.has(key) || !object(entry) || !object(entry.r) || typeof entry.h !== "string" || !/^[01]{0,50}$/.test(entry.h)) return fail();
    const records: Record<string, [number, number, number]> = {};
    for (const [id, record] of Object.entries(entry.r)) {
      if (!byId.has(id) || !Array.isArray(record) || record.length !== 3 ||
        !record.every(Number.isSafeInteger) || record[0] < 1 || record[0] > 1_000_000 ||
        record[1] < 0 || record[1] > record[0] || ![0, 1].includes(record[2])) return fail();
      records[id] = record as [number, number, number];
    }
    progress[key] = { r: records, h: entry.h };
  }
  let session: PracticeSnapshot["session"] = null;
  if (value.session !== null) {
    const saved = value.session;
    if (!object(saved) || !["practice", "test"].includes(String(saved.kind)) ||
      typeof saved.title !== "string" || saved.title.length > 250 || !Array.isArray(saved.list) ||
      !saved.list.length || saved.list.length > questions.length || new Set(saved.list).size !== saved.list.length ||
      !saved.list.every((id) => typeof id === "string" && byId.has(id)) ||
      !Number.isInteger(saved.i) || Number(saved.i) < 0 || Number(saved.i) >= saved.list.length ||
      !object(saved.picks) || typeof saved.done !== "boolean" ||
      !(saved.key === null || typeof saved.key === "string" && topicKeys.has(saved.key))) return fail();
    const picks: Record<string, number> = {};
    for (const [id, pick] of Object.entries(saved.picks)) {
      if (!saved.list.includes(id) || !Number.isInteger(pick) || Number(pick) < 0 || Number(pick) > 4) return fail();
      picks[id] = Number(pick);
    }
    session = {
      kind: saved.kind as "practice" | "test", title: saved.title, list: saved.list as string[],
      i: Number(saved.i), picks, key: saved.key as string | null, done: saved.done,
    };
    if (saved.kind === "test") {
      if (!Number.isInteger(saved.limit) || Number(saved.limit) !== saved.list.length * 60 ||
        !Number.isInteger(saved.remainingSeconds) || Number(saved.remainingSeconds) < 0 || Number(saved.remainingSeconds) > Number(saved.limit) ||
        !Number.isInteger(saved.used) || Number(saved.used) < 0 || Number(saved.used) > Number(saved.limit)) return fail();
      session.limit = Number(saved.limit);
      session.remainingSeconds = Number(saved.remainingSeconds);
      session.used = Number(saved.used);
    }
  }
  if (value.view !== "home" && !session || value.view === "done" && !session?.done || value.view === "q" && session?.done) return fail();
  return { version: 1, progress, session, view: value.view as PracticeSnapshot["view"] };
}
