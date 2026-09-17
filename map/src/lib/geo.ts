import { geoMercator, geoPath, geoGraticule } from "d3-geo";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import raw from "../data/india-states.geo.json";

/**
 * Authoritative state boundary geometry (WGS-84), projected with d3-geo.
 * The shape of India is never redrawn or altered — only projected and
 * fitted to the current viewport. All markers share the same projection,
 * so every site sits at its true geographic position.
 */
const featureCollection = raw as unknown as FeatureCollection<Geometry, { name?: string }>;

export interface IndiaGeo {
  width: number;
  height: number;
  statesPath: string;
  outlinePath: string;
  graticulePath: string;
  project: (lon: number, lat: number) => [number, number];
}

export function buildIndiaGeo(width: number, height: number): IndiaGeo {
  if (width < 60 || height < 60) {
    return { width, height, statesPath: "", outlinePath: "", graticulePath: "", project: () => [0, 0] };
  }
  const projection = geoMercator().fitExtent(
    [
      [14, 14],
      [width - 14, height - 14],
    ],
    featureCollection
  );
  const path = geoPath(projection);
  // Coastline = the first (outer) ring of every state polygon. Adjacent
  // states share identical edge coordinates, so overlapping strokes render
  // as one clean line; the true coastline is traced exactly.
  const outerRings: Position[][] = featureCollection.features.flatMap((f) => {
    const g = f.geometry;
    if (g.type === "Polygon") return [g.coordinates[0]];
    if (g.type === "MultiPolygon") return g.coordinates.map((p) => p[0]);
    return [];
  });
  const outline: Feature<Geometry> = {
    type: "Feature",
    properties: {},
    geometry: { type: "MultiPolygon", coordinates: outerRings.map((r) => [r]) } as Geometry,
  };
  const graticule = geoGraticule().step([10, 10])();

  return {
    width,
    height,
    statesPath: featureCollection.features.map((f) => path(f) ?? "").join(""),
    outlinePath: path(outline) ?? "",
    graticulePath: path(graticule) ?? "",
    project: (lon, lat) => {
      const p = projection([lon, lat]);
      return p ? [p[0], p[1]] : [0, 0];
    },
  };
}

export interface MapPoint {
  id: string;
  x: number;
  y: number;
  lon: number;
}

export interface Cluster {
  key: string;
  x: number;
  y: number;
  ids: string[];
}

/**
 * Screen-space clustering. Points closer than `threshold` px at the
 * current zoom level are grouped into a single bubble. The currently
 * selected site is always excluded so it can never be hidden by a bubble.
 */
export function computeClusters(
  points: MapPoint[],
  k: number,
  excludeId: string | null = null,
  threshold = 11
): Cluster[] {
  const screen = points
    .filter((p) => p.id !== excludeId)
    .map((p) => ({ id: p.id, sx: p.x * k, sy: p.y * k }));
  const groups: { x: number; y: number; ids: string[] }[] = [];
  for (const s of screen) {
    const g = groups.find((existing) => Math.hypot(existing.x - s.sx, existing.y - s.sy) < threshold);
    if (g) {
      const n = g.ids.length;
      g.x = (g.x * n + s.sx) / (n + 1);
      g.y = (g.y * n + s.sy) / (n + 1);
      g.ids.push(s.id);
    } else {
      groups.push({ x: s.sx, y: s.sy, ids: [s.id] });
    }
  }
  return groups
    .filter((g) => g.ids.length > 1)
    .map((g) => ({ key: g.ids.join("|"), x: g.x / k, y: g.y / k, ids: g.ids }));
}

/**
 * True when no zoom level (up to `maxK`) can separate the members of a
 * cluster — i.e. the bubble can never resolve into individual markers.
 */
export function clusterIsPermanent(cluster: Cluster, points: MapPoint[], maxK: number, threshold = 11): boolean {
  const pts = cluster.ids
    .map((id) => points.find((p) => p.id === id))
    .filter((p): p is MapPoint => Boolean(p));
  let maxDist = 0;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      maxDist = Math.max(maxDist, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y));
    }
  }
  return maxDist * maxK < threshold;
}
