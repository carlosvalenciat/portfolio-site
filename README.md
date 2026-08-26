# cvalenciat.dev

Personal portfolio site — [cvalenciat.dev](https://cvalenciat.dev)

Bilingual (EN/ES) single-page portfolio for **Carlos Valencia**, AI & Automation Engineer.
Nine case studies covering AI agents, workflow automation, ERP development and system
integration.

## Stack

- **Next.js 15** (App Router, static export of a single prerendered route)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** — CSS-first theming via `@theme` tokens
- **Vercel** — deployed on every push to `main`

## Design notes

- Dark, technical direction. Design tokens live in `app/globals.css`; nothing is a raw hex
  value in a component.
- Bilingual content is a single typed dictionary in `lib/content.ts` — both languages are
  structurally identical, so a missing translation is a type error rather than a silent
  fallback to English.
- Language choice persists in `localStorage`, wrapped in `try/catch` so private windows and
  blocked site data degrade to the default instead of throwing.
- The pipeline diagram (`components/Pipeline.tsx`) is inline SVG with a `<title>`/`<desc>`
  pair, and scrolls horizontally inside its own container rather than forcing the page to.
- Accessibility: visible focus rings are never removed, interactive controls meet the 44px
  touch target, and `prefers-reduced-motion` collapses every reveal to its final readable
  state.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000

```bash
npm run build
```

## Content

Case study write-ups also live at
[github.com/carlosvalenciat/portfolio](https://github.com/carlosvalenciat/portfolio).
Source code for the employer and client projects described on this site is proprietary and is
not published in either repository.
