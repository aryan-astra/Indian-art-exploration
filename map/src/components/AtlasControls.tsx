import { SearchBox } from "./SearchBox";
import {
  PERIODS,
  ART_FORMS,
  type Filters,
  type ArtLocation,
  type PeriodId,
  type ArtForm,
  type Region,
} from "../data/model";
import { REGIONS_PRESENT } from "../data/locations";

interface Props {
  filters: Filters;
  onFilters: (f: Filters) => void;
  visibleCount: number;
  total: number;
  onReset: () => void;
  onPickLocation: (loc: ArtLocation) => void;
}

function Chip({
  active,
  onClick,
  children,
  dot,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors duration-200 ${
        active
          ? "border-ink bg-ink text-parchment"
          : "border-hairline bg-parchment text-ink-soft hover:border-ink/40 hover:text-ink"
      }`}
    >
      {dot && (
        <span className="h-2 w-2 rounded-full" style={{ background: dot }} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export function AtlasControls({ filters, onFilters, visibleCount, total, onReset, onPickLocation }: Props) {
  const dirty = filters.period !== null || filters.artForm !== null || filters.region !== null;

  return (
    <div className="mt-8 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBox onPick={onPickLocation} className="lg:w-[310px] lg:shrink-0" />
        <div
          className="thin-scroll -mx-1 flex flex-1 items-center gap-1.5 overflow-x-auto px-1 py-0.5"
          role="group"
          aria-label="Filter by historical period"
        >
          <Chip active={filters.period === null} onClick={() => onFilters({ ...filters, period: null })}>
            All periods
          </Chip>
          {PERIODS.map((p) => (
            <Chip
              key={p.id}
              active={filters.period === p.id}
              dot={p.color}
              label={`Period: ${p.label}, ${p.range}`}
              onClick={() => onFilters({ ...filters, period: (filters.period === p.id ? null : p.id) as PeriodId | null })}
            >
              {p.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div
          className="thin-scroll -mx-1 flex flex-1 items-center gap-1.5 overflow-x-auto px-1 py-0.5"
          role="group"
          aria-label="Filter by art form"
        >
          <Chip active={filters.artForm === null} onClick={() => onFilters({ ...filters, artForm: null })}>
            All art forms
          </Chip>
          {ART_FORMS.map((a) => (
            <Chip
              key={a}
              active={filters.artForm === a}
              onClick={() => onFilters({ ...filters, artForm: (filters.artForm === a ? null : a) as ArtForm | null })}
            >
              {a}
            </Chip>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <select
              value={filters.region ?? ""}
              onChange={(e) =>
                onFilters({ ...filters, region: (e.target.value || null) as Region | null })
              }
              aria-label="Filter by region"
              className="h-[38px] cursor-pointer appearance-none rounded-full border border-hairline bg-parchment pr-9 pl-4 text-[12px] font-semibold text-ink-soft transition-colors focus:border-ink/50 focus:outline-none hover:border-ink/40"
            >
              <option value="">All regions</option>
              {REGIONS_PRESENT.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-faint"
              width="9"
              height="6"
              viewBox="0 0 9 6"
              fill="none"
              aria-hidden="true"
            >
              <path d="m1 1 3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <span className="label-caps shrink-0 text-ink-faint" aria-live="polite">
            {visibleCount} of {total} sites
          </span>
          <button
            onClick={onReset}
            className={`label-caps flex shrink-0 items-center gap-1.5 border px-3.5 py-2.5 transition-colors ${
              dirty
                ? "border-hairline-strong text-ink hover:border-ink hover:bg-ink hover:text-parchment"
                : "border-hairline text-ink-faint hover:border-ink/40 hover:text-ink"
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M10.5 6a4.5 4.5 0 1 1-1.3-3.2M9.5 0.8v2.4H7.1"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
