import { useState } from "react";
import { cn } from "../utils/cn";

interface Props {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}

/**
 * Progressive image: shimmer while loading, gentle fade-in, and an
 * ornamental fallback if the network image cannot be fetched.
 */
export function ArtImage({
  src,
  alt,
  className,
  imgClassName,
  sizes,
  priority = false,
  fit = "cover",
}: Props) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className={cn("relative overflow-hidden bg-paper-2", className)}>
      {state === "loading" && (
        <div aria-hidden="true" className="absolute inset-0 shimmer" />
      )}
      {state === "error" ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
        >
          <svg
            viewBox="0 0 64 64"
            className="h-12 w-12 opacity-40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="32" cy="32" r="28" />
            <circle cx="32" cy="32" r="18" />
            <circle cx="32" cy="32" r="8" />
            <path d="M32 4v56M4 32h56" />
          </svg>
          <span className="caps text-ink-3">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setState("loaded")}
          onError={() => setState("error")}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700 [transition-timing-function:var(--ease-art)]",
            fit === "cover" ? "object-cover" : "object-contain",
            state === "loaded" ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
    </div>
  );
}
