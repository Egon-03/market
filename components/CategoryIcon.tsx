/**
 * Icone di categoria disegnate su misura: tratto uniforme 1.8, griglia 24px.
 * Sostituiscono le emoji per un'interfaccia coerente con l'identità tipografica.
 */

type Props = { slug: string; className?: string };

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PATHS: Record<string, React.ReactNode> = {
  "auto-moto": (
    <>
      <path d="M4 16v-4l2-5h12l2 5v4" />
      <path d="M4 12h16" />
      <circle cx="7.5" cy="16" r="2" />
      <circle cx="16.5" cy="16" r="2" />
      <path d="M4 16h1.5M9.5 16h5M18.5 16H20" />
    </>
  ),
  elettronica: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M10.5 5.5h3" />
      <circle cx="12" cy="18" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  "casa-giardino": (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  abbigliamento: (
    <>
      <path d="m8 4-4.5 3.5L6 10.5 8 9v11h8V9l2 1.5 2.5-3L16 4a4 4 0 0 1-8 0Z" />
    </>
  ),
  "sport-tempo-libero": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5c2.5 2.2 4 5.2 4 8.5s-1.5 6.3-4 8.5c-2.5-2.2-4-5.2-4-8.5s1.5-6.3 4-8.5Z" />
      <path d="M3.8 9.5h16.4M3.8 14.5h16.4" />
    </>
  ),
  bambini: (
    <>
      <circle cx="12" cy="8" r="4.5" />
      <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M10.2 7.4c0-.5.8-.9 1.8-.9s1.8.4 1.8.9" />
      <circle cx="10.3" cy="9.3" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13.7" cy="9.3" r="0.5" fill="currentColor" stroke="none" />
    </>
  ),
  animali: (
    <>
      <ellipse cx="12" cy="16.5" rx="4" ry="3.2" />
      <ellipse cx="6" cy="11" rx="1.8" ry="2.4" transform="rotate(-15 6 11)" />
      <ellipse cx="10" cy="7.5" rx="1.8" ry="2.4" transform="rotate(-5 10 7.5)" />
      <ellipse cx="14" cy="7.5" rx="1.8" ry="2.4" transform="rotate(5 14 7.5)" />
      <ellipse cx="18" cy="11" rx="1.8" ry="2.4" transform="rotate(15 18 11)" />
    </>
  ),
  "musica-film-libri": (
    <>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  collezionismo: (
    <>
      <path d="M9 3h6l1 3c0 2-1.2 3-2.5 3.8-.4.2-.5.6-.5 1v1.2h-2v-1.2c0-.4-.1-.8-.5-1C9.2 9 8 8 8 6l1-3Z" />
      <path d="M10.5 12h3l1.5 6c.3 1.5-1 3-3 3s-3.3-1.5-3-3l1.5-6Z" />
      <path d="M8 3h8" />
    </>
  ),
  informatica: (
    <>
      <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
      <path d="M2 19h20" />
      <path d="M10 19h4" />
    </>
  ),
  immobili: (
    <>
      <path d="M5 21V5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 15 5v16" />
      <path d="M15 9h3.5A1.5 1.5 0 0 1 20 10.5V21" />
      <path d="M3 21h18" />
      <path d="M8 7h2M8 10.5h2M8 14h2M17.5 12.5v.01M17.5 16v.01" />
    </>
  ),
  "lavoro-servizi": (
    <>
      <path d="M14.5 6.5a4 4 0 0 1 5-5l-2.7 2.7 1 2.5 2.5 1L23 5a4 4 0 0 1-5 5l-7.5 7.5a4 4 0 0 1-5 5l2.7-2.7-1-2.5-2.5-1L2 19a4 4 0 0 1 5-5l7.5-7.5Z" transform="scale(0.92) translate(1 1)" />
    </>
  ),
  altro: (
    <>
      <path d="M4 8 12 4l8 4v8l-8 4-8-4V8Z" />
      <path d="m4 8 8 4 8-4M12 12v8" />
    </>
  ),
};

export default function CategoryIcon({ slug, className = "h-6 w-6" }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...STROKE} aria-hidden="true">
      {PATHS[slug] ?? PATHS.altro}
    </svg>
  );
}
