"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroReconcile({ text }: { text: string }) {
  const wrap = useRef<HTMLHeadingElement>(null);
  const real = useRef<HTMLSpanElement>(null);
  const ghostA = useRef<HTMLSpanElement>(null);
  const ghostB = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const [first, ...rest] = text.split(" ");
  const visualText = (
    <>
      {first}
      {rest.length > 0 && (
        <>
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          {rest.join(" ")}
        </>
      )}
    </>
  );

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
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          onComplete: () => {
            gsap.set([a, b], { opacity: 0 });
            gsap.set(node, { opacity: 1, clearProps: "transform" });
          },
        })
        .set([a, b], { opacity: 1 })
        .from(a, { x: -22, y: 7, opacity: 0, duration: 0.55 }, 0)
        .from(b, { x: 22, y: -7, opacity: 0, duration: 0.55 }, 0.05)
        .to([a, b], { opacity: 0, duration: 0.3 }, 0.5)
        .from(node, { opacity: 0, y: 8, duration: 0.5 }, 0.42);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <h1 ref={wrap} aria-label={text} className="t-display hero-heading relative text-fg">
      <span ref={ghostA} aria-hidden="true" className="pointer-events-none absolute inset-0 block text-accent opacity-0">
        {visualText}
      </span>
      <span ref={ghostB} aria-hidden="true" className="pointer-events-none absolute inset-0 block text-pending opacity-0">
        {visualText}
      </span>
      <span ref={real} aria-hidden="true" className="relative block">
        {visualText}
      </span>
    </h1>
  );
}
