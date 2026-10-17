"use client";

import { useEffect, useRef, useState } from "react";
import { emptyQuiz, letters, quizSnapshot, recordAnswer, remainingTime, restoreQuiz, type QuizQuestion, type QuizState } from "@/lib/practice-quiz";
import { validatePracticeSnapshot, type PracticeQuestion, type PracticeSnapshot } from "@/lib/practice-state";
import type { PracticeSubject } from "@/lib/practice-subjects";

type AccountSave = { owner: string; revision: number; snapshot: PracticeSnapshot | null };
type Loaded = { questions: QuizQuestion[]; account: AccountSave | null; accountError: string };

async function loadQuiz(subject: PracticeSubject): Promise<Loaded> {
  const [bankResponse, saveResponse] = await Promise.all([
    fetch(`/api/practice/${subject.slug}/questions`),
    fetch(`/api/practice/${subject.slug}/progress`, { cache: "no-store" }).catch(() => null),
  ]);
  const bank = await bankResponse.json() as { questions: PracticeQuestion[] };
  if (!bankResponse.ok || !Array.isArray(bank.questions) || !bank.questions.length) throw new Error("Questions could not be loaded. Please check your connection.");
  const questions = bank.questions.map((q) => ({ ...q, k: subject.topics.find((t) => t.name === q.topic)?.key || "" }));
  if (questions.some((q) => !q.k)) throw new Error("The question bank contains an unknown topic.");
  return {
    questions,
    account: saveResponse?.ok ? await saveResponse.json() as AccountSave : null,
    accountError: !saveResponse || !saveResponse.ok && saveResponse.status !== 401 ? "Saved practice could not be loaded. Reload before saving to your account." : "",
  };
}

export function useQuiz(subject: PracticeSubject, openTopics = false) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [state, setState] = useState<QuizState>(emptyQuiz);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [clock, setClock] = useState(0);
  const current = useRef(state);
  const runtime = useRef({
    account: null as AccountSave | null, questions: [] as QuizQuestion[], key: "", revision: 0, baseRevision: 0,
    writerId: "", sequence: 0, pending: 0, again: false, conflict: false, active: false,
    lastRequested: "", lastConfirmed: "", timer: null as ReturnType<typeof setTimeout> | null,
  });
  const initialRequest = useRef<Promise<Loaded> | null>(null);

  function saveLocal() {
    const r = runtime.current;
    if (!r.key) return;
    try { localStorage.setItem(r.key, JSON.stringify({ revision: r.revision, snapshot: quizSnapshot(current.current) })); }
    catch { if (r.active) setNote("Browser storage is unavailable. Save to your account before leaving."); }
  }

  function commit(next: QuizState) {
    current.current = next;
    setState(next);
    saveLocal();
    setNote(runtime.current.account ? "Unsaved changes" : "Progress is kept in this browser.");
  }

  async function saveCloud(leaving = false) {
    const r = runtime.current;
    if (r.timer) clearTimeout(r.timer);
    if (!r.account || r.conflict) return;
    if (r.pending && !leaving) { r.again = true; return; }
    const snapshot = quizSnapshot(current.current, true);
    const checkpoint = JSON.stringify(snapshot);
    if (checkpoint === r.lastRequested) {
      if (r.active) setNote(r.pending ? "Saving..." : "Saved to your account");
      return;
    }
    r.lastRequested = checkpoint;
    r.pending++;
    const sequence = ++r.sequence;
    if (r.active) { setSaving(true); setNote("Saving..."); }
    try {
      const response = await fetch(`/api/practice/${subject.slug}/progress`, {
        method: "POST", headers: { "Content-Type": "application/json" }, keepalive: leaving,
        body: JSON.stringify({ revision: r.baseRevision, writerId: r.writerId, sequence, snapshot }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) { r.conflict = true; if (r.active) setConflict(true); }
        if (response.status === 401) { r.account = null; if (r.active) setLoaded((before) => before ? { ...before, account: null } : before); }
        throw new Error(result.error || "Saving failed. Please retry.");
      }
      r.revision = Math.max(r.revision, result.revision);
      if (sequence === r.sequence) r.lastConfirmed = checkpoint;
      saveLocal();
      if (r.active) setNote(JSON.stringify(quizSnapshot(current.current, true)) === r.lastConfirmed ? "Saved to your account" : "Unsaved changes");
    } catch (caught) {
      if (r.lastRequested === checkpoint) r.lastRequested = "";
      if (r.active) setNote(caught instanceof Error ? caught.message : "Saving failed. Your progress is still in this browser.");
    } finally {
      r.pending--;
      if (r.active) setSaving(r.pending > 0);
      if (!r.pending && r.again) { r.again = false; void saveCloud(); }
    }
  }

  function scheduleWrongSave() {
    const r = runtime.current;
    if (r.timer) clearTimeout(r.timer);
    r.timer = setTimeout(() => { void saveCloud(); }, 800);
  }

  function saveWhenLeaving() {
    saveLocal();
    if (current.current.session) void saveCloud(true);
  }

  function finishTest() {
    let next = current.current;
    const session = next.session;
    if (!session || session.done || session.kind !== "test") return;
    for (const id of session.list) {
      const q = runtime.current.questions.find((item) => item.id === id);
      if (q && session.picks[id] != null) next = recordAnswer(next, q, letters[session.picks[id]] === q.ans);
    }
    commit({ ...next, view: "done", session: { ...session, done: true, used: (session.limit || 0) - remainingTime(next) } });
    if (session.list.some((id) => {
      const q = runtime.current.questions.find((item) => item.id === id);
      return q && session.picks[id] != null && letters[session.picks[id]] !== q.ans;
    })) scheduleWrongSave();
  }

  useEffect(() => {
    let cancelled = false;
    const r = runtime.current;
    r.active = true;
    initialRequest.current ||= loadQuiz(subject);
    void initialRequest.current.then((data) => {
      if (cancelled) return;
      r.account = data.account; r.questions = data.questions;
      r.revision = data.account?.revision || 0; r.baseRevision = r.revision;
      r.writerId = crypto.randomUUID();
      const prefix = subject.slug === "dsa" ? "tre-dsa-session-v2" : `practice-${subject.slug}-session-v1`;
      r.key = `${prefix}-${data.account?.owner || "guest"}`;
      let restored = emptyQuiz();
      try {
        const local = JSON.parse(localStorage.getItem(r.key) || "null");
        const remote = data.account?.snapshot;
        let saved = remote && (!local || local.revision !== r.revision) ? remote : local?.snapshot || remote;
        if (!saved) {
          const guest = data.account && JSON.parse(localStorage.getItem(`${prefix}-guest`) || "null");
          saved = guest?.snapshot || { ...emptyQuiz(), progress: subject.slug === "dsa" ? JSON.parse(localStorage.getItem("tre-dsa-progress-v1") || "{}") : {} };
        }
        restored = restoreQuiz(validatePracticeSnapshot(saved, data.questions, subject.topics));
      } catch {
        if (data.account?.snapshot) {
          try { restored = restoreQuiz(validatePracticeSnapshot(data.account.snapshot, data.questions, subject.topics)); } catch { /* Keep an empty local session if its questions were removed. */ }
        }
      }
      if (openTopics) restored = { ...restored, view: "home" };
      current.current = restored; setState(restored); setLoaded(data);
      setNote(data.accountError || (data.account ? "Account save loaded" : "Progress is kept in this browser."));
      saveLocal();
    }).catch((caught) => { if (!cancelled) setError(caught instanceof Error ? caught.message : "Unable to load the quiz."); });
    const onHidden = () => { if (document.hidden) saveWhenLeaving(); };
    window.addEventListener("pagehide", saveWhenLeaving);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      cancelled = true;
      saveWhenLeaving();
      r.active = false;
      if (r.timer) clearTimeout(r.timer);
      window.removeEventListener("pagehide", saveWhenLeaving);
      document.removeEventListener("visibilitychange", onHidden);
    };
    // The ref holds the current quiz for lifecycle callbacks without refetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.view !== "q" || state.session?.kind !== "test" || state.session.done) return;
    const timer = setInterval(() => {
      if (!remainingTime(current.current)) finishTest();
      setClock((tick) => tick + 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.view, state.session?.kind, state.session?.done]);

  function start(questions: QuizQuestion[], title: string, key: string | null, test = false) {
    if (!questions.length) return false;
    const before = current.current;
    if (before.session && !before.session.done && !window.confirm("Start a new session and replace your current session?")) return false;
    const session: NonNullable<QuizState["session"]> = { kind: test ? "test" : "practice", title, key, list: questions.map((q) => q.id), i: 0, picks: {}, done: false };
    if (test) { session.limit = questions.length * 60; session.start = Date.now(); session.used = 0; session.remainingSeconds = session.limit; }
    commit({ ...before, session, view: "q" });
    return true;
  }

  function pick(index: number) {
    let next = current.current;
    const session = next.session;
    if (!session || next.view !== "q") return;
    const q = runtime.current.questions.find((item) => item.id === session.list[session.i]);
    if (!q || session.kind === "practice" && session.picks[q.id] != null) return;
    const correct = letters[index] === q.ans;
    if (session.kind === "practice") next = recordAnswer(next, q, correct);
    commit({ ...next, session: { ...session, picks: { ...session.picks, [q.id]: index } } });
    if (session.kind === "practice" && !q.unscored && !correct) scheduleWrongSave();
  }

  function next(skip = false) {
    const before = current.current, session = before.session;
    if (!session || before.view !== "q" || session.kind === "practice" && session.picks[session.list[session.i]] == null) return;
    const picks = { ...session.picks };
    if (skip && session.kind === "test") delete picks[session.list[session.i]];
    const updated = { ...session, picks };
    if (session.i < session.list.length - 1) commit({ ...before, session: { ...updated, i: session.i + 1 } });
    else if (session.kind === "practice") commit({ ...before, session: { ...updated, done: true }, view: "done" });
    else { current.current = { ...before, session: updated }; finishTest(); }
  }

  function previous() {
    const before = current.current;
    if (before.session && before.session.i > 0) commit({ ...before, session: { ...before.session, i: before.session.i - 1 } });
  }
  function quit() {
    const before = current.current;
    const session = before.session ? { ...before.session } : null;
    if (session?.kind === "test" && !session.done) session.used = (session.limit || 0) - remainingTime(before);
    commit({ ...before, session, view: "home" }); saveWhenLeaving();
  }
  function resume() {
    const before = current.current;
    if (!before.session || before.session.done) return;
    commit({ ...before, view: "q", session: { ...before.session, start: Date.now() - (before.session.used || 0) * 1000 } });
  }
  function resetSession() {
    const before = current.current;
    if (!before.session || !window.confirm("Restart this session from the first question? Your topic attempt history will be kept.")) return;
    commit({ ...before, view: "q", session: { ...before.session, i: 0, picks: {}, done: false, used: 0, start: Date.now() } });
  }
  function reset() {
    if (runtime.current.pending) return;
    if (runtime.current.conflict) { setNote("Load the newer account save before resetting progress."); return; }
    commit(emptyQuiz()); void saveCloud();
  }
  function loadSaved() {
    if (!window.confirm("Load your account save and discard unsaved changes in this browser?")) return;
    runtime.current.conflict = true;
    current.current = emptyQuiz();
    localStorage.removeItem(runtime.current.key); location.reload();
  }

  return { subject, loaded, state, error, note, saving, conflict, clock, save: () => saveCloud(), start, pick, next, previous, quit, resume, resetSession, reset, loadSaved, finishTest };
}
