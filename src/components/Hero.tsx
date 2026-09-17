import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { artifacts, eras } from "../data/timeline";
import { Chakra } from "./Ornament";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ onBegin }: { onBegin: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  const stats = [
    { value: eras.length, label: "Eras" },
    { value: artifacts.length, label: "Artifacts" },
    { value: "30,000", label: "Years" },
  ];

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-20 pb-24 sm:px-8 lg:px-12"
    >
      {/* Ornament */}
      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute -right-[20vmin] top-1/2 -translate-y-1/2 text-ink/[0.08] sm:-right-[10vmin]"
      >
        <Chakra className="h-[90vmin] w-[90vmin] max-h-[820px] max-w-[820px]" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-[1600px]"
      >
        <motion.p variants={item} className="caps era-text mb-6">
          काल · Kāla · Time
        </motion.p>

        <motion.h1
          id="hero-title"
          variants={item}
          className="font-display text-balance text-[clamp(3rem,10vw,9.5rem)] leading-[0.92]"
        >
          An Interactive
          <br />
          Timeline of{" "}
          <em className="italic font-light era-text transition-colors duration-700">
            Indian Art
          </em>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:text-lg"
        >
          From ochre hand-prints on Bhimbetka's sandstone to the living lines of Warli
          and Madhubani — {artifacts.length} artifacts across {eras.length} eras, arranged as a
          single continuous thread. Scroll to travel through time, or select any era to jump.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
          <button
            type="button"
            onClick={onBegin}
            className="group relative inline-flex items-center gap-3 overflow-hidden border border-ink px-6 py-3 text-sm font-medium transition-colors duration-500 hover:text-paper focus-visible:text-paper"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 [transition-timing-function:var(--ease-art)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            <span className="relative">Begin the journey</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <dl className="flex gap-8 sm:gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="caps text-ink-3">{s.label}</dt>
                <dd className="font-display mt-1 text-3xl tabular-nums sm:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="caps text-ink-3">Scroll</span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 era-bg"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
