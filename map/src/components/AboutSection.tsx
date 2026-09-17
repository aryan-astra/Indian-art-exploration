import { useEffect, useRef } from "react";
import { gsap } from "../lib/anim";

export function AboutSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-item",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about" className="border-b border-hairline bg-parchment scroll-mt-4">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:px-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-20 md:py-24">
        <div>
          <p className="about-item label-caps text-terracotta">03 · About the atlas</p>
          <h2 className="about-item mt-3 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.05] font-medium">
            Geography is the argument.
          </h2>
        </div>
        <div className="max-w-2xl space-y-6">
          <p className="about-item text-[15px] leading-relaxed text-ink-soft">
            Every site in this atlas is a place where art practice was concentrated — a court, a cave, an atelier, a
            craft town. The geography matters: mineral, river and route determined what could be built, painted and
            woven, and in what order. Read the map the way a historian reads a document — west to east, coast to
            coast, century by century.
          </p>
          <p className="about-item text-[15px] leading-relaxed text-ink-soft">
            Period divisions are for orientation, not argument — movements overlapped, travelled and returned. The
            atlas is deliberately narrow: thirty-two sites chosen to carry the breadth of the subcontinent's artistic
            history, from Mauryan stone to contemporary galleries.
          </p>
          <dl className="about-item mt-8 grid gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-2">
            <div>
              <dt className="label-caps text-ink-faint">Geographic base</dt>
              <dd className="mt-1.5 text-[12.5px] leading-relaxed font-medium text-ink-soft">
                Official state boundaries of India (simplified GIS, public domain), projected with d3-geo Mercator;
                WGS-84 coordinates throughout.
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-faint">Historical context</dt>
              <dd className="mt-1.5 text-[12.5px] leading-relaxed font-medium text-ink-soft">
                UNESCO World Heritage Centre, the Archaeological Survey of India, and standard art-historical
                literature.
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-faint">Photography</dt>
              <dd className="mt-1.5 text-[12.5px] leading-relaxed font-medium text-ink-soft">
                Contributed by Pexels artists, credited per site. Sites without an image carry a numbered index plate.
              </dd>
            </div>
            <div>
              <dt className="label-caps text-ink-faint">Note</dt>
              <dd className="mt-1.5 text-[12.5px] leading-relaxed font-medium text-ink-soft">
                A design study in cultural cartography — a point of entry, not a survey of Indian art.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
