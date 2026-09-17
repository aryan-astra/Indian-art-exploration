import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import type { Artifact } from "../data/timeline";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { cn } from "../utils/cn";
import { ArtImage } from "./ArtImage";

interface Props {
  artifact: Artifact;
  index: number;
  onOpen: (artifact: Artifact) => void;
  offset?: boolean;
}

const aspectClass = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
} as const;

export function ArtifactCard({ artifact, index, onOpen, offset }: Props) {
  const reduce = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLButtonElement>(null);

  // Subtle pointer-follow tilt (desktop only, respects reduced motion)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const shineX = useTransform(sx, [-0.5, 0.5], ["20%", "80%"]);
  const shineY = useTransform(sy, [-0.5, 0.5], ["20%", "80%"]);
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.28), transparent 60%)`;

  const enabled = canHover && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.1 }}
      className={cn("list-none", offset && "lg:mt-16")}
    >
      <motion.button
        ref={ref}
        type="button"
        onClick={() => onOpen(artifact)}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={enabled ? { rotateX, rotateY, transformPerspective: 1200 } : undefined}
        className="group block w-full text-left outline-none"
        aria-label={`${artifact.title}, ${artifact.dateLabel}. Open details`}
      >
        <div className="relative">
          <ArtImage
            src={artifact.image}
            alt={artifact.imageAlt}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className={cn(
              "w-full ring-1 ring-ink/10 transition-shadow duration-700 group-hover:shadow-[0_30px_60px_-30px_rgba(29,26,22,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-[var(--era)]",
              aspectClass[artifact.aspect],
            )}
            imgClassName="transition-transform duration-[1200ms] [transition-timing-function:var(--ease-art)] group-hover:scale-[1.045]"
          />
          {enabled && (
            <motion.span
              aria-hidden="true"
              style={{ background: shine }}
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <span className="caps absolute left-3 top-3 bg-paper/85 px-2 py-1 text-ink-2 backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="mt-4">
          <p className="caps text-ink-3">
            {artifact.dateLabel} <span className="mx-1.5 opacity-40">·</span> {artifact.medium}
          </p>
          <h3 className="font-display mt-1.5 text-2xl leading-tight text-ink sm:text-[1.7rem]">
            {artifact.title}
          </h3>
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-8 era-bg transition-all duration-700 [transition-timing-function:var(--ease-art)] group-hover:w-full group-focus-visible:w-full"
          />
        </div>
      </motion.button>
    </motion.li>
  );
}
