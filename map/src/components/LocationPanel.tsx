import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/anim";
import { PERIOD_META, formatCoords, type ArtLocation } from "../data/model";

interface Props {
  location: ArtLocation;
  mode: "side" | "sheet";
  onClose: () => void;
  onNavigate: (id: string) => void;
  reducedMotion: boolean;
  allLocations: ArtLocation[];
  totalPlates: number;
}

function Plate({ loc }: { loc: ArtLocation }) {
  const color = PERIOD_META[loc.periods[0]].color;
  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-4"
      style={{
        background: `linear-gradient(150deg, ${color}1f, transparent 60%), var(--color-parchment-deeper)`,
      }}
    >
      <span className="label-caps text-ink-faint">Index plate</span>
      <div>
        <span className="font-display text-5xl leading-none font-medium" style={{ color }}>
          {String(loc.plate).padStart(2, "0")}
        </span>
        <p className="mt-2 text-[10.5px] font-semibold text-ink-faint">{formatCoords(loc.lat, loc.lon)}</p>
      </div>
    </div>
  );
}

export function LocationPanel({ location, mode, onClose, onNavigate, reducedMotion, allLocations, totalPlates }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const dragState = useRef<{ startY: number; dy: number } | null>(null);
  const firstRender = useRef(true);

  const related = allLocations
    .filter((l) => l.id !== location.id && l.periods.some((p) => location.periods.includes(p)))
    .sort((a, b) => (b.region === location.region ? 1 : 0) - (a.region === location.region ? 1 : 0))
    .slice(0, 3);

  // entry animation
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      if (mode === "side") {
        gsap.fromTo(el, { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" });
      } else {
        gsap.fromTo(el, { y: "104%" }, { y: 0, duration: 0.55, ease: "power3.out" });
      }
      gsap.fromTo(
        el.querySelectorAll(".panel-item"),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.05, delay: 0.2 }
      );
    }, rootRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // content switch when navigating between sites
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setImgFailed(false);
    setImgLoaded(false);
    const el = contentRef.current;
    if (!el || reducedMotion) return;
    gsap.fromTo(el, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
  }, [location.id, reducedMotion]);

  const close = () => {
    const el = rootRef.current;
    if (!el || reducedMotion) {
      onClose();
      return;
    }
    if (mode === "side") {
      gsap.to(el, { x: 40, autoAlpha: 0, duration: 0.38, ease: "power3.in", onComplete: onClose });
    } else {
      gsap.to(el, { y: "104%", duration: 0.42, ease: "power3.in", onComplete: onClose });
    }
  };

  // sheet drag-to-dismiss
  const onHandleDown = (e: React.PointerEvent) => {
    if (mode !== "sheet") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { startY: e.clientY, dy: 0 };
    gsap.killTweensOf(rootRef.current, "y");
  };
  const onHandleMove = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d || !rootRef.current) return;
    const dy = Math.max(0, e.clientY - d.startY);
    d.dy = dy;
    gsap.set(rootRef.current, { y: dy });
  };
  const onHandleUp = () => {
    const d = dragState.current;
    if (!d || !rootRef.current) return;
    dragState.current = null;
    if (d.dy > 110) close();
    else gsap.to(rootRef.current, { y: 0, duration: 0.4, ease: "power3.out" });
  };

  const color = PERIOD_META[location.periods[0]].color;

  return (
    <aside
      ref={rootRef}
      role="dialog"
      aria-label={`Details for ${location.name}`}
      className={
        mode === "side"
          ? "absolute top-4 right-4 bottom-4 z-20 w-[min(400px,44vw)]"
          : "fixed inset-x-0 bottom-0 z-40 max-h-[86svh] px-0"
      }
    >
      <div
        className={`flex h-full flex-col overflow-hidden border border-hairline-strong/70 bg-parchment shadow-panel ${
          mode === "sheet" ? "rounded-t-xl border-x-0 border-b-0" : "rounded-lg"
        }`}
      >
        {mode === "sheet" && (
          <div
            className="flex cursor-grab touch-none items-center justify-center py-2.5 pb-1 active:cursor-grabbing"
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            aria-hidden="true"
          >
            <div className="h-1 w-11 rounded-full bg-ink/25" />
          </div>
        )}
        <div ref={contentRef} className="thin-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
          <header className="flex items-start justify-between gap-3 px-5 pt-4 sm:px-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                {location.periods.map((p) => (
                  <span key={p} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
                    <span className="label-caps text-ink-soft">{PERIOD_META[p].label}</span>
                  </span>
                ))}
                <span className="text-[11px] font-semibold text-ink-faint">{location.dates}</span>
              </div>
              <h3 className="panel-item mt-2.5 font-display text-[26px] leading-[1.08] font-medium">{location.name}</h3>
              <p className="panel-item label-caps mt-2 text-ink-faint">
                {location.state} · {location.region} · {formatCoords(location.lat, location.lon)}
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Close details"
              className="mt-1 shrink-0 rounded-full border border-hairline p-2 text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <figure className="panel-item mt-4 px-5 sm:px-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-hairline bg-parchment-deeper">
              {location.image && !imgFailed ? (
                <img
                  src={location.image.src}
                  alt={location.image.alt}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                  onLoad={() => setImgLoaded(true)}
                  className={`h-full w-full object-cover transition-opacity duration-700 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <Plate loc={location} />
              )}
            </div>
            {location.image && !imgFailed && (
              <figcaption className="mt-2 text-[10.5px] font-medium text-ink-faint">
                {location.image.alt}. Photograph: {location.image.credit}.
              </figcaption>
            )}
          </figure>

          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="panel-item">
              <h4 className="label-caps text-terracotta">Why it matters</h4>
              <p className="mt-1.5 text-[14px] leading-relaxed font-semibold">{location.significance}</p>
            </div>

            <p className="panel-item text-[13.5px] leading-relaxed text-ink-soft">{location.description}</p>

            <div className="panel-item">
              <h4 className="label-caps text-ink-faint">Art forms</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {location.artForms.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-hairline px-3 py-1.5 text-[11.5px] font-semibold text-ink-soft"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="panel-item grid gap-5 sm:grid-cols-2">
              <div>
                <h4 className="label-caps text-ink-faint">Key sites</h4>
                <ul className="mt-2.5 space-y-2">
                  {location.sites.map((s) => (
                    <li key={s} className="flex gap-2.5 text-[12.5px] leading-snug font-medium text-ink-soft">
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: color }} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="label-caps text-ink-faint">Artists &amp; traditions</h4>
                <ul className="mt-2.5 space-y-2">
                  {location.traditions.map((s) => (
                    <li key={s} className="flex gap-2.5 text-[12.5px] leading-snug font-medium text-ink-soft">
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {related.length > 0 && (
              <div className="panel-item border-t border-hairline pt-4">
                <h4 className="label-caps text-ink-faint">More from this period</h4>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onNavigate(r.id)}
                      className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[11.5px] font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: PERIOD_META[r.periods[0]].color }}
                        aria-hidden="true"
                      />
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <footer className="border-t border-hairline pt-3.5">
              <p className="text-[10.5px] leading-relaxed font-medium text-ink-faint">{location.source}</p>
              <p className="label-caps mt-2 text-ink-faint">
                Plate {String(location.plate).padStart(2, "0")} / {totalPlates}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </aside>
  );
}
