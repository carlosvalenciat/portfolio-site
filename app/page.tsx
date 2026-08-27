"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { dict, type Lang } from "@/lib/content";
import { useScrollMotion } from "@/lib/useScrollMotion";
import Reveal from "@/components/Reveal";
import SignalField from "@/components/SignalField";
import HeroReconcile from "@/components/HeroReconcile";
import SectionRail from "@/components/SectionRail";
import CommandPalette, { type Command } from "@/components/CommandPalette";
import Pipeline from "@/components/Pipeline";
import ProjectCard from "@/components/ProjectCard";
import SpotlightCard from "@/components/SpotlightCard";
import StreamLog from "@/components/StreamLog";

const UI = {
  en: {
    more: "Read the case study",
    less: "Close",
    copied: "Copied",
    copy: "Copy email",
    skip: "Skip to content",
    langGroup: "Language",
    rail: "Sections",
    cmdTitle: "Commands",
    cmdPlaceholder: "Jump to a section, switch language, copy contact…",
    cmdEmpty: "No matching command",
    cmdOpen: "Commands",
    goTo: "Go to",
    switchTo: "Switch to Spanish",
    copyCmd: "Copy email address",
    openGithub: "Open GitHub profile",
    section: "section",
  },
  es: {
    more: "Leer el case study",
    less: "Cerrar",
    copied: "Copiado",
    copy: "Copiar correo",
    skip: "Saltar al contenido",
    langGroup: "Idioma",
    rail: "Secciones",
    cmdTitle: "Comandos",
    cmdPlaceholder: "Ir a una sección, cambiar idioma, copiar contacto…",
    cmdEmpty: "Ningún comando coincide",
    cmdOpen: "Comandos",
    goTo: "Ir a",
    switchTo: "Cambiar a inglés",
    copyCmd: "Copiar correo",
    openGithub: "Abrir perfil de GitHub",
    section: "sección",
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [copied, setCopied] = useState(false);
  const scope = useRef<HTMLDivElement>(null);
  const t = dict[lang];
  const ui = UI[lang];

  useScrollMotion(scope);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cv-lang");
      if (saved === "en" || saved === "es") setLang(saved);
    } catch {
      /* keep the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem("cv-lang", lang);
    } catch {
      /* preference just won't persist */
    }
  }, [lang]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(t.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (insecure context, denied permission): the address
      // is visible and selectable below, so nothing is lost.
      setCopied(false);
    }
  };

  const sections = useMemo(
    () => [
      { id: "work", label: t.nav.work },
      { id: "how", label: t.nav.how },
      { id: "stack", label: t.nav.stack },
      { id: "contact", label: t.nav.contact },
    ],
    [t.nav],
  );

  const commands: Command[] = useMemo(() => {
    const jump: Command[] = sections.map((s) => ({
      id: `go-${s.id}`,
      label: `${ui.goTo} ${s.label}`,
      hint: ui.section,
      run: () => document.getElementById(s.id)?.scrollIntoView({ block: "start" }),
    }));

    return [
      ...jump,
      {
        id: "lang",
        label: lang === "en" ? "Cambiar a español" : "Switch to English",
        hint: lang === "en" ? "ES" : "EN",
        run: () => setLang(lang === "en" ? "es" : "en"),
      },
      {
        id: "copy",
        label: ui.copyCmd,
        hint: t.contact.email,
        run: copyEmail,
      },
      {
        id: "github",
        label: ui.openGithub,
        hint: "github.com",
        run: () =>
          window.open(
            "https://github.com/carlosvalenciat",
            "_blank",
            "noopener,noreferrer",
          ),
      },
    ];
    // copyEmail closes over t.contact.email, which is covered by `lang`.
  }, [sections, lang, ui, t.contact.email]);

  return (
    <div ref={scope}>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-chip focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
      >
        {ui.skip}
      </a>

      <SectionRail sections={sections} label={ui.rail} />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-hairline bg-bg/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a
            href="#top"
            className="inline-flex min-h-[44px] items-center rounded-chip pr-2 font-mono text-[13px] font-medium tracking-tight text-fg transition-colors duration-150 hover:text-accent"
          >
            CV<span className="text-accent">.</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-5">
            <ul className="hidden items-center gap-5 lg:flex">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="rounded-chip text-[13.5px] text-fg-muted transition-colors duration-150 hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <CommandPalette
              commands={commands}
              lang={lang}
              copy={{
                title: ui.cmdTitle,
                placeholder: ui.cmdPlaceholder,
                empty: ui.cmdEmpty,
                open: ui.cmdOpen,
              }}
            />

            <div
              className="flex items-center rounded-chip border border-control bg-surface p-0.5"
              role="group"
              aria-label={ui.langGroup}
            >
              {(["en", "es"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`min-h-[36px] min-w-[44px] cursor-pointer rounded-[5px] font-mono text-[11px] uppercase tracking-wider transition-colors duration-150 ${
                    lang === code
                      ? "bg-surface-2 text-accent"
                      : "text-fg-dim hover:text-fg-muted"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="grain relative overflow-hidden border-b border-hairline">
          <div data-parallax className="absolute inset-0">
            <SignalField />
          </div>

          <div className="relative mx-auto max-w-5xl px-5 py-28 sm:px-8 sm:py-40">
            <Reveal group="hero">
              <p className="t-label text-accent">{t.hero.eyebrow}</p>
            </Reveal>

            {/* Signature: the headline reconciles rather than fading in. */}
            <div className="mt-7">
              <HeroReconcile text={t.hero.name} />
            </div>

            <Reveal group="hero">
              <p className="t-role mt-5 text-fg-muted">{t.hero.role}</p>
            </Reveal>
            <Reveal group="hero">
              <p className="t-lead measure mt-9 text-fg-muted">{t.hero.pitch}</p>
            </Reveal>
            <Reveal group="hero">
              {/* fg-muted rather than fg-dim: this line sits on the signal
                  field, where fg-dim measures 3.15:1 and fails. */}
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12.5px] text-fg-muted">
                <span>{t.hero.location}</span>
                <span aria-hidden="true" className="text-border-bright">
                  /
                </span>
                <span>{t.hero.languages}</span>
              </div>
            </Reveal>
            <Reveal group="hero">
              <div className="mt-12 flex flex-wrap gap-3">
                <a
                  href="#work"
                  data-magnetic
                  className="inline-flex min-h-[48px] cursor-pointer items-center rounded-chip bg-accent px-6 text-sm font-semibold text-on-accent shadow-e2 transition-[filter] duration-150 hover:brightness-110"
                >
                  {t.hero.ctaWork}
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-[48px] cursor-pointer items-center rounded-chip border border-control px-6 text-sm font-medium text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  {t.hero.ctaContact}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Proof ─────────────────────────────────────────── */}
        <section className="border-b border-hairline bg-bg-elevated/40">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-hairline sm:grid-cols-4">
            {t.stats.map((stat, i) => {
              const numeric = stat.value.match(/^([\d,]+)(\+)?$/);
              return (
                <Reveal key={i} group="stats" className="bg-bg px-5 py-8 sm:px-6">
                  <p className="tnum font-mono text-3xl font-semibold text-accent sm:text-4xl">
                    {numeric ? (
                      <>
                        <span data-countup={numeric[1].replace(/,/g, "")}>
                          {numeric[1]}
                        </span>
                        {numeric[2] ?? ""}
                      </>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mt-2.5 text-[12.5px] leading-snug text-fg-dim">
                    {stat.label}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── Work ──────────────────────────────────────────── */}
        <section id="work" className="scroll-mt-16 border-b border-hairline">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="t-h2 text-fg">{t.work.title}</h2>
            </Reveal>
            <Reveal>
              <p className="measure mt-5 text-[15px] leading-relaxed text-fg-muted">
                {t.work.note}
              </p>
            </Reveal>

            <div className="mt-14 flex flex-col gap-5">
              {t.projects.map((project, i) => (
                <Reveal key={project.id} group={`work-${Math.floor(i / 2)}`}>
                  <ProjectCard
                    project={project}
                    labels={{
                      roleLabel: t.work.roleLabel,
                      problemLabel: t.work.problemLabel,
                      builtLabel: t.work.builtLabel,
                      more: ui.more,
                      less: ui.less,
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How I build ───────────────────────────────────── */}
        <section
          id="how"
          className="grain relative scroll-mt-16 overflow-hidden border-b border-hairline bg-bg-elevated/30"
        >
          <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="t-h2 text-fg">{t.how.title}</h2>
            </Reveal>
            <Reveal>
              <p className="measure mt-5 text-[15px] leading-relaxed text-fg-muted">
                {t.how.note}
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              <Reveal group="how-top" className="lg:col-span-2">
                <SpotlightCard className="h-full">
                  <figure className="card-raised h-full p-5 sm:p-7">
                    <figcaption className="mb-7">
                      <h3 className="text-sm font-semibold text-fg">
                        {t.how.diagramTitle}
                      </h3>
                      <p className="measure mt-2.5 text-[13.5px] leading-relaxed text-fg-dim">
                        {t.how.diagramCaption}
                      </p>
                    </figcaption>
                    <Pipeline nodes={t.how.nodes} title={t.how.diagramTitle} />
                  </figure>
                </SpotlightCard>
              </Reveal>

              <Reveal group="how-top">
                <StreamLog lines={t.streamLog.lines} label={t.streamLog.label} />
              </Reveal>
            </div>

            {/* These three are simultaneous principles, not ordered steps,
                so they carry names rather than 01 / 02 / 03. */}
            <dl className="mt-14 divide-y divide-hairline border-t border-hairline">
              {t.how.principles.map((p, i) => (
                <Reveal key={i} group="how-principles">
                  <div className="rail-grid py-7">
                    <dt className="t-label pt-1 text-accent">{p.title}</dt>
                    <dd className="measure text-[15px] leading-relaxed text-fg-muted">
                      {p.body}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Stack ─────────────────────────────────────────── */}
        <section id="stack" className="scroll-mt-16 border-b border-hairline">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="t-h2 text-fg">{t.stack.title}</h2>
            </Reveal>
            <Reveal>
              <p className="measure mt-5 text-[15px] leading-relaxed text-fg-muted">
                {t.stack.note}
              </p>
            </Reveal>

            <dl className="mt-14 divide-y divide-hairline border-y border-hairline">
              {t.stack.groups.map((group) => (
                <Reveal key={group.label} group="stack-rows">
                  <div className="rail-grid py-5">
                    <dt className="t-label pt-1.5 text-fg-dim">{group.label}</dt>
                    <dd className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-chip border border-border bg-surface px-2.5 py-1 font-mono text-[12px] text-fg-muted"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────── */}
        <section id="contact" className="grain relative scroll-mt-16 overflow-hidden">
          <div
            aria-hidden="true"
            className="tech-grid pointer-events-none absolute inset-0 opacity-60"
          />
          <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <Reveal group="contact">
              <h2 className="t-h2 text-fg">{t.contact.title}</h2>
            </Reveal>
            <Reveal group="contact">
              <p className="t-lead measure-tight mt-5 text-fg-muted">
                {t.contact.body}
              </p>
            </Reveal>

            <Reveal group="contact">
              <div className="mt-11 flex flex-wrap gap-3">
                <a
                  href={`mailto:${t.contact.email}`}
                  data-magnetic
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-chip bg-accent px-6 text-sm font-semibold text-on-accent shadow-e2 transition-[filter] duration-150 hover:brightness-110"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 4.5h12v7H2z" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      d="m2.5 5 5.5 4 5.5-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t.contact.cta}
                </a>

                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-chip border border-control px-6 text-sm font-medium text-fg transition-colors duration-150 hover:border-accent hover:text-accent active:opacity-70"
                >
                  {copied ? ui.copied : ui.copy}
                </button>

                <a
                  href="https://github.com/carlosvalenciat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-chip border border-control px-6 text-sm font-medium text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                  {t.contact.github}
                </a>
              </div>
            </Reveal>

            <Reveal group="contact">
              <p className="mt-8 font-mono text-[13px] text-fg-dim" aria-live="polite">
                <a
                  href={`mailto:${t.contact.email}`}
                  className="inline-block rounded-chip py-1.5 transition-colors duration-150 hover:text-accent"
                >
                  {t.contact.email}
                </a>
                {copied && <span className="ml-3 text-accent">{ui.copied}</span>}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-[12.5px] text-fg-dim sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>{t.footer.built}</p>
          <a
            href="https://github.com/carlosvalenciat/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-chip py-1.5 transition-colors duration-150 hover:text-accent"
          >
            {t.footer.source} ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
