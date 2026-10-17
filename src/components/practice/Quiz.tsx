"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, LogIn, Save } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { formatTime, letters, percent, quizStats, recordOf, remainingTime, sectionOf, shuffle, topicStatus, type QuizQuestion } from "@/lib/practice-quiz";
import type { PracticeSubject } from "@/lib/practice-subjects";
import { useQuiz } from "./useQuiz";
import styles from "./quiz.module.css";

type QuizController = ReturnType<typeof useQuiz>;
const typeLabels: Record<string, string> = { concept: "Concept", property: "Property", trace: "Trace", numerical: "Numerical", code: "Code", match: "Match", chronology: "Chronology", statement: "Statement", assertion_reason: "Assertion & reason" };
const levelLabels: Record<number, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
const topicLabel = (quiz: QuizController, key: string) => quiz.subject.topics.find((topic) => topic.key === key)?.label || key;

function Button({ children, onClick, action, className = "btn", disabled = false, ...props }: {
  children: ReactNode; onClick?: () => void; action?: string; className?: string; disabled?: boolean;
  "data-key"?: string; "data-i"?: number; id?: string; "aria-label"?: string; title?: string;
}) {
  return <button type="button" className={className} data-act={action} disabled={disabled} onClick={onClick} {...props}>{children}</button>;
}

function SaveStatus({ quiz }: { quiz: QuizController }) {
  return <span className="save" role="status" data-mode={quiz.loaded?.account ? "account" : "browser"}>{quiz.note}</span>;
}

function SaveControls({ quiz, compact = false }: { quiz: QuizController; compact?: boolean }) {
  return <div className={`save-controls${compact ? " compact" : ""}`} id="save">
    {!compact && <SaveStatus quiz={quiz} />}
    {quiz.loaded?.account
      ? <Button action="save" aria-label="Save progress" title="Save progress" disabled={quiz.saving || quiz.conflict} onClick={() => { void quiz.save(); }}>{compact && <Save size={17} aria-hidden="true" />}{quiz.saving ? "Saving..." : compact ? "Save" : "Save progress"}</Button>
      : <Link className="btn" aria-label="Sign in to save" href={`/admin/login?next=/practice/${quiz.subject.slug}`} prefetch={false}>{compact && <LogIn size={17} aria-hidden="true" />}{compact ? "Sign in" : "Sign in to save"}</Link>}
    {(quiz.conflict || quiz.loaded?.accountError) && <Button action="load-save" onClick={quiz.loadSaved}>Load saved progress</Button>}
  </div>;
}

function Segments({ name, values, selected }: { name: string; values: [string, string][]; selected: string }) {
  return <>{values.map(([value, label], index) => <span className="seg" key={value}>
    <input type="radio" name={name} id={`${name}-${index}`} value={value} defaultChecked={value === selected} />
    <label htmlFor={`${name}-${index}`}>{label}</label>
  </span>)}</>;
}

function Setup({ topic, quiz, close }: { topic: string; quiz: QuizController; close: () => void }) {
  const [error, setError] = useState("");
  const test = topic === "test";
  const bank = quiz.loaded!.questions;
  const base = test ? bank.filter((q) => !q.unscored) : bank.filter((q) => q.k === topic);
  const stats = quizStats(quiz.state, base);
  const sections = [...new Set(base.map(sectionOf))];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    let questions = base;
    let title = topicLabel(quiz, topic);
    if (test) {
      const count = Number(values.get("tn") || 16);
      const from = values.get("tf");
      let pool = from === "pyq" ? base.filter((q) => q.k === "pyq") : from === "new" ? base.filter((q) => !recordOf(quiz.state, q)) : base;
      if (pool.length < count) pool = from === "pyq" ? base.filter((q) => q.k === "pyq") : base;
      questions = shuffle(pool).slice(0, count);
      title = `Timed test \u00b7 ${questions.length} questions`;
    } else {
      const level = Number(values.get("pl") || 0), size = Number(values.get("ps") || 25);
      const mode = values.get("pm"), section = String(values.get("psub") || "");
      questions = base.filter((q) => (!level || q.level === level) && (!section || sectionOf(q) === section));
      if (mode === "new") {
        const fresh = questions.filter((q) => !recordOf(quiz.state, q));
        questions = fresh.length ? fresh : shuffle(questions);
      } else if (mode === "wrong") questions = shuffle(questions.filter((q) => { const r = recordOf(quiz.state, q); return r && !r[2]; }));
      else questions = shuffle(questions);
      if (size) questions = questions.slice(0, size);
      title += (section ? ` \u00b7 ${section}` : "") + (mode === "wrong" ? " \u00b7 wrong ones" : "");
    }
    if (!questions.length) { setError("No questions match that choice. Try a different filter."); return; }
    quiz.start(questions, title, test ? null : topic, test);
  }
  return <form className="setup" data-for={topic} onSubmit={submit}>
    {test ? <>
      <fieldset className="seg"><legend>Number of questions (1 minute each)</legend><Segments name="tn" values={[["16", "16"], ["30", "30"], ["50", "50"]]} selected="16" /></fieldset>
      <fieldset className="seg"><legend>Questions from</legend><Segments name="tf" values={[["all", "All topics"], ["new", "Ones I haven't tried"], ...(quiz.subject.topics.some((t) => t.key === "pyq") ? [["pyq", "Past papers only"]] as [string, string][] : [])]} selected="all" /></fieldset>
    </> : <>
      <fieldset className="seg"><legend>Which questions</legend><Segments name="pm" values={[["new", `New first (${stats.total - stats.done} scored left)`], ["all", `Shuffle all ${base.length}`], ["wrong", `Only my wrong ones (${stats.wrong})`]]} selected={stats.done < stats.total ? "new" : "all"} /></fieldset>
      <fieldset className="seg"><legend>How many</legend><Segments name="ps" values={[["10", "10"], ["25", "25"], ["50", "50"], ["0", "All"]]} selected="25" /></fieldset>
      <fieldset className="seg"><legend>Level</legend><Segments name="pl" values={[["0", "All levels"], ["1", "Easy"], ["2", "Medium"], ["3", "Hard"]]} selected="0" /></fieldset>
      {sections.length > 1 && topic !== "pyq" && <fieldset><legend>Sub-topic</legend><select id="psub" name="psub" className="btn"><option value="">All {sections.length} sub-topics</option>{sections.map((section) => <option key={section}>{section}</option>)}</select></fieldset>}
    </>}
    <div className="row"><button type="submit" className="btn primary" data-act={test ? "start-test" : "start"} data-key={topic}>{test ? "Start timed test" : "Start practice"}</button>
      {test ? <span className="hint">Practice scoring: +1 correct, −⅓ wrong, 0 skipped. Answers are shown at the end.</span> : <Button className="link" onClick={close}>Cancel</Button>}
      {error && <span role="alert" className="hint" style={{ color: "var(--bad)" }}>{error}</span>}
    </div>
  </form>;
}

function Home({ quiz, open, setOpen }: { quiz: QuizController; open: string | null; setOpen: (value: string | null) => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const bank = quiz.loaded!.questions;
  const topics = quiz.subject.topics;
  const all = quizStats(quiz.state, bank);
  const topicStats = (key: string) => quizStats(quiz.state, bank.filter((q) => q.k === key), quiz.state.progress[key]?.h || "");
  const ready = topics.filter((t) => topicStatus(topicStats(t.key)).cls === "ready").length;
  const weak: Record<string, { key: string; section: string; attempts: number; correct: number }> = {};
  for (const q of bank) {
    const r = recordOf(quiz.state, q);
    if (!r) continue;
    const key = `${q.k}|${sectionOf(q)}`;
    const group = weak[key] ||= { key: q.k, section: sectionOf(q), attempts: 0, correct: 0 };
    group.attempts += r[0]; group.correct += r[1];
  }
  const weakSections = Object.values(weak).filter((w) => w.attempts >= 5 && w.correct / w.attempts < 0.7).sort((a, b) => a.correct / a.attempts - b.correct / b.attempts).slice(0, 8);
  const wrongQuestions = (questions: QuizQuestion[]) => shuffle(questions.filter((q) => { const r = recordOf(quiz.state, q); return r && !r[2]; }));
  function toggle(key: string) { setOpen(open === key ? null : key); setConfirmReset(false); }
  return <>
    <header className="top"><div className="brand"><span className="eyebrow">{quiz.subject.eyebrow}</span><h1>{quiz.subject.title}</h1><p className="muted">{bank.length} questions. {quiz.subject.description}</p></div><SaveControls quiz={quiz} /></header>
    {quiz.subject.notesHref && <nav className="actions" aria-label="Study views"><Link className="btn" href={quiz.subject.notesHref}>{quiz.subject.notesLabel || "Read Hindi notes"}</Link><span className="chip">Practice questions</span></nav>}
    {quiz.subject.formatNote && <aside className="tip">{quiz.subject.formatNote} <Link href={`${quiz.subject.notesHref}/sources`}>Source notes and corrections</Link></aside>}
    <section className="summary" aria-label="Your progress"><Stat value={all.done}>of {all.total} questions tried</Stat><Stat value={percent(all.acc)}>accuracy overall</Stat><Stat value={`${ready}/${topics.length}`}>topics ready (85%+ on last 50)</Stat><Stat value={all.wrong}>questions to redo</Stat></section>
    <section className="actions"><Button className="btn primary" action="setup" data-key="test" onClick={() => toggle("test")}>Timed test</Button>
      {quiz.state.session && !quiz.state.session.done && <Button className="btn primary" action="resume" onClick={quiz.resume}>Continue {quiz.state.session.title} · {quiz.state.session.i + 1} / {quiz.state.session.list.length}</Button>}
      <Button action="redo-all" disabled={!all.wrong} onClick={() => quiz.start(wrongQuestions(bank), "All my wrong answers", null)}>Redo all wrong ({all.wrong})</Button>
    </section>
    {open === "test" && <section className="topic" style={{ display: "block" }}><Setup topic="test" quiz={quiz} close={() => setOpen(null)} /></section>}
    <section className="ledger"><div className="ledger-head"><h2>Topics</h2><span className="muted" style={{ fontSize: 13 }}>Green = right on last try · red = wrong on last try</span></div>
      {topics.map((t) => {
        const stats = topicStats(t.key), status = topicStatus(stats);
        const questions = bank.filter((q) => q.k === t.key);
        const count = new Set(questions.map(sectionOf)).size;
        return <article className={`topic${t.key === "pyq" ? " pyq" : ""}`} id={`t-${t.key}`} key={t.key}>
          <div className="t-main"><div className="t-head"><h3>{t.label}</h3><span className="t-meta num">{stats.total} questions{questions.length > stats.total && ` + ${questions.length - stats.total} review-only`}{t.key !== "pyq" && ` \u00b7 ${count} sub-topics`}</span></div>
            {t.note && <p className="t-meta">{t.note}</p>}
            <div className="bar" role="img" aria-label={`${stats.done} of ${stats.total} tried`}><i className="c" style={{ width: `${stats.total ? stats.lastRight / stats.total * 100 : 0}%` }} /><i className="w" style={{ width: `${stats.total ? stats.wrong / stats.total * 100 : 0}%` }} /></div>
            <p className="t-line num"><span>{stats.done} of {stats.total} tried</span><span>{stats.attempts ? `${percent(stats.acc)} correct overall` : ""}</span></p>
          </div>
          <div className="t-side"><span className={`chip ${status.cls}`}>{status.text}</span><div className="t-actions"><Button className="btn primary" action="setup" data-key={t.key} onClick={() => toggle(t.key)}>Practise</Button>
            {stats.wrong > 0 && <Button action="wrong" onClick={() => quiz.start(wrongQuestions(questions), `${t.label} \u00b7 wrong ones`, t.key)}>Wrong ({stats.wrong})</Button>}
          </div></div>
          {open === t.key && <Setup key={t.key} topic={t.key} quiz={quiz} close={() => setOpen(null)} />}
        </article>;
      })}
    </section>
    {weakSections.length > 0 && <section className="weak"><h2>Sub-topics to revisit</h2><p className="muted" style={{ fontSize: 14 }}>Below 70% correct, with at least 5 attempts. Revise the concept first, then drill.</p><ul>{weakSections.map((w) => <li key={`${w.key}|${w.section}`}><span className="w-name">{w.section}<small>{topicLabel(quiz, w.key)} · {percent(w.correct / w.attempts)} of {w.attempts} attempts correct</small></span><Button onClick={() => quiz.start(shuffle(bank.filter((q) => q.k === w.key && sectionOf(q) === w.section)).slice(0, 25), `${topicLabel(quiz, w.key)} \u00b7 ${w.section}`, w.key)}>Drill this</Button></li>)}</ul></section>}
    <section className="notes">
      <div><h3>How the options work</h3><p>{quiz.subject.optionsNote || "Every practice question has five options: A-C are content, D is More than one of the above and E is None of the above. Read all three substantive choices before answering."}</p></div>
      <div><h3>When is a topic ready?</h3><p>A topic turns green once your last 50 answers in it are at least 85% correct. Redo your wrong ones about a week later; a question leaves the redo list when you get it right.</p></div>
      <div><h3>Where the answers come from</h3><p>{quiz.subject.sourceNote || (quiz.subject.slug === "dsa" ? "Every answer was checked twice, the second time by an independent blind solve, and every trace, calculation and code answer was run as code. Each option has its own explanation. Past-paper answers are worked out here, not BPSC's official key; TRE 3 Q94 is ambiguous as printed." : "The supplied history study pack includes chapter explanations and source corrections. Uncertain source items are not scored. These are practice questions, not an official answer key.")}</p></div>
      <div><h3>Keyboard</h3><p><kbd>A</kbd>–<kbd>E</kbd> or <kbd>1</kbd>–<kbd>5</kbd> to answer, <kbd>Enter</kbd> for the next question, <kbd>S</kbd> to skip in a timed test.</p></div>
    </section>
    <div className="reset">{confirmReset ? <><span>Clear every answer and start over?</span><Button className="btn danger" onClick={() => { quiz.reset(); setConfirmReset(false); }}>Yes, clear my progress</Button><Button className="link" onClick={() => setConfirmReset(false)}>Keep it</Button></> : <Button className="link" action="reset" onClick={() => setConfirmReset(true)}>Reset progress</Button>}</div>
    <Link className="link" href="/practice">Back to practice</Link>
  </>;
}

function Stat({ value, children }: { value: ReactNode; children: ReactNode }) {
  return <div className="stat"><b>{value}</b><span>{children}</span></div>;
}

function Teaching({ question: q, picked }: { question: QuizQuestion; picked?: number }) {
  return <section className="teach"><h4>Concept</h4><p className="concept">{q.concept || q.exp}</p>
    {q.work && <><h4>Step by step</h4><pre className="work">{q.work}</pre></>}
    {q.why?.length === 5 && <><h4>Every option explained</h4><ul className="why">{q.why.map((why, i) => <li className={`${letters[i] === q.ans ? "is-ans " : ""}${picked === i ? "is-pick" : ""}`} key={i}><span className="wl">{letters[i]}</span><div><div className="wo"><span className="wb">{letters[i] === q.ans ? "Answer" : "Not the answer"}{picked === i ? " \u00b7 your pick" : ""}</span>{q.opts[i]}</div><div className="wt">{why.replace(/^[A-E]\s*[\u2014\u2013-]\s*(Correct|Wrong)\.\s*/, "")}</div></div></li>)}</ul></>}
    {q.tip && <p className="tip"><b>Exam tip:</b> {q.tip}</p>}
    {q.noteHref && <p><Link className="btn" href={q.noteHref}>{q.noteHref.startsWith('/practice/oops/') ? 'Read related notes' : 'Read the related lesson'}</Link></p>}
    {q.source && <details className="tip"><summary>Original assignment and answer key</summary><p>Assignment {q.source.document.slice(-1)}, question {q.source.number}, page {q.source.pages.join(", ")}. The supplied key says {q.source.answer}{q.source.keyNumber !== q.source.number ? ` (printed key number ${q.source.keyNumber})` : ""}. {q.unscored ? "The wording is not reliable enough for scoring; use the explanation above." : q.source.answer !== q.ans ? `The reviewed answer is ${q.ans}; the explanation above gives the correction.` : "The explanation above clarifies the rule and its limits."}</p><a href={`/study/oops/${q.source.document}.pdf#page=${q.source.pages[0]}`} target="_blank" rel="noopener noreferrer">Open original page</a></details>}
  </section>;
}

function Question({ quiz }: { quiz: QuizController }) {
  const session = quiz.state.session!;
  const bank = quiz.loaded!.questions;
  const q = bank.find((q) => q.id === session.list[session.i])!;
  const picked = session.picks[q.id], reveal = session.kind === "practice" && picked != null;
  const answered = bank.filter((q) => !q.unscored && session.picks[q.id] != null).length;
  const right = bank.filter((q) => !q.unscored && session.picks[q.id] != null && letters[session.picks[q.id]] === q.ans).length;
  const left = remainingTime(quiz.state);
  const last = session.i === session.list.length - 1;
  return <>
    <header className="qbar">
      <div className="qtoolbar"><Button className="link" action="quit" onClick={quiz.quit}><ArrowLeft size={18} aria-hidden="true" />{session.kind === "test" ? "Topics · pause" : "Topics"}</Button><SaveControls quiz={quiz} compact /></div>
      <div className="qheading"><span className="qtitle">{session.title}</span><span className="right">{session.kind === "test" && <span className={`timer num${left <= 60 ? " low" : ""}`} id="timer">{formatTime(left)}</span>}<span className="num">{session.i + 1} / {session.list.length}</span></span></div>
      <SaveStatus quiz={quiz} />
    </header>
    <div className="track"><i style={{ width: `${(session.i + (reveal ? 1 : 0)) / session.list.length * 100}%` }} /></div>
    <article className="qcard"><div className="qmeta"><span className="tag">{q.k === "pyq" ? q.subtopic : sectionOf(q)}</span><span className="tag">{levelLabels[q.level]}</span><span className="tag">{typeLabels[q.type]}</span><span className="qid">{q.id}</span></div>
      <p className="qtext" id="qtext" tabIndex={-1}>{q.q}</p>{q.code && <pre className="code"><code>{q.code}</code></pre>}{q.transcriptionNote && <p className="tip">{q.transcriptionNote}</p>}
      <ol className="omr">{q.opts.map((option, i) => {
        const correct = !q.unscored && letters[i] === q.ans;
        const mark = reveal ? correct ? picked === i ? "Your answer · correct" : "Correct answer" : picked === i ? "Your answer" : "" : "";
        return <li key={i}><button type="button" className={`opt${picked === i ? " picked" : ""}${reveal && correct ? " right" : ""}${reveal && picked === i && !correct && !q.unscored ? " wrong" : ""}`} data-act="pick" data-i={i} disabled={reveal} aria-label={`Option ${letters[i]}: ${option}`} onClick={() => quiz.pick(i)}><span className="bubble">{letters[i]}</span><span className="otext">{option}</span>{mark && <span className="mark">{mark}</span>}</button></li>;
      })}</ol>
      {q.unscored && <p className="tip">Review only. Choose an option to reveal the discussion; this question does not affect your score.</p>}
      {reveal && <><div className="feedback" role="status"><p className={`verdict ${q.unscored ? "" : letters[picked] === q.ans ? "ok" : "bad"}`}>{q.unscored ? "Review only · not scored" : letters[picked] === q.ans ? "Correct" : `Not quite. The answer is ${q.ans}.`}</p><p className="exp">{q.exp}</p></div><Teaching question={q} picked={picked} /></>}
    </article>
    <nav className={`qnav${session.kind === "test" ? " test-nav" : ""}`} aria-label="Question navigation">
      <div className="qnav-status"><span className="num muted">{session.kind === "practice" ? `${right} correct of ${answered} answered` : `${answered} answered \u00b7 ${session.list.slice(0, session.i).filter((id) => session.picks[id] == null).length} skipped`}</span>{session.kind === "test" && !last && <Button className="link" action="finish" onClick={quiz.finishTest}>Finish test</Button>}</div>
      <Button action="previous" aria-label="Previous question" onClick={quiz.previous} disabled={!session.i}><ChevronLeft size={18} aria-hidden="true" /><span>Previous</span></Button>
      {session.kind === "test" && <Button action="skip" onClick={() => quiz.next(true)}>Skip</Button>}
      <Button className="btn primary" id="next" action="next" onClick={() => quiz.next()} disabled={session.kind === "practice" && !reveal}><span>{last ? session.kind === "practice" ? "See summary" : "Finish test" : "Next"}</span><ArrowRight size={18} aria-hidden="true" /></Button>
    </nav>
    <p className="keys"><kbd>A</kbd>–<kbd>E</kbd> answer · <kbd>Enter</kbd> next{session.kind === "test" && <> · <kbd>S</kbd> skip</>}</p>
    <div className="reset"><Button className="link" action="reset-session" onClick={quiz.resetSession}>Reset session</Button></div>
  </>;
}

function Results({ quiz, setup }: { quiz: QuizController; setup: (key: string) => void }) {
  const session = quiz.state.session!;
  const bank = quiz.loaded!.questions;
  const rows = session.list.map((id) => {
    const q = bank.find((q) => q.id === id)!;
    const picked = session.picks[id];
    return { q, picked, status: q.unscored ? "review" : picked == null ? "skip" : letters[picked] === q.ans ? "ok" : "bad" };
  });
  const scoredCount = rows.filter((r) => r.status !== "review").length;
  const correct = rows.filter((r) => r.status === "ok").length, wrong = rows.filter((r) => r.status === "bad").length, skipped = scoredCount - correct - wrong;
  const missed = rows.filter((r) => r.status === "bad" || r.status === "skip");
  const order: Record<string, number> = { bad: 0, skip: 1, review: 2, ok: 3 };
  return <>
    <div className="qbar"><Button className="link" action="quit" onClick={quiz.quit}>← Topics</Button><span className="qtitle">{session.title}</span><span /></div><SaveControls quiz={quiz} />
    <header className="result-head"><span className="eyebrow">{session.kind === "test" ? "Timed test result" : "Practice summary"}</span><h1 className="num">{session.kind === "test" ? Math.round((correct - wrong / 3) * 100) / 100 : correct} / {scoredCount}{session.kind === "practice" ? " correct" : ""}</h1><p className="muted">{session.kind === "test" ? `Practice score (+1, −⅓, 0). Time used ${formatTime(session.used || 0)} of ${formatTime(session.limit || 0)}.` : correct === scoredCount && scoredCount > 0 ? "Clean sheet. Move on or try a harder level." : `${rows.length - scoredCount} review-only questions excluded. Incorrect scored answers are on your redo list.`}</p></header>
    {session.kind === "test" && <section className="summary"><Stat value={correct}>correct</Stat><Stat value={wrong}>wrong (−{Math.round(wrong / 3 * 100) / 100})</Stat><Stat value={skipped}>skipped</Stat><Stat value={percent(correct + wrong ? correct / (correct + wrong) : null)}>accuracy on attempted</Stat></section>}
    <section className="actions">{missed.length > 0 && session.kind === "practice" && <Button className="btn primary" action="redo-session" onClick={() => quiz.start(shuffle(missed.map((r) => r.q)), session.title.replace(/ \u00b7 redo$/, "") + " \u00b7 redo", session.key)}>Redo the {missed.length} I missed</Button>}
      {session.key && <Button action="setup-again" onClick={() => { quiz.quit(); setup(session.key!); }}>Practise {topicLabel(quiz, session.key)} again</Button>}<Button action="quit" onClick={quiz.quit}>Back to topics</Button>
    </section>
    <section className="review"><h2>Review</h2>{[...rows].sort((a, b) => order[a.status] - order[b.status]).map(({ q, picked, status }) => <details key={q.id} open={status === "bad" && session.kind === "test" ? true : undefined}><summary><span className={`st ${status}`}>{status === "ok" ? "RIGHT" : status === "bad" ? "WRONG" : status === "review" ? "REVIEW ONLY" : "SKIPPED"}</span><span className="qs">{q.q.split("\n")[0]}</span></summary><div className="body"><p className="qtext">{q.q}</p>{q.code && <pre className="code"><code>{q.code}</code></pre>}<p className="exp"><b>{q.unscored ? "Review only:" : `Answer ${q.ans}:`}</b> {q.exp}</p><Teaching question={q} picked={picked} /><p className="mono muted" style={{ fontSize: 12 }}>{q.id} · {q.k === "pyq" ? q.subtopic : sectionOf(q)}</p></div></details>)}</section>
  </>;
}

export default function Quiz({ subject, initialTopic = null }: { subject: PracticeSubject; initialTopic?: string | null }) {
  const quiz = useQuiz(subject, initialTopic !== null);
  const [open, setOpen] = useState<string | null>(initialTopic);
  const { pick, next } = quiz;
  const activePick = quiz.state.session?.picks[quiz.state.session.list[quiz.state.session.i]];
  useEffect(() => { if (quiz.state.view !== "home") setOpen(null); }, [quiz.state.view]);
  useEffect(() => {
    if (quiz.state.view !== "q") return;
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.ctrlKey || event.metaKey || event.altKey || target.matches("input, select, textarea")) return;
      const key = event.key.toLowerCase(), index = "abcde".includes(key) ? "abcde".indexOf(key) : "12345".indexOf(key);
      if (index >= 0 && key.length === 1) { event.preventDefault(); pick(index); }
      else if (key === "enter") { if (target.closest("button") && target.id !== "next") return; event.preventDefault(); next(); }
      else if (key === "s" && quiz.state.session?.kind === "test") { event.preventDefault(); next(true); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [quiz.state.view, quiz.state.session?.kind, pick, next]);
  useEffect(() => {
    if (quiz.state.view === "q") document.getElementById("qtext")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [quiz.state.view, quiz.state.session?.i, quiz.state.session?.title]);
  useEffect(() => {
    if (quiz.state.view === "q" && activePick != null) document.getElementById("next")?.focus({ preventScroll: true });
  }, [quiz.state.view, activePick]);
  useEffect(() => {
    if (!open) return;
    document.querySelector(`.setup[data-for="${open}"]`)?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [open, quiz.loaded]);
  return <div className={styles.quiz}>
    <main className={`wrap${quiz.state.view === "q" ? " question-view" : ""}`} aria-live="polite">
      {quiz.error ? <><p role="alert">{quiz.error}</p><Button onClick={() => location.reload()}>Try again</Button></> : !quiz.loaded ? <p role="status">Loading questions and saved practice...</p> : quiz.state.view === "home" ? <Home quiz={quiz} open={open} setOpen={setOpen} /> : quiz.state.view === "q" ? <Question quiz={quiz} /> : <Results quiz={quiz} setup={setOpen} />}
    </main>
  </div>;
}
