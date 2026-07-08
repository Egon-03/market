import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { CANTONS, getCantonName } from "@/lib/cantons";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
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
  const parts: string[] = [];
  if (params.q) parts.push(`"${params.q}"`);
  if (category) parts.push(category.name);
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
  const cantone = params.cantone ?? "";
  const prezzoMin = Number(params.prezzoMin);
  const prezzoMax = Number(params.prezzoMax);
  const page = Math.max(1, Number(params.pagina) || 1);

  const where: Prisma.ListingWhereInput = { status: "attivo" };
  if (q) {
    where.OR = [{ title: { contains: q } }, { description: { contains: q } }];
  }
  if (categoria) where.category = categoria;
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
    if (cantone) sp.set("cantone", cantone);
    if (params.prezzoMin) sp.set("prezzoMin", params.prezzoMin);
    if (params.prezzoMax) sp.set("prezzoMax", params.prezzoMax);
    if (p > 1) sp.set("pagina", String(p));
    const qs = sp.toString();
    return `/annunci${qs ? `?${qs}` : ""}`;
  }

  const activeCategory = categoria ? getCategory(categoria) : undefined;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filtri */}
      <aside className="w-full shrink-0 lg:w-64">
        <form
          action="/annunci"
          method="get"
          className="space-y-4 rounded-xl border border-gray-200 bg-white p-4"
        >
          <h2 className="font-semibold">Filtri</h2>
          {q && <input type="hidden" name="q" value={q} />}
          <div>
            <label htmlFor="categoria" className="mb-1 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              defaultValue={categoria}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Tutte le categorie</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cantone" className="mb-1 block text-sm font-medium text-gray-700">
              Cantone
            </label>
            <select
              id="cantone"
              name="cantone"
              defaultValue={cantone}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            <span className="mb-1 block text-sm font-medium text-gray-700">Prezzo (CHF)</span>
            <div className="flex gap-2">
              <input
                type="number"
                name="prezzoMin"
                min={0}
                placeholder="Min"
                defaultValue={params.prezzoMin ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                aria-label="Prezzo minimo"
              />
              <input
                type="number"
                name="prezzoMax"
                min={0}
                placeholder="Max"
                defaultValue={params.prezzoMax ?? ""}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                aria-label="Prezzo massimo"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Applica filtri
          </button>
          <Link href="/annunci" className="block text-center text-xs text-gray-500 hover:underline">
            Azzera filtri
          </Link>
        </form>

        {/* Pubblicità laterale */}
        <AdSlot slot="1000000003" className="mt-4 min-h-60" />
      </aside>

      {/* Risultati */}
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">
            {activeCategory ? activeCategory.name : q ? `Risultati per “${q}”` : "Tutti gli annunci"}
          </h1>
          <p className="text-sm text-gray-500">
            {total} {total === 1 ? "annuncio trovato" : "annunci trovati"}
            {cantone ? ` in ${getCantonName(cantone)}` : ""}
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-4xl">🔎</p>
            <p className="mt-2 font-medium text-gray-700">Nessun annuncio trovato</p>
            <p className="mt-1 text-sm text-gray-500">
              Prova a modificare i filtri o{" "}
              <Link href="/pubblica" className="text-emerald-700 hover:underline">
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
          <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginazione">
            {page > 1 && (
              <Link
                href={pageUrl(page - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:border-emerald-500"
              >
                ← Precedente
              </Link>
            )}
            <span className="px-3 text-sm text-gray-500">
              Pagina {page} di {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={pageUrl(page + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:border-emerald-500"
              >
                Successiva →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
