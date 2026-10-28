import type { PracticeQuestion, PracticeSnapshot } from "./practice-state";

export const topics = [
  { key: "pyq", name: "Past Papers (TRE 1-3)", label: "Past papers: TRE 1\u20133", note: "The 47 DSA questions BPSC actually asked" },
  { key: "arrays", name: "Arrays & Basics", label: "Arrays & basics" },
  { key: "lists", name: "Linked Lists", label: "Linked lists" },
  { key: "stacks", name: "Stacks & Expressions", label: "Stacks & expressions" },
  { key: "queues", name: "Queues", label: "Queues", note: "Most-asked DSA area in TRE 1\u20133" },
  { key: "trees", name: "Trees", label: "Trees" },
  { key: "sorting", name: "Sorting & Searching", label: "Sorting & searching" },
  { key: "graphs", name: "Graphs", label: "Graphs" },
  { key: "hashing", name: "Hashing", label: "Hashing" },
  { key: "analysis", name: "Algorithm Analysis", label: "Algorithm analysis" },
  { key: "paradigms", name: "Paradigms & P/NP", label: "Paradigms & P/NP" },
];

export type QuizQuestion = PracticeQuestion & { k: string };
export type QuizSession = NonNullable<PracticeSnapshot["session"]> & { start?: number };
export type QuizState = Omit<PracticeSnapshot, "session"> & { session: QuizSession | null };
export const emptyQuiz = (): QuizState => ({ version: 1, progress: {}, session: null, view: "home" });
export const letters = ["A", "B", "C", "D", "E"];
export const percent = (value: number | null) => value == null ? "\u2013" : `${Math.round(value * 100)}%`;
export const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
export const sectionOf = (q: QuizQuestion) => q.sec || (q.k === "pyq" ? q.subtopic.split(" \u00b7 ")[1] || q.subtopic : q.subtopic);
export const recordOf = (state: QuizState, q: QuizQuestion) => state.progress[q.k]?.r[q.id];

export function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function recordAnswer(state: QuizState, q: QuizQuestion, correct: boolean): QuizState {
  if (q.unscored) return state;
  const topic = state.progress[q.k] || { r: {}, h: "" };
  const before = topic.r[q.id] || [0, 0, 0];
  const record: [number, number, number] = [before[0] + 1, before[1] + (correct ? 1 : 0), correct ? 1 : 0];
  return { ...state, progress: { ...state.progress, [q.k]: { r: { ...topic.r, [q.id]: record }, h: (topic.h + (correct ? "1" : "0")).slice(-50) } } };
}

export function quizStats(state: QuizState, questions: QuizQuestion[], history = "") {
  questions = questions.filter((q) => !q.unscored);
  let done = 0, attempts = 0, correct = 0, wrong = 0, lastRight = 0;
  for (const q of questions) {
    const r = recordOf(state, q);
    if (!r?.[0]) continue;
    done++; attempts += r[0]; correct += r[1];
    if (r[2]) lastRight++; else wrong++;
  }
  return { total: questions.length, done, attempts, correct, wrong, lastRight, acc: attempts ? correct / attempts : null, history };
}

export function topicStatus(stats: ReturnType<typeof quizStats>) {
  const recent = stats.history.length ? [...stats.history].filter((v) => v === "1").length / stats.history.length : null;
  if (!stats.done) return { cls: "", text: "Not started" };
  if (stats.history.length >= Math.min(50, stats.total) && recent !== null && recent >= 0.85) return { cls: "ready", text: `Ready \u00b7 last ${stats.history.length}: ${percent(recent)}` };
  if (stats.history.length >= 20 && recent !== null && recent < 0.7) return { cls: "low", text: `Needs work \u00b7 last ${stats.history.length}: ${percent(recent)}` };
  return { cls: "work", text: `In progress \u00b7 last ${stats.history.length}: ${percent(recent)}` };
}

export function remainingTime(state: QuizState, now = Date.now()) {
  const session = state.session;
  if (!session || session.kind !== "test") return 0;
  const elapsed = state.view === "q" && !session.done ? Math.floor((now - (session.start ?? now)) / 1000) : session.used || 0;
  return Math.max(0, (session.limit || 0) - elapsed);
}

const sessionKey = (session: QuizSession) => session.kind === "test" ? "$test" : session.key ?? "$review";

export function savedQuizSession(state: QuizState, key: string): QuizSession | null {
  return state.session && sessionKey(state.session) === key ? state.session : state.sessions?.[key] ?? null;
}

export function switchQuizSession(state: QuizState, session: QuizSession, now = Date.now()): QuizState {
  const sessions = { ...state.sessions };
  if (state.session) sessions[sessionKey(state.session)] = quizSnapshot(state, false, now).session!;
  const active = { ...session };
  if (active.kind === "test") active.start = now - (active.used || 0) * 1000;
  sessions[sessionKey(active)] = active;
  return { ...state, session: active, sessions, view: active.done ? "done" : "q" };
}

export function quizSnapshot(state: QuizState, cloud = false, now = Date.now()): PracticeSnapshot {
  const session = state.session ? { ...state.session } : null;
  if (session) {
    delete session.start;
    if (session.kind === "test") {
      session.remainingSeconds = remainingTime(state, now);
      session.used = (session.limit || 0) - session.remainingSeconds;
    }
  }
  const sessions = state.sessions ? { ...state.sessions } : undefined;
  if (sessions && session) sessions[sessionKey(session)] = session;
  if (sessions) {
    for (const [key, saved] of Object.entries(sessions)) {
      const clean = { ...saved } as QuizSession;
      delete clean.start;
      sessions[key] = clean;
    }
  }
  return { version: 1, progress: state.progress, session, ...(sessions ? { sessions } : {}), view: cloud && session && !session.done ? "q" : state.view };
}

export function restoreQuiz(snapshot: PracticeSnapshot): QuizState {
  const session: QuizSession | null = snapshot.session ? { ...snapshot.session } : null;
  if (session?.kind === "test") {
    session.used = (session.limit || 0) - (session.remainingSeconds || 0);
    session.start = Date.now() - session.used * 1000;
  }
  return { ...snapshot, session };
}
