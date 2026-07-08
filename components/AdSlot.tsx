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
        className={`flex min-h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400 ${className}`}
        aria-hidden="true"
      >
        Spazio pubblicitario (AdSense slot {slot})
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
