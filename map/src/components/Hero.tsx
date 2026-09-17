import { useEffect, useRef } from "react";
import { gsap } from "../lib/anim";
import { useReducedMotion } from "../lib/motion";
import { LOCATIONS } from "../data/locations";
import { PERIODS, ART_FORMS } from "../data/model";

const STATS: [number, string][] = [
  [LOCATIONS.length, "Sites"],
  [PERIODS.length, "Periods"],
  [ART_FORMS.length, "Art forms"],
];

export function Hero({ onExplore }: { onExplore: () => void }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.13, delay: 0.2 }
      );
      gsap.fromTo(
        ".hero-fade",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 }
      );
      gsap.fromTo(
        ".hero-drop",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "top center",
          delay: 1.1,
        }
      );
      gsap.to(".hero-inner", {
        y: 70,
        autoAlpha: 0.2,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <header ref={rootRef} className="relative flex min-h-[92svh] flex-col overflow-hidden">
      {/* faint cartographic grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-[22%] w-px bg-hairline/70" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-hairline/50" />
        <div className="absolute inset-y-0 left-[78%] w-px bg-hairline/70" />
        <div className="absolute inset-x-0 top-[62%] h-px bg-hairline/50" />
      </div>

      <div className="relative z-10 flex h-16 items-center justify-between border-b border-hairline px-5 sm:px-8">
        <a href="#top" className="font-display text-[18px] font-semibold tracking-[0.22em]">
          SANGRAHA
        </a>
        <div className="flex items-center gap-5">
          <a
            href="/"
            className="label-caps text-ink-soft transition-colors duration-300 hover:text-ink"
          >
            Home
          </a>
          <span className="label-caps hidden text-ink-soft sm:block">Interactive atlas · Indian art</span>
          <button
            onClick={onExplore}
            className="label-caps flex items-center gap-2 border border-hairline-strong px-4 py-2.5 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-parchment"
          >
            Explore the map
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v9M2.5 6.5 6 10l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="hero-inner relative z-10 flex flex-1 flex-col justify-center px-5 py-14 sm:px-8">
        <p className="label-caps hero-fade mb-7 text-terracotta">An interactive atlas · c. 3000 BCE — today</p>
        <h1 className="max-w-[16ch] font-display text-[clamp(2.9rem,8.4vw,7.2rem)] font-medium leading-[0.98] tracking-[-0.015em]">
          <span className="block overflow-hidden pb-1">
            <span className="hero-line block">India, mapped</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-line block">
              through <em className="italic text-terracotta">art.</em>
            </span>
          </span>
        </h1>

        <div className="mt-12 flex max-w-3xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-[15px] leading-relaxed text-ink-soft">
            Thirty-two places that made the subcontinent's artistic memory — caves, courts, ateliers and
            living craft towns. Pan the map, follow an era, open a site, and see why that ground mattered.
          </p>
          <div className="hero-fade flex gap-9">
            {STATS.map(([n, label]) => (
              <div key={label}>
                <span className="font-display text-[30px] leading-none font-medium">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="label-caps mt-2 block text-ink-faint">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-14 items-center justify-between border-t border-hairline px-5 sm:px-8">
        <span className="label-caps hero-fade text-ink-faint">Scroll to explore</span>
        <div className="hero-drop h-7 w-px bg-terracotta" aria-hidden="true" />
        <span className="label-caps hero-fade hidden text-ink-faint sm:block">
          32°00′ N — 8°00′ N · 68°00′ E — 97°00′ E
        </span>
      </div>
    </header>
  );
}
