export type Medium = "Sculpture" | "Painting" | "Architecture" | "Object";
export type Aspect = "portrait" | "landscape" | "square";

export interface Artifact {
  id: string;
  eraId: string;
  title: string;
  dateLabel: string;
  /** Numeric year for sorting; negative = BCE */
  year: number;
  medium: Medium;
  material: string;
  location: string;
  aspect: Aspect;
  image: string;
  imageAlt: string;
  source: string;
  description: string;
  significance: string;
  lookCloser: string;
}

export interface Era {
  id: string;
  index: number;
  numeral: string;
  name: string;
  subtitle: string;
  range: string;
  start: number;
  end: number;
  color: string;
  blurb: string;
  keywords: string[];
}

/** Wikimedia Commons — resolves to the canonical upload URL */
const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;

export const formatYear = (y: number) =>
  y < 0 ? `${Math.abs(y).toLocaleString()} BCE` : `${y} CE`;

export const eras: Era[] = [
  {
    id: "prehistoric",
    index: 0,
    numeral: "I",
    name: "Prehistoric",
    subtitle: "The first marks",
    range: "c. 30,000 – 2,000 BCE",
    start: -30000,
    end: -2000,
    color: "#a4492a",
    blurb:
      "Long before cities, hunter-gatherers painted the sandstone shelters of central India with red ochre and white lime. Animals, hunts, dances and hand-prints record a way of seeing that is startlingly alive.",
    keywords: ["Rock art", "Ochre", "Bhimbetka"],
  },
  {
    id: "indus",
    index: 1,
    numeral: "II",
    name: "Indus Valley",
    subtitle: "Cities of the Bronze Age",
    range: "c. 2600 – 1900 BCE",
    start: -2600,
    end: -1900,
    color: "#8f5a3c",
    blurb:
      "In planned brick cities like Mohenjo-daro and Harappa, artisans cast bronze, carved steatite seals and modelled terracotta. Small in scale, their work shows a precocious naturalism and an unmistakable confidence.",
    keywords: ["Bronze", "Steatite seals", "Terracotta"],
  },
  {
    id: "mauryan",
    index: 2,
    numeral: "III",
    name: "Mauryan & Early Buddhist",
    subtitle: "Stone for an empire",
    range: "c. 322 BCE – 100 CE",
    start: -322,
    end: 100,
    color: "#7d6f52",
    blurb:
      "Under Ashoka, monumental art arrives in polished Chunar sandstone. Pillars broadcast imperial edicts, stupas enshrine relics, and the first narrative reliefs unfold the life of the Buddha without ever showing his body.",
    keywords: ["Polished sandstone", "Stupas", "Yakshi"],
  },
  {
    id: "classical",
    index: 3,
    numeral: "IV",
    name: "Kushan & Gupta",
    subtitle: "The classical age",
    range: "c. 50 – 550 CE",
    start: 50,
    end: 550,
    color: "#a8842a",
    blurb:
      "The Buddha takes human form in Gandhara and Mathura, and under the Guptas the image is refined into serene perfection. In the caves of Ajanta, painters produce a visual language of tenderness that would travel across Asia.",
    keywords: ["Buddha image", "Ajanta murals", "Idealised form"],
  },
  {
    id: "earlymedieval",
    index: 4,
    numeral: "V",
    name: "Early Medieval",
    subtitle: "Mountains carved into temples",
    range: "c. 600 – 1200 CE",
    start: 600,
    end: 1200,
    color: "#9c5b46",
    blurb:
      "Regional dynasties compete through architecture. Entire cliffs are cut into temples at Ellora, towers rise at Khajuraho, and a stepwell in Gujarat is turned into an inverted temple of sculpture.",
    keywords: ["Rock-cut", "Nagara towers", "Stepwells"],
  },
  {
    id: "chola",
    index: 5,
    numeral: "VI",
    name: "Chola & the Great Temples",
    subtitle: "Bronze and granite",
    range: "c. 850 – 1300 CE",
    start: 850,
    end: 1300,
    color: "#7a5426",
    blurb:
      "South and east India reach a sculptural zenith. Chola bronzes cast by the lost-wax method are carried in procession; granite towers pierce the sky at Thanjavur; the Sun Temple at Konark is imagined as a colossal chariot.",
    keywords: ["Lost-wax bronze", "Dravida", "Kalinga"],
  },
  {
    id: "sultanate",
    index: 6,
    numeral: "VII",
    name: "Sultanate & Vijayanagara",
    subtitle: "New forms, old stones",
    range: "c. 1200 – 1650 CE",
    start: 1200,
    end: 1650,
    color: "#3e4d7d",
    blurb:
      "Islamic patrons bring the arch, the dome and calligraphy; Indian masons answer in red sandstone. In the south, Vijayanagara and the Nayakas build vast temple cities crowned with gopurams painted like the sky.",
    keywords: ["Minarets", "Gopurams", "Indo-Islamic"],
  },
  {
    id: "mughal",
    index: 7,
    numeral: "VIII",
    name: "Mughal Ateliers",
    subtitle: "Painting for emperors",
    range: "1526 – 1750 CE",
    start: 1526,
    end: 1750,
    color: "#2f6a58",
    blurb:
      "Akbar's studio fuses Persian finesse with Indian colour and European perspective. Jahangir demands portraits of uncanny likeness; Shah Jahan turns marble into poetry.",
    keywords: ["Miniatures", "Portraiture", "Marble inlay"],
  },
  {
    id: "rajput",
    index: 8,
    numeral: "IX",
    name: "Rajput & Pahari Courts",
    subtitle: "Lyric colour",
    range: "c. 1600 – 1850 CE",
    start: 1600,
    end: 1850,
    color: "#b02a2f",
    blurb:
      "In the deserts of Rajasthan and the Himalayan foothills, court painters turn devotional poetry into images: Krishna and Radha, the seasons, the moods of music. Saturated colour and lyrical line replace Mughal realism.",
    keywords: ["Kishangarh", "Kangra", "Bhakti"],
  },
  {
    id: "modern",
    index: 9,
    numeral: "X",
    name: "Colonial & Modern",
    subtitle: "Finding a national image",
    range: "1850 – 1947 CE",
    start: 1850,
    end: 1947,
    color: "#5b3a63",
    blurb:
      "Bazaar painters, academic oils and a Bengal revival argue over what Indian art should be. By the 1930s Amrita Sher-Gil brings modernism home and paints the country's people with unflinching empathy.",
    keywords: ["Kalighat", "Oil painting", "Bengal School"],
  },
  {
    id: "living",
    index: 10,
    numeral: "XI",
    name: "Living Traditions",
    subtitle: "Ancient forms, present tense",
    range: "Ongoing",
    start: 1950,
    end: 2026,
    color: "#1f3a5f",
    blurb:
      "Village and tribal traditions with roots older than any empire continue today, painted on mud walls, paper and canvas. They close the timeline where it began: with rhythm, pigment and the everyday sacred.",
    keywords: ["Madhubani", "Warli", "Folk"],
  },
];

export const artifacts: Artifact[] = [
  // I — Prehistoric
  {
    id: "bhimbetka-shelter",
    eraId: "prehistoric",
    title: "Rock Shelters of Bhimbetka",
    dateLabel: "c. 30,000 BCE onward",
    year: -30000,
    medium: "Architecture",
    material: "Natural sandstone shelters with painted surfaces",
    location: "Raisen District, Madhya Pradesh",
    aspect: "landscape",
    image: commons("Rock Shelter 8, Bhimbetka 02.jpg"),
    imageAlt:
      "A massive overhanging sandstone rock shelter at Bhimbetka with weathered, sculptural surfaces.",
    source: commonsPage("Rock Shelter 8, Bhimbetka 02.jpg"),
    description:
      "Over 750 natural shelters in the Vindhya range preserve one of the world's densest concentrations of rock art. Some paintings are among the oldest known in South Asia, and the site was occupied continuously from the Stone Age into the medieval period.",
    significance:
      "Bhimbetka is the beginning of the Indian visual record — evidence that image-making here is tens of thousands of years old, long predating writing or cities.",
    lookCloser:
      "The rock itself is a collaborator: painters used natural hollows and ridges to give animals volume, a trick still visible in the way figures wrap around stone surfaces.",
  },
  {
    id: "bhimbetka-painting",
    eraId: "prehistoric",
    title: "Bhimbetka Cave Paintings",
    dateLabel: "c. 10,000 – 2,000 BCE",
    year: -10000,
    medium: "Painting",
    material: "Red ochre (haematite) and white lime on sandstone",
    location: "Bhimbetka, Madhya Pradesh",
    aspect: "landscape",
    image: commons("Bhimbetka Cave Paintings.jpg"),
    imageAlt:
      "Red ochre figures of animals and human hunters painted on a pale sandstone shelter wall.",
    source: commonsPage("Bhimbetka Cave Paintings.jpg"),
    description:
      "Hunters with bows, dancers in lines, bison, tigers and elephants are painted in mineral pigments bound with animal fat or plant gum. Layers of images from different millennia often overlap on the same wall.",
    significance:
      "These paintings establish motifs — the dancing figure, the procession, the sacred animal — that recur across five thousand years of Indian art.",
    lookCloser:
      "Notice how a running figure is reduced to a few confident strokes; the economy of line is a hallmark that Indian miniaturists would rediscover much later.",
  },

  // II — Indus Valley
  {
    id: "dancing-girl",
    eraId: "indus",
    title: "The Dancing Girl",
    dateLabel: "c. 2500 BCE",
    year: -2500,
    medium: "Sculpture",
    material: "Bronze, lost-wax cast · 10.5 cm",
    location: "National Museum, New Delhi",
    aspect: "portrait",
    image: commons("Dancing Girl of Mohenjo-daro.jpg"),
    imageAlt:
      "Small dark bronze figurine of a slender young woman standing with a hand on her hip, her left arm covered in bangles.",
    source: commonsPage("Dancing Girl of Mohenjo-daro.jpg"),
    description:
      "Excavated at Mohenjo-daro in 1926, this tiny figure stands with weight on one leg, hand on hip, chin lifted. Her left arm is stacked with bangles from wrist to shoulder; her hair is coiled in a heavy bun.",
    significance:
      "It is one of the earliest lost-wax bronzes anywhere, and its relaxed contrapposto anticipates a naturalism Europe would not see for two thousand years.",
    lookCloser:
      "Sir John Marshall, who published her, wrote that she seemed 'perfectly, for the moment, confident of herself and the world.' Look at the tilt of the head and you'll see why.",
  },
  {
    id: "priest-king",
    eraId: "indus",
    title: "The Priest-King",
    dateLabel: "c. 2200 – 1900 BCE",
    year: -2000,
    medium: "Sculpture",
    material: "Steatite (soapstone) · 17.5 cm",
    location: "National Museum of Pakistan, Karachi",
    aspect: "portrait",
    image: commons("Mohenjo-daro Priesterkönig.jpeg"),
    imageAlt:
      "Steatite bust of a bearded man with half-closed eyes, a fillet across his forehead and a trefoil-patterned robe over one shoulder.",
    source: commonsPage("Mohenjo-daro Priesterkönig.jpeg"),
    description:
      "A bearded man with a headband and an armband wears a cloak patterned with trefoils that were once inlaid with red paste. His eyes are half-closed, as if in meditation; the name 'Priest-King' is a modern guess at his role.",
    significance:
      "Almost the only monumental-feeling image from a civilization that otherwise avoided depicting rulers — a rare glimpse of Harappan authority and dress.",
    lookCloser:
      "The trefoil motif reappears across the ancient Near East as a symbol of stars or the heavens, hinting at Indus trade connections with Mesopotamia.",
  },
  {
    id: "pashupati-seal",
    eraId: "indus",
    title: "The Pashupati Seal",
    dateLabel: "c. 2350 – 2000 BCE",
    year: -2300,
    medium: "Object",
    material: "Carved steatite seal · 3.5 cm",
    location: "National Museum, New Delhi",
    aspect: "square",
    image: commons("Shiva Pashupati.jpg"),
    imageAlt:
      "Square steatite seal showing a horned figure seated cross-legged, surrounded by animals, with a line of undeciphered script above.",
    source: commonsPage("Shiva Pashupati.jpg"),
    description:
      "A horned, possibly three-faced figure sits in a yogic posture, surrounded by an elephant, tiger, rhinoceros and buffalo. Above runs a line of Indus script that no one has yet read.",
    significance:
      "Many scholars see a proto-Shiva, 'Lord of Animals'. Whether or not that is right, the seal shows that the seated meditative posture was already a charged image four thousand years ago.",
    lookCloser:
      "Seals were pressed into wet clay, so the carving is a mirror image. The animals are cut with astonishing precision for something the size of a postage stamp.",
  },

  // III — Mauryan & Early Buddhist
  {
    id: "lion-capital",
    eraId: "mauryan",
    title: "Lion Capital of Sarnath",
    dateLabel: "c. 250 BCE",
    year: -250,
    medium: "Sculpture",
    material: "Polished Chunar sandstone · 2.1 m",
    location: "Sarnath Museum, Uttar Pradesh",
    aspect: "portrait",
    image: commons("Sarnath capital.jpg"),
    imageAlt:
      "Four back-to-back lions carved in highly polished sandstone atop an abacus with a wheel and animals, on an inverted lotus.",
    source: commonsPage("Sarnath capital.jpg"),
    description:
      "Erected by Emperor Ashoka where the Buddha first preached, the capital shows four lions roaring outward above an abacus carved with a bull, horse, elephant and lion separated by wheels of dharma.",
    significance:
      "Adopted as the National Emblem of India in 1950. Its mirror-like 'Mauryan polish' has never been fully replicated.",
    lookCloser:
      "Each lion's mane is a lattice of stylised flame-like locks, while the animals on the abacus are startlingly naturalistic — two aesthetics in a single stone.",
  },
  {
    id: "didarganj-yakshi",
    eraId: "mauryan",
    title: "Didarganj Yakshi",
    dateLabel: "c. 3rd century BCE – 2nd century CE",
    year: -200,
    medium: "Sculpture",
    material: "Polished Chunar sandstone · 1.63 m",
    location: "Bihar Museum, Patna",
    aspect: "portrait",
    image: commons("Didarganj Yakshi statue in the Bihar Museum.jpg"),
    imageAlt:
      "Life-size polished sandstone statue of a full-figured woman holding a fly-whisk over her shoulder, wearing heavy jewellery.",
    source: commonsPage("Didarganj Yakshi statue in the Bihar Museum.jpg"),
    description:
      "Found on the banks of the Ganga in 1917, this life-size fly-whisk bearer is one of the finest early free-standing figures in India. Her lustrous surface, tight waist and heavy adornment define an ideal that later sculptors would inherit.",
    significance:
      "The yakshi — a nature spirit of abundance — is the ancestor of nearly every later female figure in Indian temple sculpture.",
    lookCloser:
      "The chauri (whisk) is held with an almost casual grace, and the fabric of her lower garment is indicated by the faintest incised lines.",
  },
  {
    id: "sanchi-torana",
    eraId: "mauryan",
    title: "Eastern Gateway, Great Stupa of Sanchi",
    dateLabel: "c. 1st century BCE",
    year: -50,
    medium: "Architecture",
    material: "Carved sandstone gateway (torana) · c. 10 m",
    location: "Sanchi, Madhya Pradesh",
    aspect: "portrait",
    image: commons("Eastern Gateway of The Great stupa, Sanchi 02.jpg"),
    imageAlt:
      "A tall carved stone gateway with three curved architraves densely covered in reliefs, standing before a hemispherical stupa.",
    source: commonsPage("Eastern Gateway of The Great stupa, Sanchi 02.jpg"),
    description:
      "Ashoka's original brick stupa was enlarged and, around 50 BCE, given four gateways carved by ivory-workers of nearby Vidisha. Every surface tells Jataka stories, scenes from the Buddha's life and processions of devotees.",
    significance:
      "The gateways are the masterpiece of aniconic Buddhist art: the Buddha is shown only as a wheel, a footprint, an empty throne or a tree.",
    lookCloser:
      "On the bracket of the east gate, a yakshi swings from a mango tree — a bridge from ancient fertility cults into Buddhist art.",
  },

  // IV — Kushan & Gupta
  {
    id: "gandhara-buddha",
    eraId: "classical",
    title: "Standing Buddha from Gandhara",
    dateLabel: "1st – 2nd century CE",
    year: 150,
    medium: "Sculpture",
    material: "Grey schist",
    location: "Tokyo National Museum",
    aspect: "portrait",
    image: commons("Gandhara Buddha (tnm).jpeg"),
    imageAlt:
      "Grey schist statue of the Buddha standing in heavy, deeply folded robes with wavy hair and a halo behind his head.",
    source: commonsPage("Gandhara Buddha (tnm).jpeg"),
    description:
      "In the Kushan-ruled northwest, sculptors trained in Greco-Roman traditions gave the Buddha a human body: wavy hair, a toga-like robe with deep folds, a calm and classical face.",
    significance:
      "One of the earliest anthropomorphic Buddha types, Gandhara's image travelled the Silk Road to China, Korea and Japan.",
    lookCloser:
      "The ushnisha (cranial bump) is treated as an elegant topknot, and the ears are elongated — marks of a great being that would remain standard for centuries.",
  },
  {
    id: "sarnath-buddha",
    eraId: "classical",
    title: "Seated Buddha Preaching, Sarnath",
    dateLabel: "c. 475 CE",
    year: 475,
    medium: "Sculpture",
    material: "Chunar sandstone · 1.6 m",
    location: "Sarnath Museum, Uttar Pradesh",
    aspect: "portrait",
    image: commons("Buddha in Sarnath Museum (Dhammajak Mutra).jpg"),
    imageAlt:
      "Sandstone Buddha seated cross-legged with hands in the teaching gesture, backed by an intricately carved circular halo.",
    source: commonsPage("Buddha in Sarnath Museum (Dhammajak Mutra).jpg"),
    description:
      "The Buddha turns the Wheel of Law at Sarnath, hands in dharmachakra mudra, eyes lowered in inward contemplation. The transparent robe clings to a smooth, idealised body; the halo behind him is a garden of vines.",
    significance:
      "The defining image of Gupta classicism — a synthesis of Mathura's fullness and Gandhara's restraint that became the canonical Buddha for all of Asia.",
    lookCloser:
      "On the pedestal, five monks and a woman with child kneel beside a wheel flanked by deer — a tiny narrative of the first sermon in the Deer Park.",
  },
  {
    id: "padmapani",
    eraId: "classical",
    title: "Bodhisattva Padmapani, Ajanta Cave 1",
    dateLabel: "c. 475 – 500 CE",
    year: 480,
    medium: "Painting",
    material: "Tempera on mud-and-lime plaster",
    location: "Ajanta Caves, Maharashtra",
    aspect: "portrait",
    image: commons("Bodhisattva Padmapani, Ajanta, cave 1, India.jpg"),
    imageAlt:
      "Mural of a bejewelled bodhisattva with a tall crown, head tilted and eyes lowered, holding a blue lotus in a garden of figures.",
    source: commonsPage("Bodhisattva Padmapani, Ajanta, cave 1, India.jpg"),
    description:
      "Flanking the shrine door of Cave 1, the 'lotus-bearer' inclines his head in infinite compassion, a blue lotus in his right hand. Around him crowd celestial beings, monkeys and peacocks in a jewelled landscape.",
    significance:
      "The most famous Indian painting of any period, and proof that a fully mature tradition of mural painting flourished under the Vakatakas and Guptas.",
    lookCloser:
      "The painters modelled flesh with shading and highlights on the nose and chin — not shadows cast by light, but an inner luminosity.",
  },

  // V — Early Medieval
  {
    id: "kailasa",
    eraId: "earlymedieval",
    title: "Kailasa Temple, Ellora Cave 16",
    dateLabel: "c. 756 – 773 CE",
    year: 760,
    medium: "Architecture",
    material: "Monolithic basalt, carved top-down",
    location: "Ellora, Maharashtra",
    aspect: "landscape",
    image: commons("Ellora Caves, India, Kailasa Temple.jpg"),
    imageAlt:
      "A vast temple carved out of a single basalt cliff, seen from above, with towers, courtyards and elephant sculptures.",
    source: commonsPage("Ellora Caves, India, Kailasa Temple.jpg"),
    description:
      "Commissioned by the Rashtrakuta king Krishna I, the temple was excavated from the top of a cliff downward, removing an estimated 200,000 tonnes of rock to leave a free-standing shrine, gateway, pillars and life-size elephants.",
    significance:
      "The largest monolithic structure in the world — a Dravida temple carried to the Deccan and executed as a single, staggering act of subtraction.",
    lookCloser:
      "On the south side, a relief of Ravana shaking Mount Kailasa shows Parvati clutching Shiva in alarm while he calmly presses the mountain down with his toe.",
  },
  {
    id: "kandariya",
    eraId: "earlymedieval",
    title: "Kandariya Mahadeva Temple, Khajuraho",
    dateLabel: "c. 1030 CE",
    year: 1030,
    medium: "Architecture",
    material: "Sandstone · 31 m high",
    location: "Khajuraho, Madhya Pradesh",
    aspect: "landscape",
    image: commons("Kandariya Mahadeva Temple, Khajuraho.jpg"),
    imageAlt:
      "A sandstone temple with a cluster of ascending curved towers, its walls covered in bands of sculpted figures.",
    source: commonsPage("Kandariya Mahadeva Temple, Khajuraho.jpg"),
    description:
      "Built by the Chandella king Vidyadhara, the temple's 84 subsidiary spires cluster around a central shikhara like a mountain range. Three bands of sculpture — 646 figures outside alone — wrap the walls with gods, dancers, lovers and attendants.",
    significance:
      "The culmination of the Nagara (northern) temple style, where architecture and sculpture become inseparable.",
    lookCloser:
      "Look for the surasundaris — celestial women removing a thorn, applying kohl, writing a letter — everyday gestures elevated to the divine.",
  },
  {
    id: "rani-ki-vav",
    eraId: "earlymedieval",
    title: "Rani ki Vav, the Queen's Stepwell",
    dateLabel: "c. 1063 CE",
    year: 1063,
    medium: "Architecture",
    material: "Sandstone, seven storeys deep",
    location: "Patan, Gujarat",
    aspect: "landscape",
    image: commons("Rani ki vav 02.jpg"),
    imageAlt:
      "A monumental stepwell descending in terraces, its walls lined with hundreds of carved sculptures of deities.",
    source: commonsPage("Rani ki vav 02.jpg"),
    description:
      "Built by Queen Udayamati in memory of her husband, the Solanki king Bhimdev I, this stepwell descends seven storeys through pillared pavilions to the water. Over 500 principal sculptures line the walls, many of Vishnu's avatars.",
    significance:
      "An inverted temple: the sacred water below replaces the sanctum above. Silted over for centuries, it was rediscovered in the 1940s almost perfectly preserved.",
    lookCloser:
      "The image of Vishnu reclining on the serpent Sheshnag was placed exactly where the well's water would rise to meet it in the monsoon.",
  },

  // VI — Chola & the Great Temples
  {
    id: "nataraja",
    eraId: "chola",
    title: "Shiva Nataraja, Lord of the Dance",
    dateLabel: "c. 950 – 1000 CE",
    year: 975,
    medium: "Sculpture",
    material: "Copper alloy, lost-wax cast · 76 cm",
    location: "Los Angeles County Museum of Art",
    aspect: "portrait",
    image: commons("Shiva as the Lord of Dance LACMA edit.jpg"),
    imageAlt:
      "Bronze of four-armed Shiva dancing within a ring of flames, one leg raised, standing on a dwarf demon.",
    source: commonsPage("Shiva as the Lord of Dance LACMA edit.jpg"),
    description:
      "Shiva dances the universe into being and out of existence within a ring of fire. A drum in one hand beats creation; flame in another consumes it; a raised palm says 'fear not'; a lowered arm points to the lifted foot of release.",
    significance:
      "Perhaps the most complete visual theology ever cast in metal, and the image that made Chola bronze famous worldwide. Rodin called it 'the most perfect expression of rhythmic movement'.",
    lookCloser:
      "Beneath his foot lies Apasmara, the dwarf of ignorance. His hair fans out in matted locks, carrying the goddess Ganga and a crescent moon.",
  },
  {
    id: "brihadeeswarar",
    eraId: "chola",
    title: "Brihadeeswarar Temple, Thanjavur",
    dateLabel: "1010 CE",
    year: 1010,
    medium: "Architecture",
    material: "Granite · vimana 66 m high",
    location: "Thanjavur, Tamil Nadu",
    aspect: "landscape",
    image: commons("Thanjavur Brihadeeshwara Temple.jpg"),
    imageAlt:
      "A soaring pyramidal granite temple tower crowned with a rounded capstone, seen across a paved courtyard.",
    source: commonsPage("Thanjavur Brihadeeshwara Temple.jpg"),
    description:
      "Rajaraja Chola I built the 'Big Temple' in only about seven years. Its 16-storey vimana was the tallest structure in India for centuries; the 80-tonne capstone was reportedly hauled up a ramp several kilometres long.",
    significance:
      "The supreme statement of Chola power and the Dravida style — and a living temple whose walls still carry Rajaraja's inscriptions listing his gifts.",
    lookCloser:
      "Inside the circumambulatory passage survive rare Chola frescoes, hidden for centuries beneath later Nayaka paintings.",
  },
  {
    id: "hoysala-saraswati",
    eraId: "chola",
    title: "Dancing Saraswati, Hoysaleswara Temple",
    dateLabel: "c. 1150 CE",
    year: 1150,
    medium: "Sculpture",
    material: "Chloritic schist (soapstone)",
    location: "Halebidu, Karnataka",
    aspect: "portrait",
    image: commons("1150 CE Hoysaleswara temple Halebidu Karnataka, Dancing Saraswati.jpg"),
    imageAlt:
      "Intricately carved soapstone relief of the goddess Saraswati dancing, with multiple arms and elaborate lace-like ornaments.",
    source: commonsPage("1150 CE Hoysaleswara temple Halebidu Karnataka, Dancing Saraswati.jpg"),
    description:
      "The Hoysala sculptors of Karnataka carved soft soapstone with the precision of jewellers. Here Saraswati, goddess of knowledge and the arts, dances with a manuscript and lute among her many hands.",
    significance:
      "Hoysala art marks the extreme of ornamental density in Indian sculpture — surfaces pierced, undercut and layered until stone resembles filigree.",
    lookCloser:
      "The stone hardens on exposure to air, which is why detail as fine as individual beads and fingernails has survived nine centuries outdoors.",
  },
  {
    id: "konark-wheel",
    eraId: "chola",
    title: "Chariot Wheel, Sun Temple of Konark",
    dateLabel: "c. 1250 CE",
    year: 1250,
    medium: "Architecture",
    material: "Khondalite stone · wheel 3 m diameter",
    location: "Konark, Odisha",
    aspect: "landscape",
    image: commons("Konark Sun Temple Wheel.jpg"),
    imageAlt:
      "A giant carved stone wheel with intricately decorated spokes and hub, set against the wall of the Konark Sun Temple.",
    source: commonsPage("Konark Sun Temple Wheel.jpg"),
    description:
      "King Narasimhadeva I of the Eastern Ganga dynasty conceived the temple as the chariot of the sun god Surya, drawn by seven horses on twenty-four wheels. Each wheel has eight major and eight minor spokes carved with medallions.",
    significance:
      "The wheel became one of India's most recognisable images, appearing on the ten-rupee note — and it functions as a sundial: the shadow of the spokes tells the time.",
    lookCloser:
      "The medallions between spokes depict the hours of a day — a woman waking, bathing, dressing — so that time itself is carved into the timekeeper.",
  },

  // VII — Sultanate & Vijayanagara
  {
    id: "qutb-minar",
    eraId: "sultanate",
    title: "Qutb Minar",
    dateLabel: "1199 – 1220 CE",
    year: 1200,
    medium: "Architecture",
    material: "Red sandstone and marble · 72.5 m",
    location: "Mehrauli, Delhi",
    aspect: "portrait",
    image: commons("Qutb Minar 2011.jpg"),
    imageAlt:
      "A tall tapering red sandstone minaret with fluted storeys and projecting balconies rising against the sky.",
    source: commonsPage("Qutb Minar 2011.jpg"),
    description:
      "Begun by Qutb-ud-din Aibak and completed by Iltutmish, the minaret rises in five tapering storeys, alternately fluted and angular, with bands of Quranic calligraphy and lotus motifs carved by Indian masons.",
    significance:
      "The founding monument of Indo-Islamic architecture and the tallest brick minaret in the world: Persianate form realised through local hands and stone.",
    lookCloser:
      "In the courtyard stands the 4th-century Iron Pillar, a Gupta-era marvel of metallurgy that has never rusted — an older India embedded in the new.",
  },
  {
    id: "hampi-chariot",
    eraId: "sultanate",
    title: "Stone Chariot, Vittala Temple",
    dateLabel: "16th century CE",
    year: 1530,
    medium: "Architecture",
    material: "Granite, built from fitted blocks",
    location: "Hampi, Karnataka",
    aspect: "landscape",
    image: commons("Stone chariot Hampi.jpg"),
    imageAlt:
      "A shrine in the form of an ornate stone chariot with large carved wheels, in the courtyard of a granite temple.",
    source: commonsPage("Stone chariot Hampi.jpg"),
    description:
      "A shrine to Garuda in the form of a temple chariot, built under the Vijayanagara emperor Krishnadevaraya. Its wheels once turned; its body is assembled from granite blocks joined so tightly it reads as a monolith.",
    significance:
      "An emblem of Vijayanagara — the last great Hindu empire of the south — whose capital, Hampi, was one of the largest cities on earth in 1500.",
    lookCloser:
      "Traces of pigment survive in the recesses: the chariot was once painted in bright mineral colour, as were most Indian stone temples.",
  },
  {
    id: "meenakshi-gopuram",
    eraId: "sultanate",
    title: "Gopuram, Meenakshi Amman Temple",
    dateLabel: "c. 1560 – 1650 CE",
    year: 1600,
    medium: "Architecture",
    material: "Brick and stucco, painted · up to 52 m",
    location: "Madurai, Tamil Nadu",
    aspect: "portrait",
    image: commons("Madurai Meenakshi temple gopuram.jpg"),
    imageAlt:
      "A towering pyramidal temple gateway covered in thousands of brightly painted stucco figures of gods and mythical beings.",
    source: commonsPage("Madurai Meenakshi temple gopuram.jpg"),
    description:
      "Under the Nayaka rulers of Madurai, the ancient temple of the fish-eyed goddess acquired fourteen gateway towers swarming with an estimated 33,000 stucco figures, repainted every twelve years.",
    significance:
      "The gopuram inverts temple logic: the gateway, not the sanctum, becomes the tallest and most visible element — a city landmark for pilgrims.",
    lookCloser:
      "Each storey repeats the pavilions of the one below at smaller scale, so the tower seems to recede into the sky through sheer repetition.",
  },

  // VIII — Mughal
  {
    id: "akbar-hawai",
    eraId: "mughal",
    title: "Akbar Tames the Elephant Hawa'i",
    dateLabel: "c. 1590 – 1595 CE",
    year: 1590,
    medium: "Painting",
    material: "Opaque watercolour and gold on paper · Akbarnama",
    location: "Victoria and Albert Museum, London",
    aspect: "portrait",
    image: commons(
      "1561-Akbar riding the elephant Hawa'I pursuing another elephant across a collapsing bridge of boats (right).jpg",
    ),
    imageAlt:
      "Vivid miniature of the young emperor Akbar riding a rampaging elephant across a bridge of boats that collapses beneath it, crowds in turmoil.",
    source: commonsPage(
      "1561-Akbar riding the elephant Hawa'I pursuing another elephant across a collapsing bridge of boats (right).jpg",
    ),
    description:
      "Designed by Basawan and painted by Chetar, this page from Akbar's official chronicle shows the 19-year-old emperor mounting the notoriously wild elephant Hawa'i and driving it across a pontoon bridge that buckles under the weight.",
    significance:
      "Akbar's studio of over a hundred artists invented a Mughal style: Persian composition energised by Indian colour and a new appetite for drama and observed detail.",
    lookCloser:
      "Boatmen tumble into the Yamuna, ropes snap, and each face in the crowd reacts differently — an early instance of individualised portraiture within a crowd scene.",
  },
  {
    id: "jahangir-sufi",
    eraId: "mughal",
    title: "Jahangir Preferring a Sufi Shaikh to Kings",
    dateLabel: "c. 1615 – 1618 CE",
    year: 1616,
    medium: "Painting",
    material: "Opaque watercolour, gold and ink on paper · by Bichitr",
    location: "Freer Gallery of Art, Washington DC",
    aspect: "portrait",
    image: commons(
      "Bichitr - Jahangir Preferring a Sufi Shaikh to Kings, from the St. Petersburg album - Google Art Project.jpg",
    ),
    imageAlt:
      "Miniature of Emperor Jahangir seated on an hourglass throne within a radiant sun-and-moon halo, handing a book to a Sufi while kings wait below.",
    source: commonsPage(
      "Bichitr - Jahangir Preferring a Sufi Shaikh to Kings, from the St. Petersburg album - Google Art Project.jpg",
    ),
    description:
      "Jahangir sits on an hourglass throne, haloed by a blazing sun and crescent moon, presenting a book to a Sufi saint while the Ottoman Sultan, King James I of England and the artist himself wait their turn below.",
    significance:
      "The defining allegorical portrait of the Mughal age — a manifesto of spiritual over worldly power that also displays Bichitr's mastery of European techniques.",
    lookCloser:
      "Cherubs at the top write 'O Shah, may the span of your life be a thousand years' on the hourglass, while another two hide their faces from the emperor's radiance.",
  },
  {
    id: "taj-mahal",
    eraId: "mughal",
    title: "Taj Mahal",
    dateLabel: "1632 – 1653 CE",
    year: 1643,
    medium: "Architecture",
    material: "Makrana marble with pietra dura inlay · 73 m",
    location: "Agra, Uttar Pradesh",
    aspect: "landscape",
    image: commons("Taj Mahal, Agra, India edit3.jpg"),
    imageAlt:
      "The white marble Taj Mahal with its central dome and four minarets reflected in a long pool, framed by gardens.",
    source: commonsPage("Taj Mahal, Agra, India edit3.jpg"),
    description:
      "Shah Jahan's mausoleum for his wife Mumtaz Mahal took some 20,000 workers two decades to build. Marble from Rajasthan, jasper from Punjab, jade from China and lapis from Afghanistan were inlaid into flowers of extraordinary delicacy.",
    significance:
      "The most perfect expression of Mughal architecture's search for symmetry, proportion and light; the dome changes colour from dawn to moonlight.",
    lookCloser:
      "The calligraphy of Quranic verses around the great arch grows larger as it rises, so that from the ground every letter appears the same size.",
  },

  // IX — Rajput & Pahari
  {
    id: "bani-thani",
    eraId: "rajput",
    title: "Bani Thani (Radha)",
    dateLabel: "c. 1750 CE",
    year: 1750,
    medium: "Painting",
    material: "Opaque watercolour on paper · attributed to Nihal Chand",
    location: "National Museum, New Delhi",
    aspect: "portrait",
    image: commons("4 Radha (Bani Thani), Kishangarh, ca. 1750, National Museum New Delhi.jpg"),
    imageAlt:
      "Profile portrait of a woman with an elongated face, arched brows, lotus-petal eyes and a sharp nose, holding two lotus buds beneath a veil.",
    source: commonsPage("4 Radha (Bani Thani), Kishangarh, ca. 1750, National Museum New Delhi.jpg"),
    description:
      "The 'Lady of Fashion' — a poet and singer at the Kishangarh court, beloved of the prince Sawant Singh — is transfigured into Radha. Her face is stretched into a mannerist ideal: swept-back eyes, arched brows, a pointed chin.",
    significance:
      "Often called the 'Indian Mona Lisa', the image defines the Kishangarh school and shows Rajput painting departing decisively from Mughal naturalism.",
    lookCloser:
      "A single stray curl escapes her veil, and her lips are barely parted — the painter renders a devotional ideal as a specific, breathing person.",
  },
  {
    id: "radha-holi",
    eraId: "rajput",
    title: "Radha Celebrating Holi",
    dateLabel: "c. 1788 CE",
    year: 1788,
    medium: "Painting",
    material: "Opaque watercolour and gold on paper · Kangra school",
    location: "Pahari (Kangra), Himachal Pradesh",
    aspect: "landscape",
    image: commons("Radha celebrating Holi, c1788.jpg"),
    imageAlt:
      "Colourful miniature of Radha and companions playing Holi in a courtyard, throwing coloured powder as Krishna approaches.",
    source: commonsPage("Radha celebrating Holi, c1788.jpg"),
    description:
      "In the Kangra valley under Raja Sansar Chand, painters developed a style of tender naturalism: soft palettes, flowing line and landscapes of rolling hills. Here the spring festival becomes a scene of divine play.",
    significance:
      "Kangra painting is the last great flowering of the Indian miniature tradition, translating the bhakti poetry of Jayadeva and Keshavdas into images.",
    lookCloser:
      "The coloured powder is rendered as fine flecks over the paper; the women's diaphanous dupattas are painted with a single hair of a brush.",
  },
  {
    id: "radha-krishna-mirror",
    eraId: "rajput",
    title: "Krishna and Radha Looking into a Mirror",
    dateLabel: "c. 1800 CE",
    year: 1800,
    medium: "Painting",
    material: "Opaque watercolour and gold on paper · Pahari",
    location: "National Museum, New Delhi",
    aspect: "portrait",
    image: commons("Krishna and Radha looking into a mirror. - Google Art Project.jpg"),
    imageAlt:
      "Krishna holds a mirror for Radha as they sit closely together in an intimate pavilion, both gazing at their shared reflection.",
    source: commonsPage("Krishna and Radha looking into a mirror. - Google Art Project.jpg"),
    description:
      "An intimate moment: Krishna holds up a mirror so Radha may see herself — or so both may see themselves as one. Pahari painters excelled at such quiet interiors, where the mood (rasa) matters more than the event.",
    significance:
      "Illustrates the Pahari ideal of shringara rasa, the aesthetic of love, and the way devotion was expressed through domestic tenderness.",
    lookCloser:
      "The mirror's frame is real gold leaf, burnished so it catches the light exactly as a mirror would when the page is tilted.",
  },
  {
    id: "tanjore-painting",
    eraId: "rajput",
    title: "Tanjore Painting",
    dateLabel: "18th – 19th century CE",
    year: 1820,
    medium: "Painting",
    material: "Gesso, gold leaf and glass on cloth-covered wood",
    location: "Thanjavur, Tamil Nadu",
    aspect: "portrait",
    image: commons("Tanjore painting.jpg"),
    imageAlt:
      "A richly gilded devotional painting with raised gold ornament and inset stones, depicting a deity in a jewelled frame.",
    source: commonsPage("Tanjore painting.jpg"),
    description:
      "Under the Maratha rulers of Thanjavur, a distinctive panel painting evolved: deities built up with gesso relief, covered in gold leaf and studded with glass gems, glowing in the lamplight of household shrines.",
    significance:
      "A southern counterpart to the courtly miniature — art as an object of worship, where preciousness of surface signals sanctity.",
    lookCloser:
      "The gold is applied over raised gesso so that arches, jewels and garments physically stand off the surface, catching flame-light in a dark room.",
  },

  // X — Colonial & Modern
  {
    id: "kalighat-kohl",
    eraId: "modern",
    title: "Bengali Lady Applying Kohl",
    dateLabel: "c. 1875 CE",
    year: 1875,
    medium: "Painting",
    material: "Watercolour on mill-made paper · Kalighat",
    location: "Kolkata, West Bengal",
    aspect: "portrait",
    image: commons("Bengali Lady applying Kohl, Kalighat Painting.jpg"),
    imageAlt:
      "Bold, simplified watercolour of a woman with large eyes applying kohl with a stick, rendered in sweeping curves.",
    source: commonsPage("Bengali Lady applying Kohl, Kalighat Painting.jpg"),
    description:
      "Patuas (scroll painters) who settled near Kolkata's Kali temple produced quick, cheap souvenirs for pilgrims: gods, but also fashionable women, dandies and scandals of the colonial city, in sweeping brush-strokes.",
    significance:
      "Kalighat is the first urban popular art of modern India, and its bold flat forms later influenced Jamini Roy and, some argue, Fernand Léger.",
    lookCloser:
      "The shading is a single confident band of darker wash along each contour — a shorthand that lets a painter finish an image in minutes.",
  },
  {
    id: "shakuntala",
    eraId: "modern",
    title: "Shakuntala",
    dateLabel: "1870 CE",
    year: 1870,
    medium: "Painting",
    material: "Oil on canvas · Raja Ravi Varma",
    location: "Sree Chitra Art Gallery, Thiruvananthapuram",
    aspect: "landscape",
    image: commons("Ravi Varma-Shakuntala.jpg"),
    imageAlt:
      "Academic oil painting of a woman in a sari pretending to remove a thorn from her foot while glancing back over her shoulder, companions beside her.",
    source: commonsPage("Ravi Varma-Shakuntala.jpg"),
    description:
      "Ravi Varma painted Kalidasa's heroine pretending to remove a thorn so she can glance back at King Dushyanta. European oil technique and perspective are applied to a Sanskrit classic, dressed in the sari of his native Kerala.",
    significance:
      "Through his oleograph press, Ravi Varma's images of gods and heroines entered millions of homes and shaped how modern India pictures its own mythology.",
    lookCloser:
      "The over-the-shoulder glance is a pose lifted from European salon painting, yet the drapery and jewellery are observed with an ethnographer's exactness.",
  },
  {
    id: "bharat-mata",
    eraId: "modern",
    title: "Bharat Mata",
    dateLabel: "1905 CE",
    year: 1905,
    medium: "Painting",
    material: "Watercolour wash on paper · Abanindranath Tagore",
    location: "Victoria Memorial Hall, Kolkata",
    aspect: "portrait",
    image: commons("Bharat Mata by Abanindranath Tagore.jpg"),
    imageAlt:
      "Soft watercolour of a four-armed saffron-robed woman with a halo, holding a book, sheaves of paddy, cloth and a rosary.",
    source: commonsPage("Bharat Mata by Abanindranath Tagore.jpg"),
    description:
      "Painted during the Swadeshi movement against the partition of Bengal, the four-armed 'Mother India' offers food, clothing, learning and spiritual knowledge. Abanindranath's misty wash technique drew on Mughal and Japanese sources.",
    significance:
      "The founding image of the Bengal School, which rejected academic realism in search of an 'Indian' modern art — and an icon of the freedom movement.",
    lookCloser:
      "Her halo is barely there, a faint glow rather than a gilded disc — nationalism imagined as gentleness rather than force.",
  },
  {
    id: "shergil-self",
    eraId: "modern",
    title: "Self-Portrait",
    dateLabel: "c. 1930 CE",
    year: 1930,
    medium: "Painting",
    material: "Oil on canvas · Amrita Sher-Gil",
    location: "Private collection",
    aspect: "portrait",
    image: commons("Amrita Sher-Gil Self-portrait.jpg"),
    imageAlt:
      "Expressive oil self-portrait of a young woman with dark hair and a direct gaze, painted in warm, loose brushwork.",
    source: commonsPage("Amrita Sher-Gil Self-portrait.jpg"),
    description:
      "Born in Budapest to a Sikh father and Hungarian mother, Sher-Gil trained in Paris and returned to India in 1934. Her self-portraits confront the viewer with an unsettling directness, fusing Post-Impressionist colour with the frontality of Ajanta.",
    significance:
      "India's first modernist, she died at 28 having redirected Indian painting toward the lives of ordinary people; her works are declared National Art Treasures.",
    lookCloser:
      "The brushwork is loose and quick, yet the eyes are fixed with almost sculptural precision — she looks at herself as unsparingly as she would later paint villagers.",
  },

  // XI — Living Traditions
  {
    id: "madhubani",
    eraId: "living",
    title: "Madhubani (Mithila) Painting",
    dateLabel: "Ancient tradition · painted on paper since 1960s",
    year: 1970,
    medium: "Painting",
    material: "Natural pigments on handmade paper, once on mud walls",
    location: "Mithila region, Bihar",
    aspect: "landscape",
    image: commons("Madhubani painting.jpg"),
    imageAlt:
      "Densely patterned folk painting in bright colours with black outlines, filled with figures, fish, birds and geometric borders.",
    source: commonsPage("Madhubani painting.jpg"),
    description:
      "Women of Mithila have painted their walls for weddings and festivals for centuries, filling every space with fish, peacocks, lotus and deities. After a 1960s drought, artists like Sita Devi and Ganga Devi transferred the art to paper for sale.",
    significance:
      "A living tradition possibly linked to the epic Ramayana's Mithila, now recognised worldwide and practised by a growing community of women artists.",
    lookCloser:
      "There is no empty space — the horror vacui is deliberate, since every filled surface is considered auspicious.",
  },
  {
    id: "warli",
    eraId: "living",
    title: "Warli Painting",
    dateLabel: "Ancient tradition · on canvas since 1970s",
    year: 1975,
    medium: "Painting",
    material: "Rice paste on red ochre or cow-dung ground",
    location: "Palghar district, Maharashtra",
    aspect: "landscape",
    image: commons("Warli painting.jpg"),
    imageAlt:
      "White stick-like figures drawn from triangles and circles dancing in a spiral on a red-brown ground.",
    source: commonsPage("Warli painting.jpg"),
    description:
      "The Warli tribe paints in white rice paste on earth-coloured walls, building humans from two triangles and animals from a few lines. The spiral 'tarpa' dance, the harvest and the marriage goddess Palaghata are favourite themes.",
    significance:
      "Its geometry resembles the earliest rock art of Bhimbetka — the timeline's end echoes its beginning. Jivya Soma Mashe carried it to galleries worldwide.",
    lookCloser:
      "Follow the spiral of dancers: it has no start or finish, a picture of time itself as endless circling.",
  },
];

export const artifactsByEra = (eraId: string) =>
  artifacts.filter((a) => a.eraId === eraId);

export const eraById = (id: string) => eras.find((e) => e.id === id)!;

export const mediums: Medium[] = ["Sculpture", "Painting", "Architecture", "Object"];
