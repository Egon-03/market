"use client";

import { useActionState, useState } from "react";
import { createListingAction, type ActionState } from "@/lib/actions";
import { CATEGORIES, CONDITIONS } from "@/lib/categories";
import { CANTONS } from "@/lib/cantons";

export default function ListingForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createListingAction,
    undefined
  );
  const [priceMode, setPriceMode] = useState<"fixed" | "free" | "negotiable">("fixed");
  const [previews, setPreviews] = useState<string[]>([]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Cosa vendi?</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Titolo dell&apos;annuncio
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={5}
              maxLength={100}
              placeholder="Es. Bicicletta da corsa in ottimo stato"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              rows={6}
              placeholder="Descrivi l'articolo: caratteristiche, stato, motivo della vendita…"
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">
                Categoria
              </label>
              <select id="category" name="category" required className={inputClass}>
                <option value="">Seleziona…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="condition" className="mb-1 block text-sm font-medium">
                Condizione
              </label>
              <select id="condition" name="condition" defaultValue="usato" className={inputClass}>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Prezzo</h2>
        <div className="flex flex-wrap gap-4">
          {(
            [
              { value: "fixed", label: "Prezzo fisso" },
              { value: "negotiable", label: "Da concordare" },
              { value: "free", label: "Da regalare" },
            ] as const
          ).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="priceMode"
                value={opt.value}
                checked={priceMode === opt.value}
                onChange={() => setPriceMode(opt.value)}
                className="accent-emerald-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {priceMode === "fixed" && (
          <div className="mt-4 max-w-48">
            <label htmlFor="price" className="mb-1 block text-sm font-medium">
              Prezzo (CHF)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step="0.05"
              required
              placeholder="0.00"
              className={inputClass}
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold">Dove si trova?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="canton" className="mb-1 block text-sm font-medium">
              Cantone
            </label>
            <select id="canton" name="canton" required className={inputClass}>
              <option value="">Seleziona…</option>
              {CANTONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              Città <span className="font-normal text-gray-400">(facoltativo)</span>
            </label>
            <input id="city" name="city" type="text" placeholder="Es. Lugano" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 font-semibold">Foto</h2>
        <p className="mb-4 text-sm text-gray-500">
          Fino a 5 foto (JPG, PNG o WebP, max 5 MB ciascuna). Gli annunci con foto
          ricevono molti più contatti!
        </p>
        <input
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onFilesChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {previews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="Anteprima"
                className="h-20 w-24 rounded-lg border border-gray-200 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {pending ? "Pubblicazione in corso…" : "Pubblica annuncio gratis"}
      </button>
    </form>
  );
}
