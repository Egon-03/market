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
      <div className={`ad-frame min-h-24 ${className}`} aria-hidden="true">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.3em]">
          Pubblicità
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
