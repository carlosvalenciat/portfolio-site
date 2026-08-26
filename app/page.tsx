"use client";

import { useEffect, useState } from "react";
import { dict, type Lang } from "@/lib/content";
import Reveal from "@/components/Reveal";
import Pipeline from "@/components/Pipeline";
import ProjectCard from "@/components/ProjectCard";

const CARD_LABELS = {
  en: { more: "Read the case study", less: "Close" },
  es: { more: "Leer el case study", less: "Cerrar" },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = dict[lang];

  // Restore the visitor's last choice. Storage can throw in private
  // windows or with site data blocked — fall back to English silently.
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

  const navItems = [
    { href: "#work", label: t.nav.work },
    { href: "#how", label: t.nav.how },
    { href: "#stack", label: t.nav.stack },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
      >
        {lang === "en" ? "Skip to content" : "Saltar al contenido"}
      </a>

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a
            href="#top"
            className="font-mono text-[13px] font-medium tracking-tight text-fg transition-colors hover:text-accent"
          >
            CV<span className="text-accent">.</span>
          </a>

          <div className="flex items-center gap-1 sm:gap-5">
            <ul className="hidden items-center gap-5 sm:flex">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[13.5px] text-fg-muted transition-colors duration-200 hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div
              className="flex items-center rounded-md border border-border bg-surface p-0.5"
              role="group"
              aria-label={lang === "en" ? "Language" : "Idioma"}
            >
              {(["en", "es"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`min-h-[36px] min-w-[44px] cursor-pointer rounded font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 ${
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
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="tech-grid grid-fade pointer-events-none absolute inset-0"
          />
          <div className="relative mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="rule-label text-accent">{t.hero.eyebrow}</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
                {t.hero.name}
              </h1>
              <p className="mt-3 font-mono text-sm text-fg-muted sm:text-base">
                {t.hero.role}
              </p>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
                {t.hero.pitch}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12.5px] text-fg-dim">
                <span>{t.hero.location}</span>
                <span aria-hidden="true" className="text-border-bright">
                  /
                </span>
                <span>{t.hero.languages}</span>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#work"
                  className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md bg-accent px-5 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-90"
                >
                  {t.hero.ctaWork}
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md border border-border-bright px-5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent-dim hover:text-accent"
                >
                  {t.hero.ctaContact}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────── */}
        <section className="border-b border-border bg-surface/40">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px bg-border px-0 sm:grid-cols-4">
            {t.stats.map((stat, i) => (
              <div key={i} className="bg-bg px-5 py-7 sm:px-6">
                <Reveal delay={i * 70}>
                  <p className="font-mono text-2xl font-semibold text-accent sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-snug text-fg-dim">
                    {stat.label}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </section>

        {/* ── Work ────────────────────────────────────────── */}
        <section id="work" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {t.work.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                {t.work.note}
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {t.projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 2) * 80}>
                  <ProjectCard
                    project={project}
                    labels={{
                      roleLabel: t.work.roleLabel,
                      problemLabel: t.work.problemLabel,
                      builtLabel: t.work.builtLabel,
                      ...CARD_LABELS[lang],
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How I build ─────────────────────────────────── */}
        <section id="how" className="scroll-mt-16 border-b border-border bg-surface/30">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {t.how.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                {t.how.note}
              </p>
            </Reveal>

            <Reveal>
              <figure className="mt-12 rounded-xl border border-border bg-bg p-5 sm:p-7">
                <figcaption className="mb-6">
                  <h3 className="text-sm font-semibold text-fg">
                    {t.how.diagramTitle}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-fg-dim">
                    {t.how.diagramCaption}
                  </p>
                </figcaption>
                <Pipeline nodes={t.how.nodes} title={t.how.diagramTitle} />
              </figure>
            </Reveal>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {t.how.principles.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="h-full rounded-xl border border-border bg-bg p-6">
                    <p className="font-mono text-[11px] text-accent-dim">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-[15px] font-semibold text-fg">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-fg-muted">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stack ───────────────────────────────────────── */}
        <section id="stack" className="scroll-mt-16 border-b border-border">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {t.stack.title}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                {t.stack.note}
              </p>
            </Reveal>

            <dl className="mt-12 divide-y divide-border border-y border-border">
              {t.stack.groups.map((group, i) => (
                <Reveal key={group.label} delay={i * 50}>
                  <div className="grid gap-3 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                    <dt className="rule-label pt-1 text-fg-dim">
                      {group.label}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-[12px] text-fg-muted"
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

        {/* ── Contact ─────────────────────────────────────── */}
        <section id="contact" className="scroll-mt-16">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {t.contact.title}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted">
                {t.contact.body}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={`mailto:${t.contact.email}`}
                  className="inline-flex min-h-[44px] cursor-pointer items-center rounded-md bg-accent px-5 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-90"
                >
                  {t.contact.cta}
                </a>
                <a
                  href="https://github.com/carlosvalenciat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-md border border-border-bright px-5 text-sm font-medium text-fg transition-colors duration-200 hover:border-accent-dim hover:text-accent"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                  </svg>
                  {t.contact.github}
                </a>
              </div>

              <p className="mt-7 font-mono text-[13px] text-fg-dim">
                <a
                  href={`mailto:${t.contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {t.contact.email}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 text-[12.5px] text-fg-dim sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>{t.footer.built}</p>
          <a
            href="https://github.com/carlosvalenciat/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            {t.footer.source} ↗
          </a>
        </div>
      </footer>
    </>
  );
}
