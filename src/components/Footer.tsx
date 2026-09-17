import { artifacts, eras } from "../data/timeline";
import { Rule } from "./Ornament";

export function Footer() {
  return (
    <footer id="about" className="relative border-t border-line/70 px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <Rule className="mx-auto max-w-xs text-ink-3" />

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-3xl">Kāla</p>
            <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-ink-2">
              <em className="font-display text-base italic">Kāla</em> (काल) is the Sanskrit
              word for time. This timeline is a curated introduction — {eras.length} eras,{" "}
              {artifacts.length} objects — not an exhaustive history. Dates follow widely accepted scholarly
              ranges and are approximate.
            </p>
          </div>

          <div>
            <h2 className="caps text-ink-3">Navigate</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-2">
              <li>
                <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-sans text-xs">J</kbd>
                <span className="mx-1.5">/</span>
                <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-sans text-xs">K</kbd>
                <span className="ml-3">Next / previous era</span>
              </li>
              <li>
                <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-sans text-xs">←</kbd>
                <span className="mx-1.5">/</span>
                <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-sans text-xs">→</kbd>
                <span className="ml-3">Browse artifacts in detail view</span>
              </li>
              <li>
                <kbd className="rounded border border-line bg-paper-2 px-1.5 py-0.5 font-sans text-xs">Esc</kbd>
                <span className="ml-3">Close detail view</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="caps text-ink-3">Credits</h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-ink-2">
              All artifact photographs are served from{" "}
              <a
                href="https://commons.wikimedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                Wikimedia Commons
              </a>{" "}
              under public-domain or Creative Commons licences; each detail view links to its
              source page. Typeset in Cormorant Garamond and Inter.
            </p>
          </div>
        </div>

        <p className="caps mt-14 text-center text-ink-3">
          Made with reverence for thirty thousand years of making
        </p>
      </div>
    </footer>
  );
}
