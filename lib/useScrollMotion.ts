"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Duration hierarchy (ms). Exit is faster than entry — a thing leaving
 * should not cost the reader as much attention as a thing arriving.
 */
export const DUR = {
  micro: 0.16,
  state: 0.32,
  section: 0.62,
  exit: 0.2,
} as const;

const STAGGER = 0.075; // 75ms — inside the 60–90ms band

/**
 * Registers every scroll-driven animation for the page in one context.
 *
 * gsap.matchMedia gates the whole thing on prefers-reduced-motion: under
 * "reduce" nothing is registered at all and .gs-reveal renders in its final
 * state via the CSS fallback. ctx.revert() on unmount kills every tween and
 * ScrollTrigger this created — no orphaned listeners between route changes.
 */
export function useScrollMotion(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!scope.current) return;

    const root = scope.current;
    root.classList.add("gs-ready");

    const mm = gsap.matchMedia();

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        motionReduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motionOK } = context.conditions as { motionOK: boolean };
        if (!motionOK) {
          gsap.set(root.querySelectorAll(".gs-reveal"), {
            opacity: 1,
            y: 0,
            clearProps: "transform",
          });
          return;
        }

        const cleanups: Array<() => void> = [];

        const ctx = gsap.context(() => {
          // ── Grouped reveals: one ScrollTrigger per group, not per node ──
          const groups = new Map<string, HTMLElement[]>();
          const singles: HTMLElement[] = [];

          root.querySelectorAll<HTMLElement>(".gs-reveal").forEach((el) => {
            const g = el.dataset.revealGroup;
            if (g) {
              const list = groups.get(g) ?? [];
              list.push(el);
              groups.set(g, list);
            } else {
              singles.push(el);
            }
          });

          groups.forEach((els) => {
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: DUR.section,
              ease: "expo.out",
              stagger: STAGGER,
              scrollTrigger: {
                trigger: els[0].parentElement ?? els[0],
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
          });

          singles.forEach((el) => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: DUR.section,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });
          });

          // ── Hero parallax: batched, scrubbed, transform-only ──
          const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");
          layers.forEach((layer, i) => {
            gsap.to(layer, {
              yPercent: (i + 1) * -7,
              ease: "none",
              scrollTrigger: {
                trigger: layer.parentElement,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            });
          });

          // ── Magnetic primary CTA ──
          // Preset: hover + mousemove, elastic.out(1,0.4), driven through
          // quickTo so no tween is allocated per pointer event.
          const finePointer = window.matchMedia("(pointer: fine)").matches;
          if (finePointer)
            root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", {
              duration: 0.4,
              ease: "elastic.out(1,0.4)",
            });
            const yTo = gsap.quickTo(el, "y", {
              duration: 0.4,
              ease: "elastic.out(1,0.4)",
            });

            const onMove = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              xTo((e.clientX - r.left - r.width / 2) * 0.3);
              yTo((e.clientY - r.top - r.height / 2) * 0.3);
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };

            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerleave", onLeave);
            });
          });

          // ── Count-up on the metric row ──
          root.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
            const target = Number(el.dataset.countup);
            if (!Number.isFinite(target)) return;
            const suffix = el.dataset.suffix ?? "";
            const obj = { v: 0 };

            gsap.to(obj, {
              v: target,
              duration: 1.1,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
              onUpdate: () => {
                el.textContent = Math.round(obj.v).toLocaleString() + suffix;
              },
            });
          });
        }, root);

        return () => {
          cleanups.forEach((fn) => fn());
          ctx.revert();
        };
      },
    );

    // Fonts and images change layout; recalc once settled.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, [scope]);
}
