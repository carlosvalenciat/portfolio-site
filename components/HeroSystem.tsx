"use client";

import { useEffect, useRef } from "react";

const nodes = [
  { label: "MACHINE", state: "signal", tone: "amber" },
  { label: "AUTOMATION", state: "route", tone: "cyan" },
  { label: "AI / AGENT", state: "reason", tone: "violet" },
  { label: "BUSINESS SYSTEM", state: "commit", tone: "green" },
] as const;

export default function HeroSystem() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--system-rx", `${(-y * 2.6).toFixed(2)}deg`);
      el.style.setProperty("--system-ry", `${(x * 3.8).toFixed(2)}deg`);
    };
    const reset = () => {
      el.style.setProperty("--system-rx", "0deg");
      el.style.setProperty("--system-ry", "0deg");
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div ref={ref} className="hero-system" aria-hidden="true">
      <div className="hero-system__plane" />
      <div className="hero-system__header">
        <span>SYSTEM PATH / 01</span>
        <span className="hero-system__live">LIVE</span>
      </div>
      <div className="hero-system__path">
        {nodes.map((node, index) => (
          <div className="hero-system__step" key={node.label}>
            <div className={`hero-system__node hero-system__node--${node.tone}`}>
              <span className="hero-system__index">0{index + 1}</span>
              <span className="hero-system__label">{node.label}</span>
              <span className="hero-system__state">{node.state}</span>
            </div>
            {index < nodes.length - 1 && (
              <span className="hero-system__link">
                <span className="hero-system__pulse" />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="hero-system__footer">
        <span>RAW SIGNAL</span>
        <span>VALIDATED / COMMITTED</span>
      </div>
    </div>
  );
}
