import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { CANTONS, getCantonName } from "@/lib/cantons";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import { SearchIcon } from "@/components/icons";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  sottocategoria?: string;
  cantone?: string;
  prezzoMin?: string;
  prezzoMax?: string;
  pagina?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.categoria ? getCategory(params.categoria) : undefined;
  const subcategory =
    category && params.sottocategoria
      ? category.subcategories.find((s) => s.slug === params.sottocategoria)
      : undefined;
  const parts: string[] = [];
  if (params.q) parts.push(`"${params.q}"`);
  if (subcategory) parts.push(subcategory.name);
  else if (category) parts.push(category.name);
  if (params.cantone) parts.push(getCantonName(params.cantone));
  const title =
    parts.length > 0 ? `Annunci: ${parts.join(" · ")}` : "Tutti gli annunci";
  return {
    title,
    description: `${title} — annunci gratuiti su Mercatino.ch. Compra e vendi senza commissioni.`,
  };
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categoria = params.categoria ?? "";
  const sottocategoria = params.sottocategoria ?? "";
  const cantone = params.cantone ?? "";
  const prezzoMin = Number(params.prezzoMin);
  const prezzoMax = Number(params.prezzoMax);
  const page = Math.max(1, Number(params.pagina) || 1);
  const activeCategory = categoria ? getCategory(categoria) : undefined;
  const validSub =
    activeCategory && sottocategoria
      ? activeCategory.subcategories.some((s) => s.slug === sottocategoria)
      : false;

  const where: Prisma.ListingWhereInput = { status: "attivo" };
  if (q) {
    where.OR = [{ title: { contains: q } }, { description: { contains: q } }];
  }
  if (categoria) where.category = categoria;
  if (validSub) where.subcategory = sottocategoria;
  if (cantone) where.canton = cantone;
  if (Number.isFinite(prezzoMin) && params.prezzoMin) {
    where.price = { ...(where.price as object), gte: prezzoMin };
  }
  if (Number.isFinite(prezzoMax) && params.prezzoMax) {
    where.price = { ...(where.price as object), lte: prezzoMax };
  }

  const [total, listings] = await Promise.all([
    db.listing.count({ where }),
    db.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(p: number): string {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (categoria) sp.set("categoria", categoria);
    if (validSub) sp.set("sottocategoria", sottocategoria);
    if (cantone) sp.set("cantone", cantone);
    if (params.prezzoMin) sp.set("prezzoMin", params.prezzoMin);
    if (params.prezzoMax) sp.set("prezzoMax", params.prezzoMax);
    if (p > 1) sp.set("pagina", String(p));
    const qs = sp.toString();
    return `/annunci${qs ? `?${qs}` : ""}`;
  }

  const activeSubcategory = validSub
    ? activeCategory?.subcategories.find((s) => s.slug === sottocategoria)
    : undefined;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filtri */}
      <aside className="w-full shrink-0 lg:w-64">
        <form action="/annunci" method="get" className="card space-y-5 p-5">
          <h2 className="display text-lg">Filtri</h2>
          {q && <input type="hidden" name="q" value={q} />}
          <div>
            <label htmlFor="categoria" className="label">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              defaultValue={categoria}
              className="input"
            >
              <option value="">Tutte le categorie</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {activeCategory && (
            <div>
              <label htmlFor="sottocategoria" className="label">
                Sottocategoria
              </label>
              <select
                id="sottocategoria"
                name="sottocategoria"
                defaultValue={validSub ? sottocategoria : ""}
                className="input"
              >
                <option value="">Tutte</option>
                {activeCategory.subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="cantone" className="label">
              Cantone
            </label>
            <select
              id="cantone"
              name="cantone"
              defaultValue={cantone}
              className="input"
            >
              <option value="">Tutta la Svizzera</option>
              {CANTONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="label">Prezzo (CHF)</span>
            <div className="flex gap-2">
              <input
                type="number"
                name="prezzoMin"
                min={0}
                placeholder="Min"
                defaultValue={params.prezzoMin ?? ""}
                className="input"
                aria-label="Prezzo minimo"
              />
              <input
                type="number"
                name="prezzoMax"
                min={0}
                placeholder="Max"
                defaultValue={params.prezzoMax ?? ""}
                className="input"
                aria-label="Prezzo massimo"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            Applica filtri
          </button>
          <Link
            href="/annunci"
            className="block text-center text-xs font-semibold text-ash transition hover:text-ink"
          >
            Azzera filtri
          </Link>
        </form>

        {/* Pubblicità laterale */}
        <AdSlot slot="1000000003" className="mt-4 min-h-60" />
      </aside>

      {/* Risultati */}
      <div className="min-w-0 flex-1">
        <div className="mb-6 border-b border-ink/12 pb-4">
          <h1 className="display text-3xl">
            {activeSubcategory
              ? activeSubcategory.name
              : activeCategory
                ? activeCategory.name
                : q
                  ? `Risultati per “${q}”`
                  : "Tutti gli annunci"}
          </h1>
          <p className="mt-1.5 text-sm tabular-nums text-ash">
            {total} {total === 1 ? "annuncio trovato" : "annunci trovati"}
            {cantone ? ` in ${getCantonName(cantone)}` : ""}
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="card border-dashed p-14 text-center">
            <SearchIcon className="mx-auto h-10 w-10 text-ink/20" />
            <p className="display mt-4 text-xl">Nessun annuncio trovato</p>
            <p className="mt-2 text-sm text-ash">
              Prova a modificare i filtri o{" "}
              <Link href="/pubblica" className="font-bold text-swiss hover:underline">
                pubblica tu il primo annuncio
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {listings.slice(0, 8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
            {listings.length > 8 && (
              <AdSlot slot="1000000004" className="col-span-full min-h-24" />
            )}
            {listings.slice(8).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Paginazione */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Paginazione">
            {page > 1 && (
              <Link href={pageUrl(page - 1)} className="btn-secondary">
                ← Precedente
              </Link>
            )}
            <span className="px-2 text-sm font-semibold tabular-nums text-ash">
              Pagina {page} di {totalPages}
            </span>
            {page < totalPages && (
              <Link href={pageUrl(page + 1)} className="btn-secondary">
                Successiva →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
