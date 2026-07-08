"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  /** ID dello slot AdSense (data-ad-slot). */
  slot: string;
  format?: string;
  className?: string;
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Slot pubblicitario Google AdSense — l'unica fonte di guadagno del sito.
 *
 * Se NEXT_PUBLIC_ADSENSE_CLIENT non è configurato (es. in sviluppo),
 * mostra un segnaposto così il layout resta identico alla produzione.
 */
export default function AdSlot({ slot, format = "auto", className = "" }: Props) {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense non ancora caricato: ignora
    }
  }, []);

  if (!ADSENSE_CLIENT) {
    return (
      <div
        className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-stone-300 bg-stone-100/60 text-stone-400 ${className}`}
        aria-hidden="true"
      >
        <span className="rounded-full border border-stone-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
          Annuncio
        </span>
        <span className="text-xs">Spazio pubblicitario (AdSense slot {slot})</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
