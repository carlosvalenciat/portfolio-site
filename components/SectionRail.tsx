"use client";

import { useEffect, useRef, useState } from "react";

export type RailSection = { id: string; label: string };

/**
 * The page spine: reading position and section identity in one fixed rail.
 *
 * Deliberately quiet. The boldness budget is spent on the headline, so
 * this earns its place by being useful rather than by being animated —
 * a hairline that fills as you read, and one marker that lights up.
 *
 * Hidden below xl, where the top nav already covers navigation and the
 * viewport has no room to spare.
 */
export default function SectionRail({
  sections,
  label,
}: {
  sections: RailSection[];
  label: string;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    nodes.forEach((n) => io.observe(n));

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  return (
    <nav
      aria-label={label}
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-16 xl:block"
    >
      <div className="pointer-events-auto flex h-full flex-col justify-center gap-1 pl-6">
        {/* Progress hairline */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[1.65rem] top-0 w-px bg-hairline"
        >
          <div
            className="w-px origin-top bg-accent/50 transition-transform duration-150 ease-out"
            style={{ height: "100%", transform: `scaleY(${progress})` }}
          />
        </div>

        <ul className="relative flex flex-col gap-1">
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  className="group flex min-h-[44px] items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-px transition-all duration-200 ${
                      on
                        ? "w-5 bg-accent"
                        : "w-2.5 bg-fg-dim/50 group-hover:w-4 group-hover:bg-fg-muted"
                    }`}
                  />
                  <span
                    className={`t-label whitespace-nowrap transition-opacity duration-200 ${
                      on
                        ? "text-accent opacity-100"
                        : "text-fg-dim opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    {s.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
