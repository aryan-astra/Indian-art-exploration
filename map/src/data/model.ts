export const PERIODS = [
  { id: "ancient", label: "Ancient", range: "before 400 CE", color: "#9c6b3f", blurb: "The Mauryan and early-Gupta world: stupas, toranas and the first great monuments to the Buddha, cut in stone across the Gangetic basin." },
  { id: "classical", label: "Classical", range: "400 – 1200 CE", color: "#b0532f", blurb: "The Gupta and post-Gupta flowering — cave painting at its peak, temple sculpture canonised, and bronzes cast that would define Indian iconography." },
  { id: "medieval", label: "Medieval", range: "1200 – 1600", color: "#6f7a41", blurb: "Hampi, Konark and the Himalayan gompas: a late, high season of the Hindu temple, of stagecraft, and of the stepwell in stone." },
  { id: "mughal", label: "Mughal", range: "1600 – 1800", color: "#33517e", blurb: "The court century: marble at Agra, the miniature perfected, brocades and needlework of the durbar, and the Pahari hills answering with watercolour." },
  { id: "colonial", label: "Colonial", range: "1800 – 1947", color: "#607080", blurb: "Company schools, the first fine-arts academies and photography's arrival — and the Bengal School's painted answer to empire." },
  { id: "modern", label: "Modern", range: "1947 – 1990", color: "#2f6e5e", blurb: "Independence and its studio debates: the Progressives, the Baroda school, and the search for a modern idiom at home in India." },
  { id: "contemporary", label: "Contemporary", range: "1990 – today", color: "#211d15", blurb: "Galleries, biennials and museums in the capital and the ports — and living folk traditions, Warli, Gond and Mithila, entering the global conversation." },
] as const;

export type PeriodId = (typeof PERIODS)[number]["id"];

export const PERIOD_META: Record<PeriodId, (typeof PERIODS)[number]> = Object.fromEntries(
  PERIODS.map((p) => [p.id, p])
) as Record<PeriodId, (typeof PERIODS)[number]>;

export const ART_FORMS = [
  "Architecture",
  "Sculpture",
  "Painting",
  "Textiles",
  "Performing arts",
  "Folk & tribal",
  "Religious art",
  "Craft",
] as const;

export type ArtForm = (typeof ART_FORMS)[number];

export const REGIONS = ["North", "West", "Central", "East", "South", "North-East"] as const;
export type Region = (typeof REGIONS)[number];

export interface SiteImage {
  src: string;
  alt: string;
  credit: string;
}

export interface ArtLocation {
  id: string;
  plate: number;
  name: string;
  state: string;
  region: Region;
  lat: number;
  lon: number;
  periods: PeriodId[];
  dates: string;
  artForms: ArtForm[];
  significance: string;
  description: string;
  sites: string[];
  traditions: string[];
  image?: SiteImage;
  source: string;
}

export interface Filters {
  period: PeriodId | null;
  artForm: ArtForm | null;
  region: Region | null;
}

export const EMPTY_FILTERS: Filters = { period: null, artForm: null, region: null };

export function formatCoords(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lon).toFixed(2)}° ${ew}`;
}
