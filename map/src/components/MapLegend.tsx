import { PERIODS } from "../data/model";

export function MapLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label="Map legend: site periods">
      {PERIODS.map((p) => (
        <li key={p.id} className="flex items-center gap-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} aria-hidden="true" />
          <span className="text-[10.5px] font-semibold whitespace-nowrap text-ink-soft">{p.label}</span>
        </li>
      ))}
    </ul>
  );
}
