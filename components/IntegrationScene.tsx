"use client";

import { useEffect, useRef, useState } from "react";
import { siClaude, siN8n, siOdoo, siPostgresql, siWhatsapp, type SimpleIcon } from "simple-icons";
import type { Lang } from "@/lib/content";

const platforms: Array<{ icon: SimpleIcon; label: string; tone: string }> = [
  { icon: siWhatsapp, label: "WhatsApp", tone: "green" },
  { icon: siN8n, label: "n8n", tone: "amber" },
  { icon: siClaude, label: "Claude", tone: "violet" },
  { icon: siOdoo, label: "Odoo", tone: "cyan" },
  { icon: siPostgresql, label: "PostgreSQL", tone: "cyan" },
];

const code = `type PlantSignal = {
  deviceId: string
  shiftId: string
  units: number
}

const result = await reconcile({
  idempotencyKey: event.id,
  source: "machine",
  payload: signal,
})

if (!result.duplicate) {
  await erp.production.post(result.validated)
}`;

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={icon.title}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function CodeTerminal({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [characters, setCharacters] = useState(code.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setCharacters(0);
        let current = 0;
        const type = () => {
          current = Math.min(code.length, current + 3);
          setCharacters(current);
          if (current < code.length) timer = window.setTimeout(type, 18);
        };
        timer = window.setTimeout(type, 220);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="code-terminal">
      <div className="code-terminal__bar">
        <span>{lang === "en" ? "integration sketch / typed once" : "esquema de integración / una ejecución"}</span>
        <span className="code-terminal__status">● READY</span>
      </div>
      <pre aria-hidden="true">
        <code>{code.slice(0, characters)}</code>
        {characters < code.length && <span className="code-terminal__cursor" />}
      </pre>
      <span className="sr-only">{code}</span>
    </div>
  );
}

export default function IntegrationScene({ lang }: { lang: Lang }) {
  const copy = lang === "en"
    ? {
        eyebrow: "Integration fabric",
        title: "A conversation can become a verified business transaction.",
        body: "Platforms are useful when the handoff is explicit: intent becomes a tool call, the workflow validates state, and the ERP commits the result.",
      }
    : {
        eyebrow: "Tejido de integración",
        title: "Una conversación puede convertirse en una transacción verificada.",
        body: "Las plataformas son útiles cuando el relevo es explícito: la intención se vuelve una llamada de herramienta, el flujo valida el estado y el ERP confirma el resultado.",
      };

  return (
    <section className="integration-scene" aria-labelledby="integration-scene-title">
      <div className="integration-scene__copy">
        <p className="t-label text-accent">{copy.eyebrow}</p>
        <h3 id="integration-scene-title" className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-3xl">
          {copy.title}
        </h3>
        <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-fg-muted">{copy.body}</p>
        <div className="platform-flow" aria-label="WhatsApp, n8n, Claude, Odoo, PostgreSQL">
          {platforms.map(({ icon, label, tone }, index) => (
            <div className="platform-flow__step" key={label}>
              <div className={`platform-node platform-node--${tone}`}>
                <BrandIcon icon={icon} />
                <span>{label}</span>
              </div>
              {index < platforms.length - 1 && <span className="platform-flow__link"><i /></span>}
            </div>
          ))}
        </div>
      </div>

      <div className="integration-scene__terminal">
        <span className="agent-chip agent-chip--context">CONTEXT / 12</span>
        <span className="agent-chip agent-chip--tool">TOOL CALL / ERP</span>
        <span className="agent-chip agent-chip--verified">STATE / VERIFIED</span>
        <CodeTerminal lang={lang} />
      </div>
    </section>
  );
}
