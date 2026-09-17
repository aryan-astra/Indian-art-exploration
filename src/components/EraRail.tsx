import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { eras, mediums, type Era, type Medium } from "../data/timeline";
import { cn } from "../utils/cn";

interface Props {
  activeEra: Era | null;
  onSelect: (era: Era) => void;
  filter: Medium | "All";
  onFilter: (m: Medium | "All") => void;
}

export function EraRail({ activeEra, onSelect, filter, onFilter }: Props) {
  const scroller = useRef<HTMLOListElement>(null);

  // Keep the active chip visible on small screens
  useEffect(() => {
    if (!activeEra || !scroller.current) return;
    const el = scroller.current.querySelector<HTMLElement>(`[data-era="${activeEra.id}"]`);
    if (!el) return;
    const parent = scroller.current;
    const left = el.offsetLeft - parent.clientWidth / 2 + el.clientWidth / 2;
    parent.scrollTo({ left, behavior: "smooth" });
  }, [activeEra]);

  return (
    <div className="sticky top-14 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-2 py-2 lg:flex-row lg:items-center lg:gap-10 lg:py-0">
          {/* ——— Era navigation ——— */}
          <nav aria-label="Eras" className="min-w-0 flex-1">
            {/* Desktop ruler */}
            <LayoutGroup id="rail">
              <ol className="relative hidden h-16 items-center lg:flex" role="list">
                <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
                {eras.map((era) => {
                  const isActive = activeEra?.id === era.id;
                  const isPast = activeEra ? era.index < activeEra.index : false;
                  return (
                    <li key={era.id} className="relative flex flex-1 justify-center">
                      <button
                        type="button"
                        onClick={() => onSelect(era)}
                        aria-current={isActive ? "true" : undefined}
                        aria-label={`${era.name}, ${era.range}`}
                        className="group relative flex h-16 w-full flex-col items-center justify-center focus-visible:outline-offset-[-4px]"
                        style={{ ["--era" as string]: era.color }}
                      >
                        <span
                          className={cn(
                            "caps absolute top-1.5 text-[0.6rem] transition-colors duration-300",
                            isActive ? "era-text" : "text-ink-3 group-hover:text-ink",
                          )}
                        >
                          {era.numeral}
                        </span>
                        <span className="relative flex h-3 w-3 items-center justify-center">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-all duration-500",
                              isActive
                                ? "scale-0"
                                : isPast
                                  ? "bg-ink"
                                  : "bg-line group-hover:bg-ink group-focus-visible:bg-ink",
                            )}
                          />
                          {isActive && (
                            <motion.span
                              layoutId="rail-dot"
                              transition={{ type: "spring", stiffness: 380, damping: 32 }}
                              className="absolute inset-0 rounded-full era-bg ring-4 ring-paper"
                            />
                          )}
                        </span>
                        <span
                          className={cn(
                            "pointer-events-none absolute bottom-1 max-w-[9rem] truncate font-display text-sm italic transition-all duration-300",
                            isActive
                              ? "translate-y-0 opacity-100"
                              : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                          )}
                        >
                          {era.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </LayoutGroup>

            {/* Mobile / tablet chips */}
            <ol
              ref={scroller}
              className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:hidden"
              role="list"
            >
              {eras.map((era) => {
                const isActive = activeEra?.id === era.id;
                return (
                  <li key={era.id} className="snap-center shrink-0">
                    <button
                      type="button"
                      data-era={era.id}
                      onClick={() => onSelect(era)}
                      aria-current={isActive ? "true" : undefined}
                      style={{ ["--era" as string]: era.color }}
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors duration-300",
                        isActive
                          ? "era-border era-bg text-paper"
                          : "border-line text-ink-2 hover:border-ink",
                      )}
                    >
                      <span className="caps text-[0.6rem] opacity-80">{era.numeral}</span>
                      <span className="font-medium">{era.name}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* ——— Medium filter ——— */}
          <div
            role="group"
            aria-label="Filter artifacts by medium"
            className="no-scrollbar -mx-5 flex shrink-0 items-center gap-1 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
          >
            <span className="caps mr-2 hidden text-ink-3 xl:inline">Medium</span>
            {(["All", ...mediums] as const).map((m) => {
              const on = filter === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onFilter(m)}
                  className={cn(
                    "relative whitespace-nowrap px-2.5 py-1 text-xs transition-colors duration-300",
                    on ? "text-ink" : "text-ink-3 hover:text-ink",
                  )}
                >
                  {m}
                  {on && (
                    <motion.span
                      layoutId="filter-underline"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      className="absolute inset-x-2.5 -bottom-0.5 h-px era-bg"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
