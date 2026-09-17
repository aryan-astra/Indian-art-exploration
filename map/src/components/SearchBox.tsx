import { useMemo, useRef, useState } from "react";
import { LOCATIONS } from "../data/locations";
import { PERIOD_META, type ArtLocation } from "../data/model";

interface Props {
  onPick: (loc: ArtLocation) => void;
  className?: string;
}

export function SearchBox({ onPick, className }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return LOCATIONS.map((l) => {
      const name = l.name.toLowerCase();
      let score = -1;
      if (name.startsWith(t)) score = 0;
      else if (name.includes(t)) score = 1;
      else if (l.state.toLowerCase().includes(t)) score = 2;
      else if (l.periods.some((p) => PERIOD_META[p].label.toLowerCase().includes(t))) score = 3;
      else if (l.artForms.some((a) => a.toLowerCase().includes(t))) score = 4;
      return { l, score };
    })
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score || a.l.name.localeCompare(b.l.name))
      .slice(0, 7)
      .map((r) => r.l);
  }, [q]);

  const pick = (loc: ArtLocation) => {
    onPick(loc);
    setQ(loc.name);
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter") && results.length) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && results[active]) pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="4.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="m9.4 9.4 3.1 3.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        id="atlas-search"
        type="text"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="atlas-search-list"
        aria-autocomplete="list"
        aria-label="Search locations, art forms or periods"
        placeholder="Search a place, art form or period…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
          window.clearTimeout(closeTimer.current);
        }}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (q.trim()) setOpen(true);
        }}
        onBlur={() => {
          closeTimer.current = window.setTimeout(() => setOpen(false), 140);
        }}
        className="h-11 w-full rounded-full border border-hairline bg-parchment pr-10 pl-11 text-[13px] font-medium text-ink transition-colors placeholder:text-ink-faint focus:border-ink/50 focus:outline-none"
      />
      {q && (
        <button
          onClick={() => {
            setQ("");
            setOpen(false);
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-faint transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {open && results.length > 0 && (
        <ul
          id="atlas-search-list"
          role="listbox"
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 overflow-hidden rounded-md border border-hairline-strong/70 bg-parchment shadow-panel"
        >
          {results.map((l, i) => (
            <li key={l.id} role="option" aria-selected={i === active}>
              <button
                onClick={() => pick(l)}
                onPointerEnter={() => setActive(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-parchment-deep" : ""
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: PERIOD_META[l.periods[0]].color }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold">{l.name}</span>
                  <span className="block truncate text-[11px] text-ink-soft">
                    {l.state} · {PERIOD_META[l.periods[0]].label} · {l.artForms[0]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
