"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/content";

export type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

type Copy = {
  title: string;
  placeholder: string;
  empty: string;
  open: string;
};

/**
 * Keyboard-first navigation.
 *
 * A command palette suits this page because the register is a technical
 * instrument, and because it collapses three separate controls — section
 * nav, language switch and copy-contact — into one surface a keyboard user
 * can reach without tabbing through the document.
 *
 * No entrance animation: the motion budget is spent elsewhere, and a
 * palette that animates in is a palette that feels slower than it is.
 */
export default function CommandPalette({
  commands,
  copy,
  lang,
}: {
  commands: Command[];
  copy: Copy;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        (c.hint ?? "").toLowerCase().includes(q),
    );
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    restoreTo.current?.focus();
  }, []);

  const openPalette = useCallback(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  // Global shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open ? close() : openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, openPalette]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[index];
      if (cmd) {
        cmd.run();
        close();
      }
      return;
    }
    // Keep focus inside the dialog.
    if (e.key === "Tab") e.preventDefault();
  };

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        className="hidden min-h-[36px] cursor-pointer items-center gap-2 rounded-chip border border-control px-3 font-mono text-[11px] text-fg-dim transition-colors duration-150 hover:border-accent hover:text-accent md:inline-flex"
      >
        {copy.open}
        <kbd className="rounded-[4px] border border-hairline bg-surface-2 px-1.5 py-0.5 text-[10px] text-fg-muted">
          {lang === "en" ? "⌘K" : "⌘K"}
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          onKeyDown={onKeyDown}
        >
          <div
            className="veil absolute inset-0"
            onClick={close}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="card-raised relative w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4">
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                ›
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.title}
                aria-controls="cmdk-list"
                aria-activedescendant={
                  results[index] ? `cmdk-${results[index].id}` : undefined
                }
                className="min-h-[52px] w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-fg-dim"
              />
            </div>

            <ul
              id="cmdk-list"
              ref={listRef}
              role="listbox"
              aria-label={copy.title}
              className="max-h-[46vh] overflow-y-auto p-1.5"
            >
              {results.length === 0 && (
                <li className="px-3 py-4 font-mono text-[12px] text-fg-dim">
                  {copy.empty}
                </li>
              )}

              {results.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    id={`cmdk-${cmd.id}`}
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => {
                      cmd.run();
                      close();
                    }}
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-4 rounded-chip px-3 text-left text-sm transition-colors duration-150 ${
                      i === index
                        ? "bg-surface-2 text-fg"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    <span>{cmd.label}</span>
                    {cmd.hint && (
                      <span className="font-mono text-[11px] text-fg-dim">
                        {cmd.hint}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
