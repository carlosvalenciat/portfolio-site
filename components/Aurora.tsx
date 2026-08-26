"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient mesh-gradient field behind the hero.
 *
 * Purely decorative, so it is hidden from assistive tech. Three blurred
 * colour fields drift on a long cycle; CSS handles prefers-reduced-motion,
 * and this component additionally parks the animation whenever the tab is
 * hidden so a backgrounded page burns no compositor time.
 */
export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onVisibility = () => {
      const state = document.hidden ? "paused" : "running";
      el.querySelectorAll<HTMLElement>(".aurora-layer").forEach((layer) => {
        layer.style.animationPlayState = state;
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="aurora-layer absolute -left-[18%] -top-[42%] h-[78vh] w-[78vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--p-aurora-a), transparent 66%)",
        }}
      />
      <div
        className="aurora-layer absolute -right-[14%] -top-[22%] h-[62vh] w-[62vw] rounded-full blur-[110px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--p-aurora-b), transparent 68%)",
          animationDelay: "-8s",
          animationDuration: "27s",
        }}
      />
      <div
        className="aurora-layer absolute left-[26%] top-[4%] h-[46vh] w-[52vw] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--p-aurora-c), transparent 70%)",
          animationDelay: "-15s",
          animationDuration: "31s",
        }}
      />
      <div className="tech-grid grid-fade absolute inset-0" />
    </div>
  );
}
