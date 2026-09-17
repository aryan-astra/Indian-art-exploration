import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArtifactModal } from "./components/ArtifactModal";
import { EraRail } from "./components/EraRail";
import { EraSection } from "./components/EraSection";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Chakra } from "./components/Ornament";
import { artifacts, artifactsByEra, eras, type Artifact, type Era, type Medium } from "./data/timeline";
import { useActiveEra } from "./hooks/useActiveEra";

const eraIds = eras.map((e) => e.id);

export default function App() {
  const reduce = useReducedMotion();
  const activeId = useActiveEra(eraIds);
  const activeEra = useMemo(() => eras.find((e) => e.id === activeId) ?? null, [activeId]);
  const [filter, setFilter] = useState<Medium | "All">("All");
  const [selected, setSelected] = useState<Artifact | null>(null);

  // Ordered list for modal navigation, respecting the active filter
  const navList = useMemo(
    () => (filter === "All" ? artifacts : artifacts.filter((a) => a.medium === filter)),
    [filter],
  );

  // Propagate the era colour to the whole document (selection, focus rings, header)
  useEffect(() => {
    document.documentElement.style.setProperty("--era", activeEra?.color ?? "#b5552d");
  }, [activeEra]);

  const scrollToEra = useCallback(
    (era: Era) => {
      document
        .getElementById(`era-${era.id}`)
        ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    },
    [reduce],
  );

  // Global J / K shortcuts for era navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key !== "j" && e.key !== "k") return;
      const current = activeEra?.index ?? -1;
      const nextIndex = e.key === "j" ? Math.min(current + 1, eras.length - 1) : Math.max(current - 1, 0);
      if (nextIndex !== current) {
        e.preventDefault();
        scrollToEra(eras[nextIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeEra, selected, scrollToEra]);

  // Timeline spine progress
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 45%", "end 45%"],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });

  return (
    <div className="grain relative min-h-screen">
      <a
        href="#timeline"
        className="sr-only-focusable fixed left-4 top-4 z-[70] bg-ink px-4 py-2 text-sm text-paper"
      >
        Skip to timeline
      </a>

      <Header activeEra={activeEra} />

      <main id="main">
        <Hero onBegin={() => scrollToEra(eras[0])} />

        <EraRail activeEra={activeEra} onSelect={scrollToEra} filter={filter} onFilter={setFilter} />

        {/* ——— Timeline ——— */}
        <div
          id="timeline"
          ref={timelineRef}
          className="relative mx-auto max-w-[1600px] pl-5 pr-5 sm:pl-8 sm:pr-8 lg:pl-12 lg:pr-12"
        >
          <div className="relative sm:pl-12 lg:pl-20">
            {/* Spine */}
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-line sm:block">
              <motion.div
                style={{ scaleY: spine, backgroundColor: "var(--era)" }}
                className="absolute inset-0 origin-top transition-colors duration-700"
              />
            </div>

            {eras.map((era) => (
              <EraSection
                key={era.id}
                era={era}
                artifacts={artifactsByEra(era.id)}
                filter={filter}
                isActive={activeEra?.id === era.id}
                isReached={activeEra ? era.index <= activeEra.index : false}
                onOpen={setSelected}
              />
            ))}
          </div>
        </div>

        {/* ——— Epilogue ——— */}
        <section
          aria-labelledby="epilogue-title"
          className="relative overflow-hidden px-5 py-28 text-center sm:px-8 lg:px-12 lg:py-40"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink/[0.06]">
            <Chakra className="h-[70vmin] w-[70vmin] max-h-[640px] max-w-[640px]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-2xl"
          >
            <p className="caps era-text">Epilogue</p>
            <h2
              id="epilogue-title"
              className="font-display mt-6 text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
            >
              The thread does not end.{" "}
              <em className="italic">It circles.</em>
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-ink-2">
              A Warli dancer painted this year in rice paste and a hunter painted at Bhimbetka
              ten thousand years ago are drawn from the same few strokes. The story of Indian
              art is less a line than a wheel — the one Ashoka set on his pillar, the one Shiva
              dances inside.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
              className="caps mt-10 inline-flex items-center gap-3 border-b border-ink pb-1 transition-colors hover:era-text hover:border-[var(--era)]"
            >
              Return to the beginning
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20V4m0 0l-6 6m6-6l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </section>
      </main>

      <Footer />

      <ArtifactModal
        artifact={selected}
        list={navList}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </div>
  );
}
