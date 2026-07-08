"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  title: string;
  fallbackIcon: string;
};

export default function ImageGallery({ images, title, fallbackIcon }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-stone-200/70 bg-gradient-to-br from-stone-100 to-stone-200 text-8xl opacity-70 shadow-inner">
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="card relative aspect-[4/3] overflow-hidden bg-stone-900/5">
        <Image
          src={images[active]}
          alt={`${title} — foto ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-contain"
          priority
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-stone-900/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl ring-2 ring-offset-2 transition ${
                i === active
                  ? "ring-emerald-500"
                  : "ring-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Mostra foto ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
