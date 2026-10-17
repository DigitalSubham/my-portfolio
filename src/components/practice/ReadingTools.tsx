"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Printer } from "lucide-react";

export default function ReadingTools({ chapter, subject = "history" }: { chapter: string; subject?: string }) {
  const [size, setSize] = useState(18);
  useEffect(() => {
    const article = document.getElementById(`${subject}-note`);
    let restored = 18, position = 0;
    try {
      restored = Math.min(24, Math.max(16, Number(localStorage.getItem(`${subject}-font-size`)) || 18));
      const saved = JSON.parse(localStorage.getItem(`${subject}-reading-v1`) || "null");
      if (saved?.chapter === chapter) position = Number(saved.scroll) || 0;
    } catch { /* Reading still works without browser storage. */ }
    setSize(restored);
    article?.style.setProperty("--reading-size", `${restored}px`);
    let touched = false;
    const move = () => { touched = true; };
    const save = () => {
      try { localStorage.setItem(`${subject}-reading-v1`, JSON.stringify({ chapter, scroll: window.scrollY })); } catch { /* Keep reading when storage is unavailable. */ }
    };
    const restore = () => { if (!touched && !location.hash && position) window.scrollTo({ top: position, behavior: "instant" }); };
    const frame = requestAnimationFrame(restore);
    void document.fonts.ready.then(restore);
    const onScroll = () => { if (timer) clearTimeout(timer); timer = setTimeout(save, 400); };
    let timer: ReturnType<typeof setTimeout> | undefined;
    save();
    window.addEventListener("wheel", move, { passive: true }); window.addEventListener("touchstart", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("pagehide", save);
    return () => { touched = true; save(); cancelAnimationFrame(frame); if (timer) clearTimeout(timer); window.removeEventListener("wheel", move); window.removeEventListener("touchstart", move); window.removeEventListener("scroll", onScroll); window.removeEventListener("pagehide", save); };
  }, [chapter, subject]);
  function resize(next: number) {
    setSize(next); document.getElementById(`${subject}-note`)?.style.setProperty("--reading-size", `${next}px`);
    try { localStorage.setItem(`${subject}-font-size`, String(next)); } catch { /* The chosen size still applies to this page. */ }
  }
  return <div className="reading-tools" aria-label="Reading tools">
    <button type="button" title="Decrease text size" aria-label="Decrease text size" onClick={() => resize(Math.max(16, size - 1))} disabled={size <= 16}><Minus size={17} /></button>
    <output aria-label="Text size">{size}</output>
    <button type="button" title="Increase text size" aria-label="Increase text size" onClick={() => resize(Math.min(24, size + 1))} disabled={size >= 24}><Plus size={17} /></button>
    <button type="button" title="Print chapter" aria-label="Print chapter" onClick={() => window.print()}><Printer size={17} /></button>
  </div>;
}
