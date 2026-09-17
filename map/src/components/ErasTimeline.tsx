import { useEffect, useRef } from "react";
import { gsap } from "../lib/anim";
import { useReducedMotion } from "../lib/motion";
import { PERIODS, type PeriodId } from "../data/model";
import { LOCATIONS } from "../data/locations";

interface Props {
  onPickEra: (p: PeriodId) => void;
}

export function ErasTimeline({ onPickEra }: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    // pinned horizontal scroll only when motion is welcome and the viewport is wide
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      const x = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      const bar = gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
          },
        }
      );
      return () => {
        x.scrollTrigger?.kill();
        bar.scrollTrigger?.kill();
      };
    });
    // card reveals for all modes
    const reveal = gsap.utils.toArray<HTMLElement>(".era-card").length
      ? gsap.fromTo(
          ".era-card",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: trackRef.current, start: "top 85%", once: true },
          }
        )
      : null;
    return () => {
      reveal?.kill();
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="eras" className="relative overflow-hidden border-b border-hairline bg-parchment scroll-mt-4">
      <div className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 md:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label-caps text-terracotta">02 · Through the ages</p>
            <h2 className="mt-3 max-w-[22ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-medium">
              Seven periods, one subcontinent.
            </h2>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-ink-soft">
            Each period is a lens on the atlas. Choose one and the map reorganises around it — the markers you keep
            are the ones that belonged.
          </p>
        </div>
      </div>

      <div
        className={`thin-scroll mt-10 overflow-x-auto pb-14 md:mt-16 md:pb-24 ${
          reduced ? "" : "md:overflow-x-visible"
        }`}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 px-5 sm:px-8 md:px-[max(2rem,calc((100vw-1400px)/2+2rem))]"
        >
          {PERIODS.map((p, i) => {
            const inPeriod = LOCATIONS.filter((l) => l.periods.includes(p.id));
            const names = inPeriod.slice(0, 3).map((l) => l.name);
            return (
              <button
                key={p.id}
                onClick={() => onPickEra(p.id)}
                className="era-card group relative flex w-[300px] shrink-0 flex-col border border-hairline bg-parchment px-7 py-8 text-left transition-colors duration-300 hover:border-ink/50 sm:w-[400px] md:w-[440px]"
              >
                <span className="absolute top-0 left-0 h-[3px] w-14" style={{ background: p.color }} aria-hidden="true" />
                <span className="absolute top-6 right-7 font-display text-[64px] leading-none font-medium text-ink/[0.06] select-none" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="label-caps text-ink-faint">0{i + 1}</span>
                  <span className="text-[11px] font-bold text-ink-faint">{p.range}</span>
                </div>
                <h3 className="mt-4 font-display text-[34px] leading-none font-medium" style={{ color: p.id === "contemporary" ? undefined : p.color }}>
                  {p.label}
                </h3>
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{p.blurb}</p>
                <div className="mt-6 border-t border-hairline pt-4">
                  <p className="label-caps text-ink-faint">
                    {inPeriod.length} {inPeriod.length === 1 ? "site" : "sites"} in the atlas
                  </p>
                  <p className="mt-2 text-[12px] font-medium text-ink-soft">{names.join(" · ")}</p>
                </div>
                <span className="label-caps mt-5 text-terracotta opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View on map →
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-hairline" aria-hidden="true">
        <div
          ref={barRef}
          className="h-full w-full bg-terracotta"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
      </div>
    </section>
  );
}
