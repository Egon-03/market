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

  return (
    <form action={formAction} className="animate-fade-up space-y-5">
      <div className="card p-6 sm:p-7">
        <h2 className="mb-5 flex items-center gap-2 font-extrabold text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-extrabold text-emerald-700">1</span>
          Cosa vendi?
        </h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="label">
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
              className="input"
            />
          </div>
          <div>
            <label htmlFor="description" className="label">
              Descrizione
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              rows={6}
              placeholder="Descrivi l'articolo: caratteristiche, stato, motivo della vendita…"
              className="input resize-y"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="label">
                Categoria
              </label>
              <select id="category" name="category" required className="input">
                <option value="">Seleziona…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="condition" className="label">
                Condizione
              </label>
              <select id="condition" name="condition" defaultValue="usato" className="input">
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

      <div className="card p-6 sm:p-7">
        <h2 className="mb-5 flex items-center gap-2 font-extrabold text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-extrabold text-emerald-700">2</span>
          Prezzo
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {(
            [
              { value: "fixed", label: "Prezzo fisso" },
              { value: "negotiable", label: "Da concordare" },
              { value: "free", label: "Da regalare" },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${
                priceMode === opt.value
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="priceMode"
                value={opt.value}
                checked={priceMode === opt.value}
                onChange={() => setPriceMode(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {priceMode === "fixed" && (
          <div className="mt-5 max-w-52">
            <label htmlFor="price" className="label">
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
              className="input"
            />
          </div>
        )}
      </div>

      <div className="card p-6 sm:p-7">
        <h2 className="mb-5 flex items-center gap-2 font-extrabold text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-extrabold text-emerald-700">3</span>
          Dove si trova?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="canton" className="label">
              Cantone
            </label>
            <select id="canton" name="canton" required className="input">
              <option value="">Seleziona…</option>
              {CANTONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="label">
              Città <span className="font-normal text-stone-400">(facoltativo)</span>
            </label>
            <input id="city" name="city" type="text" placeholder="Es. Lugano" className="input" />
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-7">
        <h2 className="mb-1 flex items-center gap-2 font-extrabold text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-extrabold text-emerald-700">4</span>
          Foto
        </h2>
        <p className="mb-5 text-sm text-stone-500">
          Fino a 5 foto (JPG, PNG o WebP, max 5 MB ciascuna). Gli annunci con foto
          ricevono molti più contatti!
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
          <span className="text-3xl">📸</span>
          <span className="text-sm font-bold text-stone-700">
            Clicca per scegliere le foto
          </span>
          <span className="text-xs text-stone-400">o trascinale qui</span>
          <input
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onFilesChange}
            className="sr-only"
          />
        </label>
        {previews.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="Anteprima"
                className="h-20 w-24 rounded-xl border border-stone-200 object-cover shadow-sm"
              />
            ))}
          </div>
        )}
      </div>

      {state?.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full !py-3.5 text-base sm:w-auto sm:px-12">
        {pending ? "Pubblicazione in corso…" : "Pubblica annuncio gratis"}
      </button>
    </form>
  );
}
