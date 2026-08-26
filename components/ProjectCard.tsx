"use client";

import { useId, useState } from "react";
import type { Project } from "@/lib/content";
import SpotlightCard from "./SpotlightCard";

type Labels = {
  roleLabel: string;
  problemLabel: string;
  builtLabel: string;
  more: string;
  less: string;
};

export default function ProjectCard({
  project,
  labels,
  featured = false,
}: {
  project: Project;
  labels: Labels;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <SpotlightCard featured={featured} className="h-full">
      <article
        className={`card flex h-full flex-col overflow-hidden transition-colors duration-200 ${
          featured ? "shadow-e3" : "hover:border-border-bright"
        }`}
      >
        <div className={featured ? "p-7 sm:p-9" : "p-6 sm:p-7"}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <h3
              className={`font-semibold tracking-tight text-fg ${
                featured ? "text-xl sm:text-3xl" : "text-lg sm:text-xl"
              }`}
            >
              {project.title}
            </h3>
            <span className="t-label tnum text-fg-dim">{project.year}</span>
          </div>

          <p className="t-label mt-2.5 text-accent">{project.kind}</p>

          <p
            className={`mt-4 leading-relaxed text-fg-muted ${
              featured ? "t-lead max-w-2xl" : "text-[15px]"
            }`}
          >
            {project.summary}
          </p>

          {project.metric && (
            <div className="mt-6 inline-flex items-baseline gap-2.5 rounded-chip border border-border bg-surface-2 px-3.5 py-2">
              <span
                className="tnum font-mono text-xl font-semibold text-accent"
                data-countup={
                  /^[\d,]+$/.test(project.metric.value)
                    ? project.metric.value.replace(/,/g, "")
                    : undefined
                }
              >
                {project.metric.value}
              </span>
              <span className="font-mono text-[11px] text-fg-dim">
                {project.metric.label}
              </span>
            </div>
          )}

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-chip border border-border bg-surface-2 px-2 py-1 font-mono text-[11px] text-fg-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="mt-7 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-chip text-sm font-medium text-accent transition-opacity duration-150 hover:opacity-70 active:opacity-50"
          >
            {open ? labels.less : labels.more}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200"
              style={{ transform: open ? "rotate(180deg)" : "none" }}
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {open && (
          <div
            id={panelId}
            className="border-t border-hairline px-6 pb-8 pt-6 sm:px-7"
          >
            <h4 className="t-label text-fg-dim">{labels.problemLabel}</h4>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fg-muted">
              {project.problem}
            </p>

            <h4 className="t-label mt-7 text-fg-dim">{labels.builtLabel}</h4>
            <ul className="mt-2.5 space-y-2.5">
              {project.built.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-[15px] leading-relaxed text-fg-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-3 shrink-0 bg-accent-deep"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h4 className="t-label mt-7 text-fg-dim">{labels.roleLabel}</h4>
            <p className="mt-2.5 border-l-2 border-accent-deep pl-4 text-[15px] leading-relaxed text-fg">
              {project.role}
            </p>
          </div>
        )}
      </article>
    </SpotlightCard>
  );
}
