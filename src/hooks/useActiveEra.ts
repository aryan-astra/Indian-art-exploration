import { useEffect, useState } from "react";

/**
 * Tracks which era section is currently dominant in the viewport.
 * Uses a thin horizontal band around 40% of the viewport height so the
 * active era switches predictably as the user scrolls.
 */
export function useActiveEra(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(`era-${id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const firstId = `era-${ids[0]}`;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("era-", ""));
          } else if (
            entry.target.id === firstId &&
            entry.boundingClientRect.top > window.innerHeight * 0.4
          ) {
            // Scrolled back up into the introduction
            setActive(null);
          }
        }
      },
      { rootMargin: "-38% 0px -58% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
