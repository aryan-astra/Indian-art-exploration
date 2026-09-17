import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../utils/cn";

/**
 * A slowly rotating concentric "chakra" ornament drawn in thin ink lines.
 * Purely decorative — hidden from assistive technology.
 */
export function Chakra({
  className,
  strokeWidth = 0.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const spokes = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={cn("select-none", className)}
      animate={reduce ? undefined : { rotate: 360 }}
      transition={reduce ? undefined : { duration: 160, ease: "linear", repeat: Infinity }}
    >
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="78" />
      <circle cx="100" cy="100" r="54" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="30" />
      <circle cx="100" cy="100" r="6" />
      {spokes.map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="22"
          x2="100"
          y2="46"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
      {spokes
        .filter((_, i) => i % 2 === 0)
        .map((deg) => (
          <path
            key={`p${deg}`}
            d="M100 70 C 106 80, 106 90, 100 100 C 94 90, 94 80, 100 70 Z"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
    </motion.svg>
  );
}

/** Thin horizontal rule with a small diamond in the centre. */
export function Rule({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-line" />
      <span className="h-1.5 w-1.5 rotate-45 border border-current" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
