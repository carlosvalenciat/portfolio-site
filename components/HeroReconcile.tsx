"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

/**
 * The signature moment: the name does not fade in, it reconciles.
 *
 * Two ghost records — one cyan, one amber — arrive offset and out of
 * agreement, then converge into a single settled headline. It is the
 * architecture the case studies describe, drawn in type: two sources that
 * disagree becoming one truth.
 *
 * It runs once, on load. That is the page's entire motion budget for
 * orchestration; everything else is a micro-interaction.
 */
export default function HeroReconcile({ text }: { text: string }) {
  const wrap = useRef<HTMLHeadingElement>(null);
  const real = useRef<HTMLSpanElement>(null);
  const ghostA = useRef<HTMLSpanElement>(null);
  const ghostB = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (played.current) return;
    const node = real.current;
    const a = ghostA.current;
    const b = ghostB.current;
    if (!node || !a || !b) return;

    played.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([a, b], { opacity: 0 });
      gsap.set(node, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const splitReal = new SplitText(node, { type: "chars" });
      const splitA = new SplitText(a, { type: "chars" });
      const splitB = new SplitText(b, { type: "chars" });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => {
          // Hand the DOM back to React so a language switch re-renders cleanly.
          splitReal.revert();
          splitA.revert();
          splitB.revert();
          gsap.set([a, b], { opacity: 0 });
          gsap.set(node, { opacity: 1, clearProps: "transform" });
        },
      });

      tl.set([a, b], { opacity: 1 })
        .from(
          splitA.chars,
          { x: -26, y: 8, opacity: 0, duration: 0.55, stagger: 0.012 },
          0,
        )
        .from(
          splitB.chars,
          { x: 26, y: -8, opacity: 0, duration: 0.55, stagger: 0.012 },
          0.05,
        )
        .to([a, b], { opacity: 0, duration: 0.3 }, 0.5)
        .from(
          splitReal.chars,
          { opacity: 0, y: 10, duration: 0.5, stagger: 0.014 },
          0.42,
        );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={wrap}
      className="t-display relative text-fg"
    >
      {/* Ghosts are decorative duplicates of the same string — the
          accessible name comes from the real layer only. */}
      <span
        ref={ghostA}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-accent opacity-0"
      >
        {text}
      </span>
      <span
        ref={ghostB}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-pending opacity-0"
      >
        {text}
      </span>
      <span ref={real} className="relative block">
        {text}
      </span>
    </h1>
  );
}
