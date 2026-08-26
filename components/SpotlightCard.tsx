"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Card with a cursor-tracked spotlight.
 *
 * Gated on (pointer: fine) — on touch there is no cursor to follow, and
 * attaching the listener would cost work for an effect nobody can see.
 * The glow is drawn by CSS from --mx/--my (see .spotlight in globals.css),
 * so this only writes two custom properties and never triggers layout.
 */
export default function SpotlightCard({
  children,
  className = "",
  featured = false,
}: {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!fine || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
      ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    [fine],
  );

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`relative ${fine ? "spotlight" : ""} ${
        featured ? "border-flow" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
