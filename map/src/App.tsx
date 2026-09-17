import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "./lib/anim";
import { useDesktop, useReducedMotion } from "./lib/motion";
import { LOCATIONS, LOCATION_BY_ID } from "./data/locations";
import {
  EMPTY_FILTERS,
  PERIOD_META,
  type ArtLocation,
  type Filters,
  type PeriodId,
} from "./data/model";
import { Hero } from "./components/Hero";
import { AtlasControls } from "./components/AtlasControls";
import { IndiaMap, type IndiaMapHandle } from "./components/IndiaMap";
import { LocationPanel } from "./components/LocationPanel";
import { MapLegend } from "./components/MapLegend";
import { ErasTimeline } from "./components/ErasTimeline";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export default function App() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<IndiaMapHandle | null>(null);
  const atlasRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const desktop = useDesktop();
  const panelMode: "side" | "sheet" = desktop ? "side" : "sheet";

  const visibleLocations = useMemo(
    () =>
      LOCATIONS.filter(
        (l) =>
          (!filters.period || l.periods.includes(filters.period)) &&
          (!filters.artForm || l.artForms.includes(filters.artForm)) &&
          (!filters.region || l.region === filters.region)
      ),
    [filters]
  );
  const visibleIds = useMemo(() => new Set(visibleLocations.map((l) => l.id)), [visibleLocations]);
  const selected = selectedId ? LOCATION_BY_ID[selectedId] : null;

  // if the selected site is filtered out, close the panel
  useEffect(() => {
    if (selectedId && !visibleIds.has(selectedId)) setSelectedId(null);
  }, [visibleIds, selectedId]);

  const scrollToAtlas = useCallback(() => {
    atlasRef.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion]);

  const pick = useCallback((id: string) => {
    setSelectedId(id);
    mapRef.current?.flyTo(id);
  }, []);

  const pickFromSearch = useCallback(
    (loc: ArtLocation) => {
      // if the picked site is hidden by the active filters, clear them so
      // the selected marker is always visible on the map
      setFilters((f) => {
        const excluded =
          (f.period && !loc.periods.includes(f.period)) ||
          (f.artForm && !loc.artForms.includes(f.artForm)) ||
          (f.region && loc.region !== f.region);
        return excluded ? EMPTY_FILTERS : f;
      });
      pick(loc.id);
      scrollToAtlas();
    },
    [pick, scrollToAtlas]
  );

  const onPickEra = useCallback(
    (p: PeriodId) => {
      setFilters((f) => ({ ...f, period: f.period === p ? null : p }));
      scrollToAtlas();
    },
    [scrollToAtlas]
  );

  const onReset = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setSelectedId(null);
    mapRef.current?.resetView();
  }, []);

  // Esc closes the panel; "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        document.getElementById("atlas-search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // refresh scroll measurements once fonts settle
  useEffect(() => {
    let alive = true;
    document.fonts?.ready
      .then(() => {
        if (alive) ScrollTrigger.refresh();
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const periodLabel = filters.period
    ? `${PERIOD_META[filters.period].label} · ${PERIOD_META[filters.period].range}`
    : "All periods";

  return (
    <div id="top" className="relative min-h-screen overflow-x-clip">
      <Hero onExplore={scrollToAtlas} />

      <main>
        <section
          ref={atlasRef}
          id="atlas"
          className="relative scroll-mt-2 border-y border-hairline bg-parchment-deep"
          aria-label="Interactive atlas"
        >
          <div className="mx-auto max-w-[1400px] px-5 pt-10 sm:px-8 md:pt-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="label-caps text-terracotta">01 · The interactive atlas</p>
                <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.04] font-medium">
                  Where art happened.
                </h2>
                <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-ink-soft">
                  Thirty-two sites across seven periods. Pan and zoom the map, filter by period, art form or region,
                  or search for a place, a craft or a century — then open a marker to see why that ground mattered.
                </p>
              </div>
              <div className="hidden flex-col items-end gap-1.5 text-right md:flex" aria-live="polite">
                <span className="label-caps text-ink-faint">Now viewing</span>
                <span className="font-display text-[19px] leading-tight font-medium">
                  {periodLabel} <span className="text-ink-faint">· {visibleLocations.length} sites</span>
                </span>
              </div>
            </div>

            <AtlasControls
              filters={filters}
              onFilters={setFilters}
              visibleCount={visibleLocations.length}
              total={LOCATIONS.length}
              onReset={onReset}
              onPickLocation={pickFromSearch}
            />
          </div>

          <div className="mx-auto max-w-[1400px] px-5 pt-5 pb-5 sm:px-8 md:pb-8">
            <div className="relative h-[60vh] min-h-[430px] overflow-hidden rounded-md border border-hairline-strong/60 bg-parchment-deeper/70 sm:h-[64vh] md:h-[76vh] md:max-h-[860px]">
              <IndiaMap
                ref={mapRef}
                locations={LOCATIONS}
                visibleIds={visibleIds}
                selectedId={selectedId}
                onSelect={(id) => (id ? pick(id) : setSelectedId(null))}
                panelSide={desktop}
                reducedMotion={reducedMotion}
              />
              {selected && panelMode === "side" && (
                <LocationPanel
                  location={selected}
                  mode="side"
                  onClose={() => setSelectedId(null)}
                  onNavigate={pick}
                  reducedMotion={reducedMotion}
                  allLocations={LOCATIONS}
                  totalPlates={LOCATIONS.length}
                />
              )}
              <div className="absolute top-4 left-4 z-10 hidden rounded-md border border-hairline-strong/60 bg-parchment/95 px-3.5 py-2.5 shadow-panel lg:block">
                <MapLegend />
              </div>
            </div>
            <div className="thin-scroll mt-3 overflow-x-auto lg:hidden">
              <div className="w-max px-1 pb-1">
                <MapLegend />
              </div>
            </div>
          </div>
        </section>

        <ErasTimeline onPickEra={onPickEra} />
        <AboutSection />
      </main>

      <Footer onNavigateAtlas={scrollToAtlas} />

      {selected && panelMode === "sheet" && (
        <>
          <div
            className="fixed inset-0 z-30 bg-ink/40"
            onClick={() => setSelectedId(null)}
            aria-hidden="true"
          />
          <LocationPanel
            location={selected}
            mode="sheet"
            onClose={() => setSelectedId(null)}
            onNavigate={pick}
            reducedMotion={reducedMotion}
            allLocations={LOCATIONS}
            totalPlates={LOCATIONS.length}
          />
        </>
      )}

      {/* film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[70] opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
        aria-hidden="true"
      />
    </div>
  );
}
