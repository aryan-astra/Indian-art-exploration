import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "d3-transition";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from "d3-zoom";
import { easeCubicInOut } from "d3-ease";
import { gsap } from "../lib/anim";
import { buildIndiaGeo, clusterIsPermanent, computeClusters, type Cluster, type MapPoint } from "../lib/geo";
import { useContainerSize } from "../hooks/useContainerSize";
import { PERIOD_META, type ArtLocation } from "../data/model";

export interface IndiaMapHandle {
  flyTo: (id: string) => void;
  resetView: () => void;
  zoomBy: (factor: number) => void;
}

interface Props {
  locations: ArtLocation[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  panelSide: boolean;
  reducedMotion: boolean;
}

export const IndiaMap = forwardRef<IndiaMapHandle, Props>(function IndiaMap(
  { locations, visibleIds, selectedId, onSelect, panelSide, reducedMotion },
  ref
) {
  const { ref: boxRef, size } = useContainerSize<HTMLDivElement>();
  const geo = useMemo(() => buildIndiaGeo(size.w, size.h), [size.w, size.h]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const worldRef = useRef<SVGGElement | null>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const transformRef = useRef<ZoomTransform>(zoomIdentity);
  const markerEls = useRef(new Map<string, SVGGElement>());
  const innerEls = useRef(new Map<string, SVGGElement>());
  const pulseEls = useRef(new Map<string, SVGCircleElement>());
  const clusterEls = useRef(new Map<string, SVGGElement>());
  const shownSet = useRef(new Set<string>());
  const firstFilterRun = useRef(true);
  const draggingRef = useRef(false);
  const lastKBucket = useRef(4);
  const lastBgClick = useRef(0);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const connectorRef = useRef<SVGGElement | null>(null);
  const pulseTweens = useRef<gsap.core.Tween[]>([]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [hintGone, setHintGone] = useState(false);
  const [ready, setReady] = useState(false);
  const [miniList, setMiniList] = useState<{ ids: string[]; x: number; y: number; above: boolean } | null>(null);

  const points: MapPoint[] = useMemo(
    () =>
      locations.map((l) => {
        const [x, y] = geo.project(l.lon, l.lat);
        return { id: l.id, x, y, lon: l.lon };
      }),
    [locations, geo]
  );
  const pointMap = useMemo(() => new Map(points.map((p) => [p.id, p])), [points]);
  const clustersRef = useRef(clusters);
  clustersRef.current = clusters;
  const visibleRef = useRef(visibleIds);
  visibleRef.current = visibleIds;
  selectedRef.current = selectedId;

  const locById = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);
  const clusterIds = useMemo(() => new Set(clusters.flatMap((c) => c.ids)), [clusters]);

  /* ---------- imperative camera & positioning ---------- */

  const applyTransform = useCallback(
    (t: ZoomTransform) => {
      transformRef.current = t;
      worldRef.current?.setAttribute("transform", `translate(${t.x},${t.y}) scale(${t.k})`);
      const s = 1 / Math.pow(t.k, 0.85);
      for (const p of points) {
        markerEls.current.get(p.id)?.setAttribute(
          "transform",
          `translate(${t.applyX(p.x)},${t.applyY(p.y)}) scale(${s})`
        );
      }
      for (const c of clustersRef.current) {
        clusterEls.current.get(c.key)?.setAttribute(
          "transform",
          `translate(${t.applyX(c.x)},${t.applyY(c.y)}) scale(${s})`
        );
      }
      positionTooltipRef.current();
      positionConnectorRef.current();
      const kb = Math.round(t.k * 4);
      if (kb !== lastKBucket.current && points.length > 0) {
        lastKBucket.current = kb;
        setClusters(computeClusters(points, t.k, selectedRef.current));
      }
    },
    [points]
  );

  // keep imperative positioning fns stable for the zoom listener
  const positionTooltipRef = useRef<() => void>(() => {});
  const positionConnectorRef = useRef<() => void>(() => {});

  const flyToId = useCallback(
    (id: string, kOverride?: number) => {
      const p = pointMap.get(id);
      const behavior = zoomBehaviorRef.current;
      const svgEl = svgRef.current;
      if (!p || !behavior || !svgEl || !size.w) return;
      const k = Math.max(kOverride ?? transformRef.current.k, 3.4);
      const panelW = Math.min(400, size.w * 0.42);
      const cx = panelSide ? (size.w - panelW - 24) / 2 + 12 : size.w / 2;
      const cy = panelSide ? size.h * 0.48 : size.h * 0.32;
      const t = zoomIdentity.translate(cx - k * p.x, cy - k * p.y).scale(k);
      const svg = select(svgEl) as any;
      if (reducedMotion) {
        svg.call(behavior.transform, t);
        return;
      }
      svg.transition().duration(900).ease(easeCubicInOut).call(behavior.transform, t);
    },
    [pointMap, size, panelSide, reducedMotion]
  );

  const transitionTo = useCallback(
    (t: ZoomTransform, duration = 900) => {
      const behavior = zoomBehaviorRef.current;
      const svgEl = svgRef.current;
      if (!behavior || !svgEl) return;
      const svg = select(svgEl) as any;
      if (reducedMotion) {
        svg.call(behavior.transform, t);
        return;
      }
      svg.transition().duration(duration).ease(easeCubicInOut).call(behavior.transform, t);
    },
    [reducedMotion]
  );

  useImperativeHandle(
    ref,
    () => ({
      flyTo: (id: string) => flyToId(id),
      resetView: () => transitionTo(zoomIdentity, 750),
      zoomBy: (f: number) => {
        const behavior = zoomBehaviorRef.current;
        const svgEl = svgRef.current;
        if (!behavior || !svgEl) return;
        const svg = select(svgEl) as any;
        if (reducedMotion) svg.call(behavior.scaleBy, f);
        else svg.transition().duration(320).ease(easeCubicInOut).call(behavior.scaleBy, f);
      },
    }),
    [flyToId, transitionTo, reducedMotion]
  );

  /* ---------- d3-zoom setup ---------- */

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = select(svgEl);
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 10])
      .on("start", (e) => {
        setMiniList(null);
        if (e.sourceEvent) {
          draggingRef.current = true;
          hoveredRef.current = null;
          setHoveredId(null);
          setHintGone(true);
        }
      })
      .on("zoom", (e) => applyTransform(e.transform))
      .on("end", () => {
        draggingRef.current = false;
      });
    zoomBehaviorRef.current = behavior;
    svg.call(behavior);
    // re-sync the behaviour's internal state with the visual camera
    svg.call(behavior.transform, transformRef.current);
    return () => {
      svg.on(".zoom", null);
      zoomBehaviorRef.current = null;
    };
  }, [applyTransform]);

  useEffect(() => {
    if (size.w) zoomBehaviorRef.current?.extent([
      [0, 0],
      [size.w, size.h],
    ]);
  }, [size]);

  /* ---------- reposition everything after renders / projection changes ---------- */

  useLayoutEffect(() => {
    const t = transformRef.current;
    const s = 1 / Math.pow(t.k, 0.85);
    for (const p of points) {
      markerEls.current.get(p.id)?.setAttribute(
        "transform",
        `translate(${t.applyX(p.x)},${t.applyY(p.y)}) scale(${s})`
      );
    }
    for (const c of clusters) {
      clusterEls.current.get(c.key)?.setAttribute(
        "transform",
        `translate(${t.applyX(c.x)},${t.applyY(c.y)}) scale(${s})`
      );
    }
    positionTooltipRef.current();
    positionConnectorRef.current();
  });

  useEffect(() => {
    if (size.w < 60) return;
    setReady(true);
    lastKBucket.current = -1;
    setClusters(computeClusters(points, transformRef.current.k, selectedRef.current));
    applyTransform(transformRef.current);
  }, [geo, size.w, points, applyTransform]);

  /* ---------- a selected site is always pulled out of its cluster ---------- */

  useEffect(() => {
    if (!ready || points.length === 0) return;
    setClusters(computeClusters(points, transformRef.current.k, selectedId));
  }, [selectedId, ready, points]);

  /* ---------- tooltip ---------- */

  const positionTooltip = useCallback(() => {
    const el = tooltipRef.current;
    const id = hoveredRef.current;
    if (!el || !id) return;
    const p = pointMap.get(id);
    if (!p) return;
    const t = transformRef.current;
    const sx = t.applyX(p.x);
    const sy = t.applyY(p.y);
    const tw = el.offsetWidth || 210;
    const th = el.offsetHeight || 90;
    const x = Math.min(Math.max(sx - tw / 2, 8), Math.max(size.w - tw - 8, 8));
    const y = Math.max(sy - th - 18, 8);
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, [pointMap, size]);
  positionTooltipRef.current = positionTooltip;

  useLayoutEffect(() => {
    if (hoveredId) positionTooltip();
  }, [hoveredId, positionTooltip]);

  /* ---------- connector (marker → panel) ---------- */

  const positionConnector = useCallback(() => {
    const g = connectorRef.current;
    const id = selectedRef.current;
    if (!g || !id || !size.w) return;
    const p = pointMap.get(id);
    if (!p) return;
    const t = transformRef.current;
    const sx = t.applyX(p.x);
    const sy = t.applyY(p.y);
    const panelW = Math.min(400, size.w * 0.42);
    const x2 = Math.max(size.w - panelW - 30, sx + 40);
    const y2 = Math.min(Math.max(sy, 96), size.h - 96);
    const line = g.querySelector("line");
    const dot = g.querySelector("circle");
    if (line) {
      line.setAttribute("x1", String(sx));
      line.setAttribute("y1", String(sy));
      line.setAttribute("x2", String(x2));
      line.setAttribute("y2", String(y2));
    }
    if (dot) {
      dot.setAttribute("cx", String(x2));
      dot.setAttribute("cy", String(y2));
    }
  }, [pointMap, size]);
  positionConnectorRef.current = positionConnector;

  /* ---------- selection: pulse + connector + tooltip cleanup ---------- */

  useEffect(() => {
    pulseTweens.current.forEach((t) => t.kill());
    pulseTweens.current = [];
    if (selectedId) {
      hoveredRef.current = null;
      setHoveredId(null);
    }
    if (!selectedId || reducedMotion) return;
    const el = pulseEls.current.get(selectedId);
    if (!el) return;
    const tween = gsap.fromTo(
      el,
      { attr: { r: 8 }, opacity: 0.55 },
      { attr: { r: 18 }, opacity: 0, duration: 1.7, ease: "power1.out", repeat: -1 }
    );
    pulseTweens.current.push(tween);
    return () => {
      tween.kill();
    };
  }, [selectedId, reducedMotion]);

  useEffect(() => {
    if (!selectedId || reducedMotion || !panelSide) return;
    const el = connectorRef.current;
    if (!el) return;
    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out", delay: 0.35 });
    return () => {
      tween.kill();
    };
  }, [selectedId, reducedMotion, panelSide]);

  /* ---------- marker intro (west → east sweep) ---------- */

  useEffect(() => {
    if (!ready || reducedMotion) return;
    const els: SVGGElement[] = [];
    const entries: { x: number; g: SVGGElement }[] = [];
    for (const p of points) {
      const g = innerEls.current.get(p.id);
      if (g && visibleRef.current.has(p.id)) entries.push({ x: p.x, g });
    }
    entries.sort((a, b) => a.x - b.x);
    entries.forEach((e) => els.push(e.g));
    if (!els.length) return;
    const tween = gsap.fromTo(
      els,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.04,
        paused: true,
      }
    );
    // fire the sweep when the map scrolls into view
    const observer = new IntersectionObserver(
      (obsEntries) => {
        if (obsEntries.some((e) => e.isIntersecting)) {
          tween.play();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    const box = boxRef.current;
    if (box) observer.observe(box);
    return () => {
      observer.disconnect();
      tween.kill();
      gsap.set(els, { scale: 1, opacity: 1 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, reducedMotion]);

  /* ---------- filter enter / exit ---------- */

  useEffect(() => {
    if (!ready) return;
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      visibleIds.forEach((id) => shownSet.current.add(id));
      innerEls.current.forEach((inner, id) => {
        if (!visibleIds.has(id)) {
          inner.style.opacity = "0";
          inner.style.visibility = "hidden";
        }
      });
      return;
    }
    // exits (collect before removing so the animation can run)
    const exiting = [...shownSet.current].filter((id) => !visibleIds.has(id));
    exiting.forEach((id) => shownSet.current.delete(id));
    exiting.forEach((id) => {
        const inner = innerEls.current.get(id);
        if (!inner) return;
        if (reducedMotion) {
          inner.style.opacity = "0";
          inner.style.visibility = "hidden";
          return;
        }
        gsap.to(inner, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            inner.style.visibility = "hidden";
          },
        });
    });
    // enters
    let i = 0;
    [...visibleIds.keys()].forEach((id) => {
      if (shownSet.current.has(id)) return;
      const inner = innerEls.current.get(id);
      if (!inner) return;
      shownSet.current.add(id);
      if (reducedMotion) {
        inner.style.visibility = "visible";
        gsap.set(inner, { scale: 1, opacity: 1 });
        return;
      }
      inner.style.visibility = "visible";
      gsap.fromTo(inner, { scale: 0, opacity: 0 }, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        delay: Math.min(i * 0.03, 0.35),
        clearProps: "visibility",
      });
      i++;
    });
  }, [visibleIds, ready, reducedMotion]);

  /* ---------- hint auto-dismiss ---------- */

  useEffect(() => {
    if (hintGone) return;
    const t = window.setTimeout(() => setHintGone(true), 7000);
    return () => window.clearTimeout(t);
  }, [hintGone]);

  /* ---------- interactions ---------- */

  const setHover = useCallback((id: string | null) => {
    if (draggingRef.current) return;
    if (hoveredRef.current === id) return;
    hoveredRef.current = id;
    setHoveredId(id);
  }, []);

  const onBgClick = () => {
    setMiniList(null);
    const now = Date.now();
    if (now - lastBgClick.current < 400) {
      lastBgClick.current = now;
      return;
    }
    lastBgClick.current = now;
    onSelect(null);
  };

  const onZoomIn = () => {
    const behavior = zoomBehaviorRef.current;
    const svgEl = svgRef.current;
    if (!behavior || !svgEl) return;
    setHintGone(true);
    const svg = select(svgEl) as any;
    if (reducedMotion) svg.call(behavior.scaleBy, 1.5);
    else svg.transition().duration(320).ease(easeCubicInOut).call(behavior.scaleBy, 1.5);
  };
  const onZoomOut = () => {
    const behavior = zoomBehaviorRef.current;
    const svgEl = svgRef.current;
    if (!behavior || !svgEl) return;
    setHintGone(true);
    const svg = select(svgEl) as any;
    if (reducedMotion) svg.call(behavior.scaleBy, 1 / 1.5);
    else svg.transition().duration(320).ease(easeCubicInOut).call(behavior.scaleBy, 1 / 1.5);
  };
  const onResetView = () => {
    setHintGone(true);
    transitionTo(zoomIdentity, 750);
  };

  /**
   * Cluster activation: if a zoom level exists that separates the members,
   * fly there and let the cluster split into individual markers. If the
   * sites are too close to ever separate (e.g. Old & New Delhi, ~0.5 px
   * apart), open a chooser listing the sites inside the bubble.
   */
  const onClusterActivate = (c: Cluster) => {
    setHintGone(true);
    setHover(null);
    if (clusterIsPermanent(c, points, 10)) {
      const t = transformRef.current;
      const sx = t.applyX(c.x);
      const sy = t.applyY(c.y);
      const estHeight = 46 + c.ids.length * 46;
      setMiniList({
        ids: c.ids,
        x: Math.min(Math.max(sx - 122, 8), Math.max(size.w - 252, 8)),
        y: sy + estHeight + 26 > size.h ? sy - 22 : sy + 22,
        above: sy + estHeight + 26 > size.h,
      });
      return;
    }
    const t = transformRef.current;
    const k = Math.min(10, Math.max(4, t.k * 2));
    const target = zoomIdentity.translate(size.w / 2 - k * c.x, size.h / 2 - k * c.y).scale(k);
    transitionTo(target, 850);
    setMiniList(null);
  };

  /* ---------- close the cluster chooser with Escape ---------- */

  useEffect(() => {
    if (!miniList) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMiniList(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [miniList]);

  const hoveredLoc = hoveredId ? locById.get(hoveredId) : null;
  const hoveredPoint = hoveredId ? pointMap.get(hoveredId) : null;
  const t0 = transformRef.current;

  /* ---------- render ---------- */

  return (
    <div ref={boxRef} className="relative h-full w-full" role="group" aria-label="Interactive map of India. Use the on-screen buttons or your mouse to pan and zoom; select a marker for details.">
      <svg
        ref={svgRef}
        width={size.w || undefined}
        height={size.h || undefined}
        viewBox={size.w ? `0 0 ${size.w} ${size.h}` : "0 0 10 10"}
        className="block h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onClick={onBgClick}
      >
        <defs>
          <filter id="india-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#211d15" floodOpacity="0.16" />
          </filter>
        </defs>

        {geo.statesPath && (
          <>
          <g ref={worldRef}>
            <path
              d={geo.graticulePath}
              fill="none"
              stroke="#cfc5a8"
              strokeWidth="0.6"
              strokeDasharray="1.5 6"
              vectorEffect="non-scaling-stroke"
              opacity="0.9"
            />
            <path d={geo.statesPath} fill="#e8e0cb" filter="url(#india-shadow)" />
            <path
              d={geo.statesPath}
              fill="none"
              stroke="#c8bc9b"
              strokeWidth="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={geo.outlinePath}
              fill="none"
              stroke="#9d8f68"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* clusters — screen space, OUTSIDE the zoomed world group */}
          <g>
              {clusters.map((c) => (
                <g
                  key={c.key}
                  ref={(el) => {
                    if (el) clusterEls.current.set(c.key, el);
                    else clusterEls.current.delete(c.key);
                  }}
                  className="marker-node"
                  role="button"
                  tabIndex={0}
                  aria-label={`Group of ${c.ids.length} sites — activate to separate or choose`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClusterActivate(c);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onClusterActivate(c);
                    }
                  }}
                >
                  <circle r="13" fill="#211d15" opacity="0.94" />
                  <circle r="13" fill="none" stroke="#f3eee2" strokeWidth="1" opacity="0.45" />
                  <text
                    textAnchor="middle"
                    dy="0.36em"
                    fill="#f3eee2"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Manrope Variable, sans-serif"
                  >
                    {c.ids.length}
                  </text>
                  <circle r="18" fill="transparent" />
                </g>
              ))}
          </g>

          {/* markers — screen space, OUTSIDE the zoomed world group */}
          <g>
              {points.map((p) => {
                const loc = locById.get(p.id);
                if (!loc) return null;
                const visible = visibleIds.has(p.id);
                const clustered = clusterIds.has(p.id);
                const color = PERIOD_META[loc.periods[0]].color;
                const isSel = selectedId === p.id;
                const isHover = hoveredId === p.id;
                return (
                  <g
                    key={p.id}
                    ref={(el) => {
                      if (el) markerEls.current.set(p.id, el);
                      else markerEls.current.delete(p.id);
                    }}
                    className="marker-node"
                    role="button"
                    tabIndex={0}
                    aria-label={`${loc.name}, ${loc.state} — open details`}
                    aria-pressed={isSel}
                    visibility={clustered ? "hidden" : undefined}
                    onPointerEnter={() => {
                      if (visible && !clustered) setHover(p.id);
                    }}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => {
                      if (visible && !clustered) setHover(p.id);
                    }}
                    onBlur={() => setHover(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!visible || clustered) return;
                      setHintGone(true);
                      onSelect(p.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (visible && !clustered) onSelect(p.id);
                      }
                    }}
                  >
                    <g
                      ref={(el) => {
                        if (el) innerEls.current.set(p.id, el);
                        else innerEls.current.delete(p.id);
                      }}
                    >
                      <circle r="12" fill={color} opacity={isSel ? 0.18 : isHover ? 0.15 : 0.09} />
                      <circle
                        className="marker-ring"
                        r="6.5"
                        fill="none"
                        stroke={color}
                        strokeWidth={isSel || isHover ? 1.8 : 1.3}
                        opacity={isSel || isHover ? 1 : 0.75}
                      />
                      <circle r="2.9" fill={color} stroke="#f3eee2" strokeWidth="1.2" />
                    </g>
                    {isSel && (
                      <circle r="9.5" fill="none" stroke={color} strokeWidth="1" opacity="0.65" strokeDasharray="2.5 3" />
                    )}
                    {isSel && (
                      <circle
                        ref={(el) => {
                          if (el) pulseEls.current.set(p.id, el);
                          else pulseEls.current.delete(p.id);
                        }}
                        r="8"
                        fill="none"
                        stroke={color}
                        strokeWidth="1.1"
                        opacity="0"
                      />
                    )}
                    <circle r="15" fill="transparent" />
                  </g>
                );
              })}
          </g>
          </>
        )}

        {/* connector to the detail panel (desktop) */}
        <g ref={connectorRef} visibility={selectedId && panelSide ? undefined : "hidden"}>
          <line stroke="#211d15" strokeOpacity="0.32" strokeWidth="1" strokeDasharray="4 4" />
          <circle r="2.5" fill="#211d15" opacity="0.4" />
        </g>
      </svg>

      {/* hover preview */}
      {hoveredLoc && hoveredPoint && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="pointer-events-none absolute top-0 left-0 z-30 w-[212px]"
          style={{
            transform: `translate(${Math.min(Math.max(t0.applyX(hoveredPoint.x) - 106, 8), Math.max(size.w - 220, 8))}px, ${Math.max(t0.applyY(hoveredPoint.y) - 118, 8)}px)`,
          }}
        >
          <div className="rounded-md border border-hairline-strong/70 bg-parchment px-4 py-3 shadow-panel">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: PERIOD_META[hoveredLoc.periods[0]].color }}
                aria-hidden="true"
              />
              <span className="label-caps text-ink-faint">
                {PERIOD_META[hoveredLoc.periods[0]].label} · {hoveredLoc.dates}
              </span>
            </div>
            <p className="mt-1.5 font-display text-[17px] leading-tight">{hoveredLoc.name}</p>
            <p className="mt-1 truncate text-[11px] font-medium text-ink-soft">
              {hoveredLoc.state} · {hoveredLoc.artForms.slice(0, 2).join(" · ")}
            </p>
            <p className="label-caps mt-2.5 text-terracotta">Open site →</p>
          </div>
        </div>
      )}

      {/* cluster chooser — sites too close to ever separate on the map */}
      {miniList && (
        <div
          className="absolute z-40 w-[244px]"
          style={{
            left: miniList.x,
            top: miniList.y,
            transform: miniList.above ? "translateY(-100%)" : undefined,
          }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          role="group"
          aria-label={`${miniList.ids.length} sites share this point — choose one`}
        >
          <div className="rounded-md border border-hairline-strong/70 bg-parchment shadow-panel">
            <p className="label-caps border-b border-hairline px-4 py-2.5 text-ink-faint">
              {miniList.ids.length} sites at this point
            </p>
            <ul>
              {miniList.ids.map((id) => {
                const loc = locById.get(id);
                if (!loc) return null;
                return (
                  <li key={id}>
                    <button
                      onClick={() => {
                        setMiniList(null);
                        onSelect(id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-parchment-deep"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: PERIOD_META[loc.periods[0]].color }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold">{loc.name}</span>
                        <span className="block truncate text-[11px] text-ink-soft">
                          {PERIOD_META[loc.periods[0]].label} · {loc.artForms[0]}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* zoom / reset controls */}
      <div className="absolute bottom-4 left-4 flex flex-col overflow-hidden rounded-md border border-hairline-strong/70 bg-parchment shadow-panel">
        <button
          aria-label="Zoom in"
          onClick={onZoomIn}
          className="grid h-9 w-9 place-items-center text-ink transition-colors hover:bg-parchment-deep"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          aria-label="Zoom out"
          onClick={onZoomOut}
          className="grid h-9 w-9 place-items-center border-t border-hairline text-ink transition-colors hover:bg-parchment-deep"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          aria-label="Reset view"
          onClick={onResetView}
          className="grid h-9 w-9 place-items-center border-t border-hairline text-ink transition-colors hover:bg-parchment-deep"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path
              d="M11.5 6.5a5 5 0 1 1-1.4-3.5M10.5 0.7v2.6H7.9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* interaction hint */}
      {!hintGone && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="block rounded-full border border-hairline-strong/70 bg-parchment/95 px-4 py-2 text-[11px] font-semibold whitespace-nowrap text-ink-soft shadow-panel">
            Drag to pan · Scroll or pinch to zoom · Select a marker
          </span>
        </div>
      )}
    </div>
  );
});
