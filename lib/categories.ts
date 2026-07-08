export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { slug: "auto-moto", name: "Auto & Moto", icon: "🚗" },
  { slug: "elettronica", name: "Elettronica", icon: "📱" },
  { slug: "casa-giardino", name: "Casa & Giardino", icon: "🏡" },
  { slug: "abbigliamento", name: "Abbigliamento & Accessori", icon: "👕" },
  { slug: "sport-tempo-libero", name: "Sport & Tempo libero", icon: "⚽" },
  { slug: "bambini", name: "Bambini & Neonati", icon: "🧸" },
  { slug: "animali", name: "Animali", icon: "🐾" },
  { slug: "musica-film-libri", name: "Musica, Film & Libri", icon: "🎸" },
  { slug: "collezionismo", name: "Collezionismo & Antiquariato", icon: "🏺" },
  { slug: "informatica", name: "Informatica", icon: "💻" },
  { slug: "immobili", name: "Immobili", icon: "🏢" },
  { slug: "lavoro-servizi", name: "Lavoro & Servizi", icon: "🛠️" },
  { slug: "altro", name: "Altro", icon: "📦" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
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
