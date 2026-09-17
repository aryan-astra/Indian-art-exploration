import { useEffect, useRef } from "react";
import { gsap } from "../lib/anim";
import { LOCATIONS } from "../data/locations";

export function Footer({ onNavigateAtlas }: { onNavigateAtlas: () => void }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".foot-item",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={ref} className="bg-parchment">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-16">
          <div className="foot-item">
            <p className="font-display text-[20px] font-semibold tracking-[0.22em]">SANGRAHA</p>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink-soft">
              An interactive atlas of Indian art history — {LOCATIONS.length} sites, seven periods, eight art forms.
            </p>
          </div>
          <nav className="foot-item" aria-label="Footer">
            <p className="label-caps text-ink-faint">Navigate</p>
            <ul className="mt-3 space-y-2">
              <li>
                <button onClick={onNavigateAtlas} className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink">
                  01 · The interactive atlas
                </button>
              </li>
              <li>
                <a href="#eras" className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink">
                  02 · Through the ages
                </a>
              </li>
              <li>
                <a href="#about" className="text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink">
                  03 · About the atlas
                </a>
              </li>
            </ul>
          </nav>
          <div className="foot-item">
            <p className="label-caps text-ink-faint">Colophon</p>
            <ul className="mt-3 space-y-2 text-[13px] font-medium text-ink-soft">
              <li>Set in Fraunces &amp; Manrope</li>
              <li>Map geometry: official India GIS</li>
              <li>Photography: Pexels contributors</li>
            </ul>
          </div>
        </div>
        <div className="foot-item mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-6">
          <p className="label-caps text-ink-faint">A design study in cultural cartography · MMXXVI</p>
          <p className="label-caps text-ink-faint">Not a survey of Indian art — an invitation into it</p>
        </div>
      </div>
    </footer>
  );
}
