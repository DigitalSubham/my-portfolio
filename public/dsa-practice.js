(async function () {
  "use strict";
  const app = document.getElementById("app");
  app.innerHTML = '<p role="status">Loading questions and saved practice…</p>';
  let BANK, remote = null, accountError = "";
  try {
    const [questionsResponse, progressResponse] = await Promise.all([
      fetch("/api/practice/dsa/questions"),
      fetch("/api/practice/dsa/progress", { cache: "no-store" }).catch(() => null)
    ]);
    const data = await questionsResponse.json();
    if (!questionsResponse.ok || !Array.isArray(data.questions) || !data.questions.length) throw new Error(data.error || "No questions available.");
    BANK = data.questions;
    if (progressResponse && progressResponse.ok) remote = await progressResponse.json();
    else if (!progressResponse || progressResponse.status !== 401) accountError = "Saved practice could not be loaded. Reload before saving to your account.";
  } catch {
    app.innerHTML = '<p role="alert">Questions could not be loaded. Please check your connection.</p><button class="btn" onclick="location.reload()">Try again</button>';
    return;
  }
  const TOPICS = [
    { key: "pyq", name: "Past Papers (TRE 1-3)", label: "Past papers: TRE 1–3", note: "The 47 DSA questions BPSC actually asked" },
    { key: "arrays", name: "Arrays & Basics", label: "Arrays & basics" },
    { key: "lists", name: "Linked Lists", label: "Linked lists" },
    { key: "stacks", name: "Stacks & Expressions", label: "Stacks & expressions" },
    { key: "queues", name: "Queues", label: "Queues", note: "Most-asked DSA area in TRE 1–3" },
    { key: "trees", name: "Trees", label: "Trees" },
    { key: "sorting", name: "Sorting & Searching", label: "Sorting & searching" },
    { key: "graphs", name: "Graphs", label: "Graphs" },
    { key: "hashing", name: "Hashing", label: "Hashing" },
    { key: "analysis", name: "Algorithm Analysis", label: "Algorithm analysis" },
    { key: "paradigms", name: "Paradigms & P/NP", label: "Paradigms & P/NP" }
  ];
  const KEY_OF = {}; TOPICS.forEach(t => KEY_OF[t.name] = t.key);
  const T_BY_KEY = {}; TOPICS.forEach(t => T_BY_KEY[t.key] = t);
  const BY_ID = {}; const BY_TOPIC = {}; TOPICS.forEach(t => BY_TOPIC[t.key] = []);
  BANK.forEach(q => { q.k = KEY_OF[q.topic]; BY_ID[q.id] = q; BY_TOPIC[q.k].push(q); });
  const secOf = q => q.sec || (q.k === "pyq" ? (q.subtopic.split(" · ")[1] || q.subtopic) : q.subtopic);
  const LETTERS = ["A", "B", "C", "D", "E"];
  const TYPE_LABEL = { concept: "Concept", property: "Property", trace: "Trace", numerical: "Numerical", code: "Code" };
  const LEVEL_LABEL = { 1: "Easy", 2: "Medium", 3: "Hard" };
  const READY_AT = 0.85, WINDOW = 50;

  // ---------- progress store ----------
  // P[topicKey] = { r: { qid: [attempts, correct, lastCorrect(0/1)] }, h: "1011…" (last 50 results) }
  let P = {};
  let storeMode = "memory";
  let storeNote = "";
  let revision = remote ? remote.revision : 0;
  const baseRevision = revision, writerId = crypto.randomUUID();
  let sequence = 0, saveTimer = null, pendingSaves = 0, saveAgain = false;
  let lastRequestedCheckpoint = "", lastConfirmedCheckpoint = "";
  let saving = false, conflict = false;
  const LS_KEY = "tre-dsa-session-v2-" + (remote ? remote.owner : "guest");
  function blank() { return { r: {}, h: "" }; }
  function topicData(k) { return P[k] || (P[k] = blank()); }
  function remaining() {
    if (!S || S.kind !== "test") return 0;
    return Math.max(0, S.limit - (view === "q" && !S.done ? Math.floor((Date.now() - S.start) / 1000) : S.used || 0));
  }
  function snapshot() {
    const session = S ? { kind: S.kind, title: S.title, list: S.list, i: S.i, picks: S.picks, key: S.key || null, done: Boolean(S.done) } : null;
    if (session && S.kind === "test") {
      session.limit = S.limit; session.remainingSeconds = remaining(); session.used = S.limit - session.remainingSeconds;
    }
    return { version: 1, progress: P, session, view };
  }
  function restore(saved) {
    if (!saved || saved.version !== 1 || !saved.progress) return;
    P = saved.progress;
    S = saved.session;
    if (S && (!S.list.length || S.list.some(id => !BY_ID[id]))) S = null;
    view = S && ["q", "done"].includes(saved.view) ? saved.view : "home";
    if (S && S.kind === "test") {
      S.used = S.limit - S.remainingSeconds;
      S.start = Date.now() - S.used * 1000;
    }
  }
  function loadSaved() {
    let local = null;
    try {
      local = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      storeMode = "browser";
    } catch { storeMode = "memory"; }
    if (remote) storeMode = "account";
    // A newer account revision wins over an older browser checkpoint, including resets.
    if (remote && remote.snapshot && (!local || local.revision !== remote.revision)) restore(remote.snapshot);
    else if (local) restore(local.snapshot);
    else if (remote && remote.snapshot) restore(remote.snapshot);
    else {
      try {
        const guest = remote && JSON.parse(localStorage.getItem("tre-dsa-session-v2-guest") || "null");
        if (guest) restore(guest.snapshot);
        else P = JSON.parse(localStorage.getItem("tre-dsa-progress-v1") || "{}");
      } catch { P = {}; }
    }
    storeNote = accountError || (remote ? "Account save loaded" : "Progress is kept in this browser.");
    saveLocal();
  }
  function saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ revision, snapshot: snapshot() })); }
    catch { if (!remote) storeNote = "Browser storage is unavailable. Save to your account before leaving."; }
  }
  function persist() {
    saveLocal();
    storeNote = remote ? "Unsaved changes" : "Progress is kept in this browser.";
    renderSaveChip();
  }
  function saveWrongAnswer() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveCloud(), 800);
  }
  function saveWhenLeaving() {
    saveLocal();
    if (S) saveCloud({ leaving: true });
  }
  async function saveCloud({ leaving = false } = {}) {
    clearTimeout(saveTimer);
    if (!remote || conflict) return;
    if (saving && !leaving) { saveAgain = true; return; }
    const state = snapshot();
    if (state.session && !state.session.done) state.view = "q";
    const checkpoint = JSON.stringify(state);
    if (checkpoint === lastRequestedCheckpoint) {
      storeNote = saving ? "Saving…" : "Saved to your account"; renderSaveChip(); return;
    }
    lastRequestedCheckpoint = checkpoint;
    pendingSaves++;
    const requestSequence = ++sequence;
    saving = true; storeNote = "Saving…"; renderSaveChip();
    try {
      const response = await fetch("/api/practice/dsa/progress", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revision: baseRevision, writerId, sequence: requestSequence, snapshot: state }),
        keepalive: leaving
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) conflict = true;
        if (response.status === 401) remote = null;
        throw new Error(result.error || "Saving failed. Please retry.");
      }
      revision = Math.max(revision, result.revision);
      if (requestSequence === sequence) lastConfirmedCheckpoint = checkpoint;
      const current = snapshot();
      if (current.session && !current.session.done) current.view = "q";
      storeNote = JSON.stringify(current) === lastConfirmedCheckpoint ? "Saved to your account" : "Unsaved changes";
      saveLocal();
    } catch (error) {
      if (lastRequestedCheckpoint === checkpoint) lastRequestedCheckpoint = "";
      storeNote = error.message || "Saving failed. Your progress is still in this browser.";
    } finally {
      pendingSaves--; saving = pendingSaves > 0; renderSaveChip();
      if (!saving && saveAgain) { saveAgain = false; saveCloud(); }
    }
  }

  function rec(q) { return topicData(q.k).r[q.id] || null; }
  function record(q, correct) {
    const d = topicData(q.k);
    const r = d.r[q.id] || [0, 0, 0];
    r[0] += 1; if (correct) r[1] += 1; r[2] = correct ? 1 : 0;
    d.r[q.id] = r;
    d.h = (d.h + (correct ? "1" : "0")).slice(-WINDOW);
  }

  // ---------- stats ----------
  function stats(qs, hist) {
    let done = 0, att = 0, cor = 0, wrong = 0, lastRight = 0;
    qs.forEach(q => { const r = rec(q); if (r && r[0]) { done++; att += r[0]; cor += r[1]; if (!r[2]) wrong++; else lastRight++; } });
    return { total: qs.length, done, att, cor, wrong, lastRight, acc: att ? cor / att : null, hist: hist || "" };
  }
  function topicStats(k) { return stats(BY_TOPIC[k], topicData(k).h); }
  function statusOf(s) {
    const need = Math.min(WINDOW, s.total);
    const h = s.hist; const recent = h.length ? (h.split("").filter(x => x === "1").length / h.length) : null;
    if (!s.done) return { cls: "", text: "Not started", recent };
    if (h.length >= need && recent >= READY_AT) return { cls: "ready", text: "Ready · last " + h.length + ": " + pct(recent), recent };
    if (h.length >= 20 && recent < 0.7) return { cls: "low", text: "Needs work · last " + h.length + ": " + pct(recent), recent };
    return { cls: "work", text: "In progress · last " + h.length + ": " + pct(recent), recent };
  }
  const pct = x => x == null ? "–" : Math.round(x * 100) + "%";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ---------- views ----------
  let view = "home";
  let openSetup = null;      // topic key whose setup panel is open, or "test"
  let confirmReset = false;
  let S = null;              // active session
  let timerId = null;

  function saveChipHTML() {
    return '<div class="save-controls" id="save"><span class="save" role="status" data-mode="' + storeMode + '">' + esc(storeNote) + '</span>' +
      (remote ? '<button class="btn" data-act="save"' + (saving || conflict ? " disabled" : "") + '>' + (saving ? "Saving…" : "Save progress") + '</button>' : '<a class="btn" href="/admin/login?next=/dsa-practice.html">Sign in to save</a>') +
      (conflict || accountError ? '<button class="btn" data-act="load-save">Load saved progress</button>' : "") + '</div>';
  }
  function renderSaveChip() { const el = document.getElementById("save"); if (el) el.outerHTML = saveChipHTML(); }

  function setupPanel(k) {
    const isTest = k === "test";
    const base = isTest ? BANK : BY_TOPIC[k];
    const s = isTest ? null : topicStats(k);
    if (isTest) {
      return '<div class="setup" data-for="test">' +
        '<fieldset class="seg"><legend>Number of questions (1 minute each, like the real exam)</legend>' +
        seg("tn", [["16", "16 · one paper's DSA share"], ["30", "30"], ["50", "50"]], "16") + "</fieldset>" +
        '<fieldset class="seg"><legend>Questions from</legend>' +
        seg("tf", [["all", "All topics"], ["new", "Ones I haven't tried"], ["pyq", "Past papers only"]], "all") + "</fieldset>" +
        '<div class="row"><button class="btn primary" data-act="start-test">Start timed test</button><span class="hint">Scored like TRE 4.0: +1 correct, −⅓ wrong, 0 skipped. Answers are shown at the end.</span></div></div>';
    }
    const subs = [...new Set(base.map(secOf))];
    return '<div class="setup" data-for="' + k + '">' +
      '<fieldset class="seg"><legend>Which questions</legend>' +
      seg("pm", [["new", "New first (" + (s.total - s.done) + " left)"], ["all", "Shuffle all " + s.total], ["wrong", "Only my wrong ones (" + s.wrong + ")"]], s.done < s.total ? "new" : "all") + "</fieldset>" +
      '<fieldset class="seg"><legend>How many</legend>' + seg("ps", [["10", "10"], ["25", "25"], ["50", "50"], ["0", "All"]], "25") + "</fieldset>" +
      '<fieldset class="seg"><legend>Level</legend>' + seg("pl", [["0", "All levels"], ["1", "Easy"], ["2", "Medium"], ["3", "Hard"]], "0") + "</fieldset>" +
      (subs.length > 1 && k !== "pyq" ? '<fieldset><legend>Sub-topic</legend><select id="psub" class="btn"><option value="">All ' + subs.length + " sub-topics</option>" + subs.map(x => '<option value="' + esc(x) + '">' + esc(x) + "</option>").join("") + "</select></fieldset>" : "") +
      '<div class="row"><button class="btn primary" data-act="start" data-key="' + k + '">Start practice</button><button class="link" data-act="close-setup">Cancel</button></div></div>';
  }
  function seg(name, items, def) {
    return items.map(([v, l], i) => '<span class="seg"><input type="radio" name="' + name + '" id="' + name + "-" + i + '" value="' + v + '"' + (v === def ? " checked" : "") + '><label for="' + name + "-" + i + '">' + esc(l) + "</label></span>").join("");
  }
  const val = name => { const el = document.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : null; };

  function renderHome() {
    const all = stats(BANK);
    const ready = TOPICS.filter(t => statusOf(topicStats(t.key)).cls === "ready").length;
    let h = '<header class="top"><div class="brand"><span class="eyebrow">BPSC TRE 4.0 · Computer Science · Class 11–12</span><h1>TRE DSA Question Bank</h1>' +
      '<p class="muted">' + BANK.length + " questions in the exam's five-option format, from arrays to P vs NP, plus the 47 DSA questions from TRE 1–3.</p></div>" + saveChipHTML() + "</header>";
    h += '<section class="summary" aria-label="Your progress">' +
      '<div class="stat"><b>' + all.done + '</b><span>of ' + all.total + " questions tried</span></div>" +
      '<div class="stat"><b>' + pct(all.acc) + "</b><span>accuracy overall</span></div>" +
      '<div class="stat"><b>' + ready + "/" + TOPICS.length + "</b><span>topics ready (85%+ on last 50)</span></div>" +
      '<div class="stat"><b>' + all.wrong + "</b><span>questions to redo</span></div></section>";
    h += '<section class="actions"><button class="btn primary" data-act="setup" data-key="test">Timed test</button>' +
      (S && !S.done ? '<button class="btn primary" data-act="resume">Continue ' + esc(S.title) + ' · ' + (S.i + 1) + ' / ' + S.list.length + '</button>' : "") +
      '<button class="btn" data-act="redo-all"' + (all.wrong ? "" : " disabled") + ">Redo all wrong (" + all.wrong + ")</button></section>";
    if (openSetup === "test") h += '<section class="topic" style="display:block">' + setupPanel("test") + "</section>";
    h += '<section class="ledger"><div class="ledger-head"><h2>Topics</h2><span class="muted" style="font-size:13px">Green = right on last try · red = wrong on last try</span></div>';
    TOPICS.forEach(t => {
      const s = topicStats(t.key); const st = statusOf(s);
      const subs = new Set(BY_TOPIC[t.key].map(secOf)).size;
      const cw = s.total ? (s.lastRight / s.total * 100) : 0, ww = s.total ? (s.wrong / s.total * 100) : 0;
      h += '<article class="topic' + (t.key === "pyq" ? " pyq" : "") + '" id="t-' + t.key + '">' +
        '<div class="t-main"><div class="t-head"><h3>' + esc(t.label) + '</h3><span class="t-meta num">' + s.total + " questions" + (t.key === "pyq" ? "" : " · " + subs + " sub-topics") + "</span></div>" +
        (t.note ? '<p class="t-meta">' + esc(t.note) + "</p>" : "") +
        '<div class="bar" role="img" aria-label="' + s.done + " of " + s.total + ' tried"><i class="c" style="width:' + cw.toFixed(1) + '%"></i><i class="w" style="width:' + ww.toFixed(1) + '%"></i></div>' +
        '<p class="t-line num"><span>' + s.done + " of " + s.total + " tried</span><span>" + (s.att ? pct(s.acc) + " correct overall" : "") + "</span></p></div>" +
        '<div class="t-side"><span class="chip ' + st.cls + '">' + esc(st.text) + '</span><div class="t-actions">' +
        '<button class="btn primary" data-act="setup" data-key="' + t.key + '">Practise</button>' +
        (s.wrong ? '<button class="btn" data-act="wrong" data-key="' + t.key + '">Wrong (' + s.wrong + ")</button>" : "") +
        "</div></div>" + (openSetup === t.key ? setupPanel(t.key) : "") + "</article>";
    });
    h += "</section>";
    const weak = weakSubs();
    if (weak.length) {
      h += '<section class="weak"><h2>Sub-topics to revisit</h2><p class="muted" style="font-size:14px">Below 70% correct, with at least 5 attempts. Revise the concept first, then drill.</p><ul>' +
        weak.map(w => '<li><span class="w-name">' + esc(w.sec) + "<small>" + esc(T_BY_KEY[w.k].label) + " · " + pct(w.acc) + " of " + w.att + " attempts correct</small></span>" +
          '<button class="btn" data-act="drill-sub" data-key="' + w.k + '" data-sub="' + esc(w.sec) + '">Drill this</button></li>').join("") + "</ul></section>";
    }
    h += '<section class="notes">' +
      "<div><h3>How the options work</h3><p>Every question has five options, as in TRE 1–3: A–C are content, <b>D</b> is “More than one of the above” and <b>E</b> is “None of the above”. About a quarter of the answers here are D or E, so read all three options before answering.</p></div>" +
      "<div><h3>When is a topic ready?</h3><p>A topic turns green once your last 50 answers in it are at least 85% correct. Redo your wrong ones about a week later; a question leaves the redo list when you get it right.</p></div>" +
      "<div><h3>Where the answers come from</h3><p>Every answer was checked twice, the second time by an independent blind solve, and every trace, calculation and code answer was run as code. Each option has its own explanation. Past-paper answers are worked out here, not BPSC's official key; TRE 3 Q94 is ambiguous as printed.</p></div>" +
      "<div><h3>Keyboard</h3><p><kbd>A</kbd>–<kbd>E</kbd> or <kbd>1</kbd>–<kbd>5</kbd> to answer, <kbd>Enter</kbd> for the next question, <kbd>S</kbd> to skip in a timed test.</p></div></section>";
    h += '<div class="reset">' + (confirmReset
      ? '<span>Clear every answer and start over?</span><button class="btn danger" data-act="reset-yes">Yes, clear my progress</button><button class="link" data-act="reset-no">Keep it</button>'
      : '<button class="link" data-act="reset">Reset progress</button>') + "</div>";
    app.innerHTML = h;
  }

  function weakSubs() {
    const agg = {};
    BANK.forEach(q => { const r = rec(q); if (!r || !r[0]) return; const key = q.k + "|" + secOf(q); const a = agg[key] || (agg[key] = { k: q.k, sec: secOf(q), att: 0, cor: 0 }); a.att += r[0]; a.cor += r[1]; });
    return Object.values(agg).filter(a => a.att >= 5 && a.cor / a.att < 0.7).map(a => (a.acc = a.cor / a.att, a)).sort((x, y) => x.acc - y.acc).slice(0, 8);
  }

  // ---------- sessions ----------
  function startPractice(title, qs, key) {
    if (!qs.length) { alertBox("No questions match that choice. Try a different filter."); return; }
    if (S && !S.done && !window.confirm("Start a new session and replace your current session?")) return;
    clearInterval(timerId);
    S = { kind: "practice", title, list: qs.map(q => q.id), i: 0, picks: {}, key, done: false };
    view = "q"; render(); focusQ();
    persist();
  }
  function alertBox(msg) {
    const el = document.querySelector(".setup .row") || document.querySelector(".actions");
    if (!el) return;
    let n = el.querySelector(".hint.err"); if (!n) { n = document.createElement("span"); n.className = "hint err"; n.style.color = "var(--bad)"; el.appendChild(n); }
    n.textContent = msg;
  }
  function buildPractice(k) {
    const mode = val("pm") || "new", size = +(val("ps") || 25), lvl = +(val("pl") || 0);
    const subSel = document.getElementById("psub"); const sub = subSel ? subSel.value : "";
    let qs = BY_TOPIC[k].filter(q => (!lvl || q.level === lvl) && (!sub || secOf(q) === sub));
    if (mode === "new") { const fresh = qs.filter(q => !rec(q)); qs = fresh.length ? fresh : shuffle(qs); }
    else if (mode === "wrong") qs = shuffle(qs.filter(q => { const r = rec(q); return r && r[0] && !r[2]; }));
    else qs = shuffle(qs);
    if (size) qs = qs.slice(0, size);
    const t = T_BY_KEY[k];
    startPractice(t.label + (sub ? " · " + sub : "") + (mode === "wrong" ? " · wrong ones" : ""), qs, k);
  }
  function startTest() {
    if (S && !S.done && !window.confirm("Start a new test and replace your current session?")) return;
    const n = +(val("tn") || 16), from = val("tf") || "all";
    let pool = from === "pyq" ? BY_TOPIC.pyq : from === "new" ? BANK.filter(q => !rec(q)) : BANK;
    if (pool.length < n) pool = from === "pyq" ? BY_TOPIC.pyq : BANK;
    const qs = shuffle(pool).slice(0, n);
    S = { kind: "test", title: "Timed test · " + qs.length + " questions", list: qs.map(q => q.id), i: 0, picks: {}, limit: qs.length * 60, start: Date.now(), done: false };
    view = "q"; render(); focusQ();
    clearInterval(timerId); timerId = setInterval(tick, 1000);
    persist();
  }
  function tick() {
    if (!S || S.kind !== "test" || S.done) { clearInterval(timerId); return; }
    const left = S.limit - Math.floor((Date.now() - S.start) / 1000);
    const el = document.getElementById("timer");
    if (left <= 0) { finishTest(); return; }
    if (el) { el.textContent = fmt(left); el.classList.toggle("low", left <= 60); }
  }
  const fmt = s => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

  function pick(i) {
    if (!S || view !== "q") return;
    const q = BY_ID[S.list[S.i]];
    if (S.kind === "practice") {
      if (S.picks[q.id] != null) return;
      S.picks[q.id] = i;
      const ok = LETTERS[i] === q.ans;
      record(q, ok); persist();
      if (!ok) saveWrongAnswer();
      renderQuestion(true);
      const nx = document.getElementById("next"); if (nx) nx.focus();
    } else {
      S.picks[q.id] = i; persist(); renderQuestion(true);
    }
  }
  function next(skip) {
    if (!S || view !== "q") return;
    const q = BY_ID[S.list[S.i]];
    if (S.kind === "practice" && S.picks[q.id] == null) return;
    if (S.kind === "test" && skip) delete S.picks[q.id];
    if (S.i < S.list.length - 1) { S.i++; renderQuestion(); focusQ(); }
    else if (S.kind === "practice") { S.done = true; view = "done"; render(); }
    else finishTest();
    persist();
  }
  function previous() {
    if (!S || view !== "q" || S.i === 0) return;
    S.i--; persist(); renderQuestion(); focusQ();
  }
  function resetSession() {
    if (!S || !window.confirm("Restart this session from the first question? Your topic attempt history will be kept.")) return;
    S.i = 0; S.picks = {}; S.done = false;
    if (S.kind === "test") { S.start = Date.now(); S.used = 0; clearInterval(timerId); timerId = setInterval(tick, 1000); }
    view = "q"; persist(); render(); focusQ();
  }
  function finishTest() {
    if (!S || S.done) return;
    S.done = true; S.used = Math.min(S.limit, Math.floor((Date.now() - S.start) / 1000));
    clearInterval(timerId);
    S.list.forEach(id => { const q = BY_ID[id]; const p = S.picks[id]; if (p == null) return; record(q, LETTERS[p] === q.ans); });
    view = "done"; render();
    persist();
    if (S.list.some(id => S.picks[id] != null && LETTERS[S.picks[id]] !== BY_ID[id].ans)) saveWrongAnswer();
  }
  function focusQ() { const el = document.getElementById("qtext"); if (el) el.focus({ preventScroll: false }); window.scrollTo({ top: 0 }); }

  const stripWhy = s => String(s).replace(/^[A-E]\s*[\u2014\u2013-]\s*(Correct|Wrong)\.\s*/, "");
  function teachHTML(q, picked) {
    let h = '<section class="teach">';
    h += '<h4>Concept</h4><p class="concept">' + esc(q.concept || q.exp) + "</p>";
    if (q.work) h += '<h4>Step by step</h4><pre class="work">' + esc(q.work) + "</pre>";
    if (q.why && q.why.length === 5) {
      h += '<h4>Every option explained</h4><ul class="why">';
      q.why.forEach((w, i) => {
        const isAns = LETTERS[i] === q.ans, isPick = picked === i;
        h += '<li class="' + (isAns ? "is-ans " : "") + (isPick ? "is-pick" : "") + '"><span class="wl">' + LETTERS[i] + '</span><div><div class="wo"><span class="wb">' +
          (isAns ? "Answer" : "Not the answer") + (isPick ? " · your pick" : "") + "</span>" + esc(q.opts[i]) + '</div><div class="wt">' + esc(stripWhy(w)) + "</div></div></li>";
      });
      h += "</ul>";
    }
    if (q.tip) h += '<p class="tip"><b>Exam tip:</b> ' + esc(q.tip) + "</p>";
    return h + "</section>";
  }

  function renderQuestion(keepFocus) {
    const q = BY_ID[S.list[S.i]];
    const picked = S.picks[q.id];
    const reveal = S.kind === "practice" && picked != null;
    const n = S.list.length;
    const answered = S.list.filter(id => S.picks[id] != null).length;
    const right = S.list.filter(id => S.picks[id] != null && LETTERS[S.picks[id]] === BY_ID[id].ans).length;
    let h = '<div class="qbar"><button class="link" data-act="quit">← ' + (S.kind === "test" ? "Topics · pause test" : "Topics") + '</button><span class="qtitle">' + esc(S.title) + '</span><span class="right">' +
      (S.kind === "test" ? '<span class="timer num" id="timer">' + fmt(Math.max(0, S.limit - Math.floor((Date.now() - S.start) / 1000))) + "</span>" : "") +
      '<span class="num">' + (S.i + 1) + " / " + n + "</span></span></div>";
    h += saveChipHTML();
    h += '<div class="track"><i style="width:' + ((S.i + (reveal ? 1 : 0)) / n * 100).toFixed(1) + '%"></i></div>';
    h += '<article class="qcard"><div class="qmeta"><span class="tag">' + esc(q.k === "pyq" ? q.subtopic : secOf(q)) + '</span><span class="tag">' + LEVEL_LABEL[q.level] + '</span><span class="tag">' + TYPE_LABEL[q.type] + '</span><span class="qid">' + esc(q.id) + "</span></div>" +
      '<p class="qtext" id="qtext" tabindex="-1">' + esc(q.q) + "</p>" +
      (q.code ? '<pre class="code"><code>' + esc(q.code) + "</code></pre>" : "") + '<ol class="omr">';
    q.opts.forEach((o, i) => {
      let cls = "opt", mark = "";
      if (picked === i) cls += " picked";
      if (reveal) {
        if (LETTERS[i] === q.ans) { cls += " right"; mark = picked === i ? "Your answer · correct" : "Correct answer"; }
        else if (picked === i) { cls += " wrong"; mark = "Your answer"; }
      }
      h += '<li><button class="' + cls + '" data-act="pick" data-i="' + i + '"' + (reveal ? " disabled" : "") + ' aria-label="Option ' + LETTERS[i] + ": " + esc(o) + '"><span class="bubble">' + LETTERS[i] + '</span><span class="otext">' + esc(o) + "</span>" + (mark ? '<span class="mark">' + mark + "</span>" : "") + "</button></li>";
    });
    h += "</ol>";
    if (reveal) {
      const ok = LETTERS[picked] === q.ans;
      h += '<div class="feedback" role="status"><p class="verdict ' + (ok ? "ok" : "bad") + '">' + (ok ? "Correct" : "Not quite. The answer is " + q.ans + ".") + '</p><p class="exp">' + esc(q.exp) + "</p></div>" + teachHTML(q, picked);
    }
    h += "</article>";
    const last = S.i === n - 1;
    if (S.kind === "practice") {
      h += '<div class="qnav"><div class="left"><button class="btn" data-act="previous"' + (S.i ? "" : " disabled") + '>← Previous</button><span class="num muted">' + right + " correct of " + answered + " answered</span></div>" +
        '<button class="btn primary" id="next" data-act="next"' + (reveal ? "" : " disabled") + ">" + (last ? "See summary" : "Next question →") + "</button></div>";
    } else {
      h += '<div class="qnav"><div class="left"><button class="btn" data-act="previous"' + (S.i ? "" : " disabled") + '>← Previous</button><button class="btn" data-act="skip">Skip</button><span class="num muted">' + answered + " answered · " + S.list.slice(0, S.i).filter(id => S.picks[id] == null).length + " skipped so far</span></div>" +
        '<div class="left"><button class="link" data-act="finish">Finish test</button><button class="btn primary" id="next" data-act="next">' + (last ? "Finish test" : "Next →") + "</button></div></div>";
    }
    h += '<p class="keys"><kbd>A</kbd>–<kbd>E</kbd> answer · <kbd>Enter</kbd> next' + (S.kind === "test" ? " · <kbd>S</kbd> skip" : "") + "</p>";
    h += '<div class="reset"><button class="link" data-act="reset-session">Reset session</button></div>';
    app.innerHTML = h;
    if (keepFocus) { const nx = document.getElementById("next"); if (nx && !nx.disabled) nx.focus(); }
  }

  function renderDone() {
    const qs = S.list.map(id => BY_ID[id]);
    const res = qs.map(q => { const p = S.picks[q.id]; return { q, p, st: p == null ? "skip" : LETTERS[p] === q.ans ? "ok" : "bad" }; });
    const c = res.filter(r => r.st === "ok").length, w = res.filter(r => r.st === "bad").length, sk = res.filter(r => r.st === "skip").length;
    let h = '<div class="qbar"><button class="link" data-act="quit">← Topics</button><span class="qtitle">' + esc(S.title) + "</span><span></span></div>";
    h += saveChipHTML();
    if (S.kind === "test") {
      const net = c - w / 3;
      h += '<header class="result-head"><span class="eyebrow">Timed test result</span><h1 class="num">' + (Math.round(net * 100) / 100) + " / " + qs.length + "</h1>" +
        '<p class="muted">Net score with TRE 4.0 marking (+1, −⅓, 0). Time used ' + fmt(S.used) + " of " + fmt(S.limit) + ".</p></header>";
      h += '<section class="summary"><div class="stat"><b>' + c + '</b><span>correct</span></div><div class="stat"><b>' + w + '</b><span>wrong (−' + (Math.round(w / 3 * 100) / 100) + ')</span></div><div class="stat"><b>' + sk + '</b><span>skipped</span></div><div class="stat"><b>' + pct(c + w ? c / (c + w) : null) + "</b><span>accuracy on attempted</span></div></section>";
    } else {
      h += '<header class="result-head"><span class="eyebrow">Practice summary</span><h1 class="num">' + c + " / " + qs.length + ' correct</h1><p class="muted">' + (c === qs.length ? "Clean sheet. Move on or try a harder level." : "The ones you missed are on your redo list.") + "</p></header>";
    }
    const missed = res.filter(r => r.st !== "ok");
    h += '<section class="actions">' +
      (missed.length && S.kind === "practice" ? '<button class="btn primary" data-act="redo-session">Redo the ' + missed.length + " I missed</button>" : "") +
      (S.key ? '<button class="btn" data-act="setup-again" data-key="' + S.key + '">Practise ' + esc(T_BY_KEY[S.key].label) + " again</button>" : "") +
      '<button class="btn" data-act="quit">Back to topics</button></section>';
    const order = res.slice().sort((a, b) => ({ bad: 0, skip: 1, ok: 2 }[a.st] - { bad: 0, skip: 1, ok: 2 }[b.st]));
    h += '<section class="review"><h2>Review</h2>' + order.map(r => {
      const q = r.q;
      return '<details' + (r.st === "bad" && S.kind === "test" ? " open" : "") + '><summary><span class="st ' + r.st + '">' + (r.st === "ok" ? "RIGHT" : r.st === "bad" ? "WRONG" : "SKIPPED") + '</span><span class="qs">' + esc(q.q.split("\n")[0]) + "</span></summary>" +
        '<div class="body"><p class="qtext">' + esc(q.q) + "</p>" + (q.code ? '<pre class="code"><code>' + esc(q.code) + "</code></pre>" : "") +
        '<p class="exp"><b>Answer ' + q.ans + ':</b> ' + esc(q.exp) + "</p>" + teachHTML(q, r.p) +
        '<p class="mono muted" style="font-size:12px">' + esc(q.id) + " · " + esc(q.k === "pyq" ? q.subtopic : secOf(q)) + "</p></div></details>";
    }).join("") + "</section>";
    app.innerHTML = h;
    window.scrollTo({ top: 0 });
  }

  function render() {
    if (view === "home") renderHome();
    else if (view === "q") renderQuestion();
    else renderDone();
  }

  // ---------- events ----------
  app.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if (!b || b.disabled) return;
    const act = b.dataset.act, k = b.dataset.key;
    if (act === "setup") { openSetup = openSetup === k ? null : k; confirmReset = false; renderHome(); const el = document.querySelector('.setup[data-for="' + k + '"]'); if (el) el.scrollIntoView({ block: "nearest" }); }
    else if (act === "close-setup") { openSetup = null; renderHome(); }
    else if (act === "start") buildPractice(k);
    else if (act === "wrong") { const qs = shuffle(BY_TOPIC[k].filter(q => { const r = rec(q); return r && r[0] && !r[2]; })); startPractice(T_BY_KEY[k].label + " · wrong ones", qs, k); }
    else if (act === "redo-all") { const qs = shuffle(BANK.filter(q => { const r = rec(q); return r && r[0] && !r[2]; })); startPractice("All my wrong answers", qs, null); }
    else if (act === "drill-sub") { const sub = b.dataset.sub; const qs = shuffle(BY_TOPIC[k].filter(q => secOf(q) === sub)).slice(0, 25); startPractice(T_BY_KEY[k].label + " · " + sub, qs, k); }
    else if (act === "start-test") startTest();
    else if (act === "pick") pick(+b.dataset.i);
    else if (act === "next") next(false);
    else if (act === "previous") previous();
    else if (act === "reset-session") resetSession();
    else if (act === "save") { saveCloud(); }
    else if (act === "load-save") { if (window.confirm("Load your account save and discard unsaved changes in this browser?")) { localStorage.removeItem(LS_KEY); location.reload(); } }
    else if (act === "resume") {
      view = "q";
      if (S.kind === "test") { S.start = Date.now() - (S.used || 0) * 1000; clearInterval(timerId); timerId = setInterval(tick, 1000); }
      persist(); render(); focusQ();
    }
    else if (act === "skip") next(true);
    else if (act === "finish") finishTest();
    else if (act === "quit") { clearInterval(timerId); if (S && S.kind === "test" && !S.done) S.used = S.limit - remaining(); view = "home"; openSetup = null; persist(); saveWhenLeaving(); renderHome(); window.scrollTo({ top: 0 }); }
    else if (act === "redo-session") { const qs = S.list.map(id => BY_ID[id]).filter(q => S.picks[q.id] == null || LETTERS[S.picks[q.id]] !== q.ans); startPractice(S.title.replace(/ · redo$/, "") + " · redo", shuffle(qs), S.key); }
    else if (act === "setup-again") { S = null; view = "home"; openSetup = k; persist(); renderHome(); const el = document.getElementById("t-" + k); if (el) el.scrollIntoView({ block: "start" }); }
    else if (act === "reset") { confirmReset = true; renderHome(); }
    else if (act === "reset-no") { confirmReset = false; renderHome(); }
    else if (act === "reset-yes") {
      if (saving) return;
      if (conflict) { storeNote = "Load the newer account save before resetting progress."; renderSaveChip(); return; }
      clearInterval(timerId); P = {}; S = null; view = "home"; confirmReset = false;
      persist(); renderHome(); if (remote && !conflict) saveCloud();
    }
  });
  document.addEventListener("keydown", e => {
    if (view !== "q" || !S) return;
    if (e.target.matches && e.target.matches("input, select, textarea")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    const idx = "abcde".indexOf(k) >= 0 ? "abcde".indexOf(k) : "12345".indexOf(k);
    if (idx >= 0 && k.length === 1) { e.preventDefault(); pick(idx); return; }
    if (k === "enter") { if (e.target.closest && e.target.closest("button") && e.target.id !== "next") return; e.preventDefault(); next(false); }
    else if (k === "s" && S.kind === "test") { e.preventDefault(); next(true); }
  });

  // ---------- boot ----------
  loadSaved();
  render();
  if (S && S.kind === "test" && !S.done && view === "q") { tick(); timerId = setInterval(tick, 1000); }
  window.addEventListener("pagehide", saveWhenLeaving);
  document.addEventListener("visibilitychange", () => { if (document.hidden) saveWhenLeaving(); });
})();
