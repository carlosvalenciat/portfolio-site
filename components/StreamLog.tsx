"use client";

import { useEffect, useRef, useState } from "react";

export type LogLine = { t: string; text: string; tone?: "ok" | "warn" | "accent" };

/**
 * Diegetic element: a log stream that reveals line by line, the way the
 * pipelines described on this page actually report themselves.
 *
 * It is a <ul> of real text, not an animation of decorative glyphs — a
 * screen reader gets the complete list immediately. Under reduced motion,
 * or before hydration, every line is present from the first paint.
 */
export default function StreamLog({
  lines,
  label,
}: {
  lines: LogLine[];
  label: string;
}) {
  const [shown, setShown] = useState(lines.length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          setShown(0);
          let i = 0;
          const tick = () => {
            i += 1;
            setShown(i);
            if (i < lines.length) timer = window.setTimeout(tick, 190);
          };
          timer = window.setTimeout(tick, 120);
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [lines.length]);

  const toneClass = (tone?: LogLine["tone"]) =>
    tone === "accent"
      ? "text-accent"
      : tone === "warn"
        ? "text-fg-dim"
        : "text-fg-muted";

  return (
    <div ref={ref} className="card-raised grain relative overflow-hidden">
      {/* The three traffic-light dots that used to sit here were removed:
          they imitated window chrome and encoded nothing. The label alone
          says what this is. */}
      <div className="border-b border-hairline px-4 py-2.5">
        <span className="t-label text-fg-dim">{label}</span>
      </div>

      <ul className="space-y-1.5 px-4 py-4 font-mono text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <li
            key={i}
            className={`flex gap-3 transition-opacity duration-200 ${
              i < shown ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="tnum shrink-0 text-fg-dim/70">{line.t}</span>
            <span className={toneClass(line.tone)}>{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
