"use client";

import Image from "next/image";
import { useState } from "react";
import CategoryIcon from "@/components/CategoryIcon";

type Props = {
  images: string[];
  title: string;
  categorySlug: string;
};

export default function ImageGallery({ images, title, categorySlug }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="card flex aspect-[4/3] items-center justify-center bg-smoke text-ink/15">
        <CategoryIcon slug={categorySlug} className="h-24 w-24" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="card relative aspect-[4/3] overflow-hidden bg-ink/5">
        <Image
          src={images[active]}
          alt={`${title} — foto ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-contain"
          priority
        />
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 font-display text-xs font-bold tabular-nums text-paper backdrop-blur-sm">
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
              className={`relative h-16 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-2 ring-offset-2 transition ${
                i === active
                  ? "ring-swiss"
                  : "ring-transparent opacity-60 hover:opacity-100"
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
