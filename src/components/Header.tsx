import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { eras, type Era } from "../data/timeline";

interface Props {
  activeEra: Era | null;
}

export function Header({ activeEra }: Props) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Scroll progress line */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress, backgroundColor: "var(--era)" }}
        className="h-[2px] w-full origin-left transition-colors duration-700"
      />
      <div className="bg-paper/80 backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="#top"
            className="group flex items-baseline gap-2"
            aria-label="Kāla — back to top"
          >
            <span className="font-display text-2xl leading-none tracking-tight">Kāla</span>
            <span className="caps hidden text-ink-3 sm:inline">
              · A Timeline of Indian Art
            </span>
          </a>

          <div className="flex items-center gap-4 sm:gap-6">
            <div
              className="relative hidden h-5 min-w-[12rem] items-center justify-end overflow-hidden md:flex"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeEra?.id ?? "intro"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-lg italic text-ink-2"
                >
                  {activeEra ? activeEra.name : "Introduction"}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="caps tabular-nums text-ink-3" aria-label="Era progress">
              <span className="era-text transition-colors duration-700">
                {activeEra ? String(activeEra.index + 1).padStart(2, "0") : "00"}
              </span>
              <span className="mx-1 opacity-50">/</span>
              {String(eras.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
