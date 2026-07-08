"use client";

import { useActionState, useState } from "react";
import { createListingAction, type ActionState } from "@/lib/actions";
import {
  CATEGORIES,
  CONDITIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_BRANDS,
  getCategory,
} from "@/lib/categories";
import { CANTONS } from "@/lib/cantons";
import CategoryIcon from "@/components/CategoryIcon";

const VEHICLE_CATEGORY = "auto-moto";
const CURRENT_YEAR = new Date().getFullYear();

function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <h2 className="mb-5 flex items-baseline gap-3">
      <span className="font-display text-2xl font-black text-swiss">{n}</span>
      <span className="display text-lg">{title}</span>
    </h2>
  );
}

export default function ListingForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createListingAction,
    undefined
  );
  const [priceMode, setPriceMode] = useState<"fixed" | "free" | "negotiable">("fixed");
  const [previews, setPreviews] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const categoryDef = getCategory(category);
  const isVehicle = category === VEHICLE_CATEGORY;

  function onCategoryChange(slug: string) {
    setCategory(slug);
    setSubcategory("");
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form action={formAction} className="animate-rise space-y-5">
      <div className="card p-6 sm:p-7">
        <StepHeading n="01" title="Cosa vendi?" />
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
              <div className="relative">
                {category && (
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50">
                    <CategoryIcon slug={category} className="h-4.5 w-4.5" />
                  </span>
                )}
                <select
                  id="category"
                  name="category"
                  required
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className={`input ${category ? "pl-10" : ""}`}
                >
                  <option value="">Seleziona…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="subcategory" className="label">
                Sottocategoria
              </label>
              <select
                id="subcategory"
                name="subcategory"
                required
                disabled={!categoryDef}
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="input disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  {categoryDef ? "Seleziona…" : "Scegli prima una categoria"}
                </option>
                {categoryDef?.subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="condition" className="label">
              Condizione
            </label>
            <select id="condition" name="condition" defaultValue="usato" className="input max-w-64">
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isVehicle && (
        <div className="card border-swiss/30 p-6 sm:p-7">
          <StepHeading n="02" title="Dettagli del veicolo" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="brand" className="label">
                Marca
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                required={isVehicle}
                list="vehicle-brands"
                placeholder="Es. Volkswagen"
                className="input"
              />
              <datalist id="vehicle-brands">
                {VEHICLE_BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="model" className="label">
                Modello
              </label>
              <input
                id="model"
                name="model"
                type="text"
                required={isVehicle}
                placeholder="Es. Golf 8 GTI"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="year" className="label">
                Anno immatricolazione
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min={1950}
                max={CURRENT_YEAR + 1}
                placeholder={String(CURRENT_YEAR)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="mileageKm" className="label">
                Chilometraggio (km)
              </label>
              <input
                id="mileageKm"
                name="mileageKm"
                type="number"
                min={0}
                placeholder="Es. 45000"
                className="input"
              />
            </div>
            <div>
              <label htmlFor="fuelType" className="label">
                Alimentazione
              </label>
              <select id="fuelType" name="fuelType" defaultValue="" className="input">
                <option value="">Non specificato</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transmission" className="label">
                Cambio
              </label>
              <select id="transmission" name="transmission" defaultValue="" className="input">
                <option value="">Non specificato</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="powerHp" className="label">
                Potenza (CV)
              </label>
              <input
                id="powerHp"
                name="powerHp"
                type="number"
                min={1}
                max={5000}
                placeholder="Es. 245"
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 sm:p-7">
        <StepHeading n={isVehicle ? "03" : "02"} title="Prezzo" />
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
              className={`cursor-pointer rounded-full border-2 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition ${
                priceMode === opt.value
                  ? "border-swiss bg-swiss text-white"
                  : "border-ink/20 bg-white text-ink/60 hover:border-ink/40"
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
        <StepHeading n={isVehicle ? "04" : "03"} title="Dove si trova?" />
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
              Città <span className="font-normal normal-case tracking-normal text-ash">(facoltativo)</span>
            </label>
            <input id="city" name="city" type="text" placeholder="Es. Lugano" className="input" />
          </div>
        </div>
      </div>

      <div className="card p-6 sm:p-7">
        <StepHeading n={isVehicle ? "05" : "04"} title="Foto" />
        <p className="-mt-3 mb-5 text-sm text-ash">
          Fino a 5 foto (JPG, PNG o WebP, max 5 MB ciascuna). Gli annunci con foto
          ricevono molti più contatti!
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/25 bg-smoke/60 px-6 py-10 text-center transition hover:border-swiss hover:bg-swiss/5">
          <span className="font-display text-sm font-bold uppercase tracking-wide text-ink">
            Clicca per scegliere le foto
          </span>
          <span className="text-xs text-ash">o trascinale qui</span>
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
                className="h-20 w-24 rounded-lg border border-ink/12 object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {state?.error && (
        <p className="rounded-lg border border-swiss/25 bg-swiss/5 px-4 py-3 text-sm font-medium text-swiss-deep">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-swiss w-full !py-4 text-base sm:w-auto sm:px-14">
        {pending ? "Pubblicazione in corso…" : "Pubblica annuncio gratis"}
      </button>
    </form>
  );
}
