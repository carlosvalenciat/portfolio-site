"use client";

import { useId, useState } from "react";
import type { Project } from "@/lib/content";

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
}: {
  project: Project;
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="group rounded-xl border border-border bg-surface/70 transition-colors duration-200 hover:border-border-bright">
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
            {project.title}
          </h3>
          <span className="rule-label text-fg-dim">{project.year}</span>
        </div>

        <p className="rule-label mt-2 text-accent">{project.kind}</p>

        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
          {project.summary}
        </p>

        {project.metric && (
          <div className="mt-5 inline-flex items-baseline gap-2.5 rounded-md border border-border bg-surface-2 px-3 py-2">
            <span className="font-mono text-lg font-semibold text-accent">
              {project.metric.value}
            </span>
            <span className="font-mono text-[11px] text-fg-dim">
              {project.metric.label}
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-border bg-surface-2 px-2 py-1 font-mono text-[11px] text-fg-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-medium text-accent transition-opacity duration-200 hover:opacity-75"
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
          className="border-t border-border px-6 pb-7 pt-6 sm:px-7"
        >
          <h4 className="rule-label text-fg-dim">{labels.problemLabel}</h4>
          <p className="mt-2.5 text-[15px] leading-relaxed text-fg-muted">
            {project.problem}
          </p>

          <h4 className="rule-label mt-7 text-fg-dim">{labels.builtLabel}</h4>
          <ul className="mt-2.5 space-y-2.5">
            {project.built.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-relaxed text-fg-muted"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-px w-3 shrink-0 bg-accent-dim"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h4 className="rule-label mt-7 text-fg-dim">{labels.roleLabel}</h4>
          <p className="mt-2.5 border-l-2 border-accent-dim pl-4 text-[15px] leading-relaxed text-fg">
            {project.role}
          </p>
        </div>
      )}
    </article>
  );
}
