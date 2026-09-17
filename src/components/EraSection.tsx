import { motion, useReducedMotion } from "framer-motion";
import type { Artifact, Era, Medium } from "../data/timeline";
import { cn } from "../utils/cn";
import { ArtifactCard } from "./ArtifactCard";

interface Props {
  era: Era;
  artifacts: Artifact[];
  filter: Medium | "All";
  isActive: boolean;
  isReached: boolean;
  onOpen: (artifact: Artifact) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function EraSection({ era, artifacts, filter, isActive, isReached, onOpen }: Props) {
  const reduce = useReducedMotion();
  const visible = filter === "All" ? artifacts : artifacts.filter((a) => a.medium === filter);
  const headingId = `era-heading-${era.id}`;

  return (
    <section
      id={`era-${era.id}`}
      aria-labelledby={headingId}
      style={{ ["--era" as string]: era.color }}
      className="relative scroll-mt-40 py-20 sm:py-28 lg:py-36"
    >
      {/* Spine node */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-paper ring-1 transition-all duration-700 sm:-left-12 sm:top-[8.1rem] sm:block lg:-left-20 lg:top-[10.5rem]",
          isReached ? "era-bg ring-[var(--era)]" : "bg-paper ring-line",
          isActive && "scale-150",
        )}
      />

      {/* Watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-8 select-none font-display text-[clamp(5rem,16vw,15rem)] leading-none text-ink/[0.035] lg:top-12"
      >
        {era.numeral}
      </span>

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ——— Era summary ——— */}
        <motion.header
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-4 lg:sticky lg:top-40 lg:self-start"
        >
          <div className="flex items-center gap-4">
            <span className="font-display text-5xl leading-none era-text sm:text-6xl">
              {era.numeral}
            </span>
            <span aria-hidden="true" className="h-px flex-1 max-w-24 bg-line" />
            <span className="caps text-ink-3">{era.range}</span>
          </div>

          <h2
            id={headingId}
            className="font-display mt-6 text-balance text-4xl leading-[1.02] sm:text-5xl lg:text-[3.4rem]"
          >
            {era.name}
          </h2>
          <p className="font-display mt-2 text-xl italic text-ink-3">{era.subtitle}</p>

          <p className="mt-6 max-w-md text-pretty text-[0.95rem] leading-relaxed text-ink-2">
            {era.blurb}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Key themes">
            {era.keywords.map((k) => (
              <li
                key={k}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-2"
              >
                {k}
              </li>
            ))}
          </ul>

          <p className="caps mt-8 text-ink-3" aria-live="polite">
            {visible.length} of {artifacts.length} artifact{artifacts.length === 1 ? "" : "s"}
            {filter !== "All" && ` · ${filter}`}
          </p>
        </motion.header>

        {/* ——— Artifacts ——— */}
        <div className="lg:col-span-8">
          {visible.length > 0 ? (
            <ol className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:gap-x-12" role="list">
              {visible.map((a, i) => (
                <ArtifactCard
                  key={a.id}
                  artifact={a}
                  index={i}
                  onOpen={onOpen}
                  offset={i % 2 === 1}
                />
              ))}
            </ol>
          ) : (
            <div className="flex min-h-48 items-center border border-dashed border-line p-8">
              <p className="font-display text-xl italic text-ink-3">
                No {filter.toLowerCase()} artifacts are featured in this era. Clear the filter to
                see all {artifacts.length}.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
