export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "auto-moto",
    name: "Auto & Moto",
    icon: "🚗",
    subcategories: [
      { slug: "automobili", name: "Automobili" },
      { slug: "moto-scooter", name: "Moto & Scooter" },
      { slug: "veicoli-commerciali", name: "Veicoli commerciali" },
      { slug: "camper-roulotte", name: "Camper & Roulotte" },
      { slug: "ricambi-accessori", name: "Ricambi & Accessori" },
      { slug: "pneumatici-cerchi", name: "Pneumatici & Cerchi" },
    ],
  },
  {
    slug: "elettronica",
    name: "Elettronica",
    icon: "📱",
    subcategories: [
      { slug: "smartphone", name: "Smartphone" },
      { slug: "computer-tablet", name: "Computer & Tablet" },
      { slug: "tv-audio", name: "TV, Audio & HiFi" },
      { slug: "foto-video", name: "Foto & Video" },
      { slug: "console-videogiochi", name: "Console & Videogiochi" },
      { slug: "elettrodomestici", name: "Elettrodomestici" },
    ],
  },
  {
    slug: "casa-giardino",
    name: "Casa & Giardino",
    icon: "🏡",
    subcategories: [
      { slug: "mobili", name: "Mobili" },
      { slug: "arredamento-decorazione", name: "Arredamento & Decorazione" },
      { slug: "giardino-balcone", name: "Giardino & Balcone" },
      { slug: "cucina-casalinghi", name: "Cucina & Casalinghi" },
      { slug: "bricolage-utensili", name: "Bricolage & Utensili" },
    ],
  },
  {
    slug: "abbigliamento",
    name: "Abbigliamento & Accessori",
    icon: "👕",
    subcategories: [
      { slug: "donna", name: "Donna" },
      { slug: "uomo", name: "Uomo" },
      { slug: "abbigliamento-bambini", name: "Bambini" },
      { slug: "scarpe", name: "Scarpe" },
      { slug: "borse-accessori", name: "Borse & Accessori" },
      { slug: "orologi-gioielli", name: "Orologi & Gioielli" },
    ],
  },
  {
    slug: "sport-tempo-libero",
    name: "Sport & Tempo libero",
    icon: "⚽",
    subcategories: [
      { slug: "biciclette", name: "Biciclette & E-bike" },
      { slug: "fitness", name: "Fitness & Palestra" },
      { slug: "sport-invernali", name: "Sport invernali" },
      { slug: "sport-acquatici", name: "Sport acquatici" },
      { slug: "campeggio-outdoor", name: "Campeggio & Outdoor" },
    ],
  },
  {
    slug: "bambini",
    name: "Bambini & Neonati",
    icon: "🧸",
    subcategories: [
      { slug: "passeggini-seggiolini", name: "Passeggini & Seggiolini auto" },
      { slug: "giocattoli", name: "Giocattoli" },
      { slug: "abbigliamento-neonato", name: "Abbigliamento neonato" },
      { slug: "mobili-bambini", name: "Mobili per bambini" },
    ],
  },
  {
    slug: "animali",
    name: "Animali",
    icon: "🐾",
    subcategories: [
      { slug: "cani", name: "Cani & Accessori" },
      { slug: "gatti", name: "Gatti & Accessori" },
      { slug: "altri-animali", name: "Altri animali" },
      { slug: "mangimi-accessori", name: "Mangimi & Accessori" },
    ],
  },
  {
    slug: "musica-film-libri",
    name: "Musica, Film & Libri",
    icon: "🎸",
    subcategories: [
      { slug: "libri", name: "Libri" },
      { slug: "musica-cd-vinili", name: "Musica: CD & Vinili" },
      { slug: "film-serie-tv", name: "Film & Serie TV" },
      { slug: "strumenti-musicali", name: "Strumenti musicali" },
    ],
  },
  {
    slug: "collezionismo",
    name: "Collezionismo & Antiquariato",
    icon: "🏺",
    subcategories: [
      { slug: "francobolli", name: "Francobolli" },
      { slug: "monete", name: "Monete & Banconote" },
      { slug: "antiquariato", name: "Antiquariato" },
      { slug: "modellismo", name: "Modellismo" },
      { slug: "arte", name: "Arte" },
    ],
  },
  {
    slug: "informatica",
    name: "Informatica",
    icon: "💻",
    subcategories: [
      { slug: "laptop", name: "Laptop & Notebook" },
      { slug: "desktop", name: "Computer desktop" },
      { slug: "componenti", name: "Componenti & Hardware" },
      { slug: "periferiche-reti", name: "Periferiche & Reti" },
      { slug: "software", name: "Software & Licenze" },
    ],
  },
  {
    slug: "immobili",
    name: "Immobili",
    icon: "🏢",
    subcategories: [
      { slug: "appartamenti-vendita", name: "Appartamenti in vendita" },
      { slug: "appartamenti-affitto", name: "Appartamenti in affitto" },
      { slug: "case", name: "Case" },
      { slug: "uffici-locali", name: "Uffici & Locali commerciali" },
      { slug: "garage-posti-auto", name: "Garage & Posti auto" },
      { slug: "terreni", name: "Terreni" },
    ],
  },
  {
    slug: "lavoro-servizi",
    name: "Lavoro & Servizi",
    icon: "🛠️",
    subcategories: [
      { slug: "offerte-lavoro", name: "Offerte di lavoro" },
      { slug: "servizi-casa", name: "Servizi per la casa" },
      { slug: "lezioni-private", name: "Lezioni private" },
      { slug: "traslochi", name: "Traslochi & Trasporti" },
      { slug: "eventi", name: "Eventi & Feste" },
    ],
  },
  {
    slug: "altro",
    name: "Altro",
    icon: "📦",
    subcategories: [
      { slug: "varie", name: "Varie" },
      { slug: "biglietti", name: "Biglietti & Eventi" },
      { slug: "buoni-sconto", name: "Buoni & Voucher" },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategory(
  categorySlug: string,
  subSlug: string
): Subcategory | undefined {
  return getCategory(categorySlug)?.subcategories.find((s) => s.slug === subSlug);
}

export function getSubcategoryName(categorySlug: string, subSlug: string): string {
  return getSubcategory(categorySlug, subSlug)?.name ?? subSlug;
}

export const CONDITIONS = [
  { value: "nuovo", label: "Nuovo" },
  { value: "come-nuovo", label: "Come nuovo" },
  { value: "usato", label: "Usato" },
  { value: "difettoso", label: "Difettoso / per pezzi di ricambio" },
] as const;

export function getConditionLabel(value: string): string {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}

// ---------- Campi specifici veicoli (categoria auto-moto) ----------

export const FUEL_TYPES = [
  { value: "benzina", label: "Benzina" },
  { value: "diesel", label: "Diesel" },
  { value: "elettrico", label: "Elettrico" },
  { value: "ibrido", label: "Ibrido" },
  { value: "gpl-metano", label: "GPL / Metano" },
] as const;

export function getFuelTypeLabel(value: string): string {
  return FUEL_TYPES.find((f) => f.value === value)?.label ?? value;
}

export const TRANSMISSIONS = [
  { value: "manuale", label: "Manuale" },
  { value: "automatico", label: "Automatico" },
] as const;

export function getTransmissionLabel(value: string): string {
  return TRANSMISSIONS.find((t) => t.value === value)?.label ?? value;
}

/** Marche comuni suggerite nel form (elenco non esaustivo, l'utente può digitarne altre). */
export const VEHICLE_BRANDS = [
  "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Jeep", "Kia", "Mercedes-Benz", "Mini", "Nissan", "Opel", "Peugeot",
  "Porsche", "Renault", "Seat", "Škoda", "Subaru", "Suzuki", "Tesla",
  "Toyota", "Volkswagen", "Volvo",
  "Aprilia", "Ducati", "Harley-Davidson", "Kawasaki", "KTM", "Piaggio",
  "Suzuki Moto", "Vespa", "Yamaha",
] as const;
