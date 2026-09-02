"use client";

import { useId, useState } from "react";
import type { Project } from "@/lib/content";
import SpotlightCard from "./SpotlightCard";
import ProjectSignature from "./ProjectSignature";

type Labels = {
  roleLabel: string;
  problemLabel: string;
  builtLabel: string;
  more: string;
  less: string;
};

/**
 * A case study as a record, not a tile.
 *
 * The left rail carries the metadata that actually exists for this project
 * — year, domain, and the commit count where it is verifiable — in mono.
 * The prose hangs off the right column at a fixed measure. The structure
 * encodes real data rather than varying card sizes for visual interest.
 */
export default function ProjectCard({
  project,
  labels,
  territory,
  featured = false,
}: {
  project: Project;
  labels: Labels;
  territory: string;
  featured?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <SpotlightCard className="h-full" featured={featured}>
      <article className={`card project-card h-full transition-colors duration-150 hover:border-border-bright ${featured ? "project-card--featured" : ""}`}>
        <div className="project-card__territory" aria-label={territory}>
          <span aria-hidden="true" />
          {territory}
        </div>
        <div className="rail-grid p-6 sm:p-8">
          {/* ── Metadata rail ─────────────────────────────── */}
          <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-y-5">
            <div>
              <span className="tnum block font-mono text-[12px] text-fg-muted">
                {project.year}
              </span>
            </div>

            <div className="md:max-w-[7.5rem]">
              <span className="t-label block text-accent">{project.kind}</span>
            </div>

            {project.metric && (
              <div>
                <span
                  className="tnum block font-mono text-2xl font-semibold leading-none text-fg"
                  data-countup={
                    /^[\d,]+$/.test(project.metric.value)
                      ? project.metric.value.replace(/,/g, "")
                      : undefined
                  }
                >
                  {project.metric.value}
                </span>
                <span className="mt-1.5 block font-mono text-[10.5px] leading-snug text-fg-dim">
                  {project.metric.label}
                </span>
              </div>
            )}
          </div>

          {/* ── Prose column ──────────────────────────────── */}
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg sm:text-2xl">
              {project.title}
            </h3>

            {/* Lead: larger and lighter than body copy. */}
            <p className="t-lead measure mt-4 text-fg-muted">
              {project.summary}
            </p>

            {featured && <ProjectSignature projectId={project.id} />}

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

            {open && (
              <div id={panelId} className="mt-7 border-t border-hairline pt-7">
                <h4 className="t-label text-fg-dim">{labels.problemLabel}</h4>
                <p className="measure mt-2.5 text-[15px] leading-relaxed text-fg-muted">
                  {project.problem}
                </p>

                <h4 className="t-label mt-7 text-fg-dim">{labels.builtLabel}</h4>
                <ul className="mt-2.5 space-y-2.5">
                  {project.built.map((item, i) => (
                    <li
                      key={i}
                      className="measure flex gap-3 text-[15px] leading-relaxed text-fg-muted"
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
                <p className="measure mt-2.5 border-l-2 border-accent-deep pl-4 text-[15px] leading-relaxed text-fg">
                  {project.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
