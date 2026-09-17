import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { eraById, type Artifact } from "../data/timeline";
import { ArtImage } from "./ArtImage";

interface Props {
  artifact: Artifact | null;
  list: Artifact[];
  onClose: () => void;
  onNavigate: (artifact: Artifact) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ArtifactModal({ artifact, list, onClose, onNavigate }: Props) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const index = artifact ? list.findIndex((a) => a.id === artifact.id) : -1;
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  const go = useCallback(
    (target: Artifact | null) => {
      if (!target) return;
      onNavigate(target);
      bodyRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    },
    [onNavigate, reduce],
  );

  // Focus management + scroll lock
  useEffect(() => {
    if (!artifact) return;
    restoreRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
    // Only run on open/close, not on navigation between artifacts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(artifact)]);

  // Keyboard: Esc, arrows, focus trap
  useEffect(() => {
    if (!artifact) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        go(next);
      } else if (e.key === "ArrowLeft") {
        go(prev);
      } else if (e.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (n) => n.offsetParent !== null,
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [artifact, next, prev, go, onClose]);

  const era = artifact ? eraById(artifact.eraId) : null;

  return (
    <AnimatePresence>
      {artifact && era && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-6 lg:p-10"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="artifact-title"
            aria-describedby="artifact-desc"
            style={{ ["--era" as string]: era.color }}
            initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[96svh] w-full max-w-[1400px] flex-col overflow-hidden bg-paper shadow-2xl sm:max-h-[90vh] lg:flex-row"
          >
            {/* Close */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-ink hover:text-paper"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            {/* Image panel */}
            <div className="relative flex shrink-0 flex-col bg-paper-2 lg:w-[54%] lg:min-h-[min(560px,80vh)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12]"
                style={{ background: `radial-gradient(ellipse at 30% 20%, var(--era), transparent 60%)` }}
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-[38svh] flex-col p-4 sm:h-[44vh] sm:p-8 lg:h-auto lg:flex-1 lg:p-12"
                >
                  <ArtImage
                    src={artifact.image}
                    alt={artifact.imageAlt}
                    fit="contain"
                    priority
                    className="min-h-0 w-full flex-1 bg-transparent"
                    imgClassName="drop-shadow-[0_24px_40px_rgba(29,26,22,0.25)]"
                  />
                </motion.div>
              </AnimatePresence>
              <p className="caps absolute bottom-3 left-4 text-ink-3 sm:bottom-4 sm:left-6">
                {index + 1} / {list.length}
              </p>
            </div>

            {/* Text panel */}
            <div ref={bodyRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={artifact.id}
                  initial={{ opacity: 0, x: reduce ? 0 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -16 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 px-6 pb-6 pt-8 sm:px-10 sm:pt-10 lg:px-12 lg:pt-14"
                >
                  <p className="caps era-text">
                    {era.numeral} · {era.name}
                  </p>
                  <h2
                    id="artifact-title"
                    className="font-display mt-3 text-balance text-3xl leading-[1.05] sm:text-4xl lg:text-[2.75rem]"
                  >
                    {artifact.title}
                  </h2>
                  <p className="font-display mt-2 text-lg italic text-ink-3">{artifact.dateLabel}</p>

                  <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-line py-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="caps text-ink-3">Medium</dt>
                      <dd className="mt-1 text-ink">{artifact.medium}</dd>
                    </div>
                    <div>
                      <dt className="caps text-ink-3">Material</dt>
                      <dd className="mt-1 text-ink">{artifact.material}</dd>
                    </div>
                    <div>
                      <dt className="caps text-ink-3">Location</dt>
                      <dd className="mt-1 text-ink">{artifact.location}</dd>
                    </div>
                  </dl>

                  <p id="artifact-desc" className="mt-6 text-pretty leading-relaxed text-ink-2">
                    {artifact.description}
                  </p>

                  <div className="mt-8 border-l-2 pl-5 era-border">
                    <h3 className="caps era-text">Why it matters</h3>
                    <p className="mt-2 text-pretty leading-relaxed text-ink-2">{artifact.significance}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="caps text-ink-3">Look closer</h3>
                    <p className="font-display mt-2 text-pretty text-xl italic leading-snug text-ink">
                      {artifact.lookCloser}
                    </p>
                  </div>

                  <a
                    href={artifact.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                  >
                    Image source · Wikimedia Commons
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next */}
              <nav
                aria-label="Adjacent artifacts"
                className="sticky bottom-0 mt-auto grid grid-cols-2 border-t border-line bg-paper"
              >
                <button
                  type="button"
                  onClick={() => go(prev)}
                  disabled={!prev}
                  className="group flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 12H5m0 0l6-6m-6 6l6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="min-w-0">
                    <span className="caps block text-ink-3">Previous</span>
                    <span className="font-display block truncate text-base">
                      {prev ? prev.title : "Start of timeline"}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => go(next)}
                  disabled={!next}
                  className="group flex items-center justify-end gap-3 border-l border-line px-5 py-4 text-right transition-colors hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
                >
                  <span className="min-w-0">
                    <span className="caps block text-ink-3">Next</span>
                    <span className="font-display block truncate text-base">
                      {next ? next.title : "End of timeline"}
                    </span>
                  </span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
