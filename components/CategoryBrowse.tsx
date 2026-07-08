import Link from "next/link";
import { db } from "@/lib/db";
import type { Category } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";

const PAGE_SIZE = 24;

type Props = {
  category: Category;
  page: number;
};

/** Pagina categoria con URL dedicato (es. /annunci/elettronica) — ottima per la SEO. */
export default async function CategoryBrowse({ category, page }: Props) {
  const where = { category: category.slug, status: "attivo" };
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

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        {" › "}
        <Link href="/annunci" className="hover:text-emerald-700">Annunci</Link>
        {" › "}
        <span className="text-gray-700">{category.name}</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold">
          {category.icon} {category.name} — annunci gratuiti
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {total} {total === 1 ? "annuncio" : "annunci"} nella categoria{" "}
          {category.name}. Compra e vendi senza commissioni.{" "}
          <Link
            href={`/annunci?categoria=${category.slug}`}
            className="text-emerald-700 hover:underline"
          >
            Filtri avanzati →
          </Link>
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">{category.icon}</p>
          <p className="mt-2 font-medium text-gray-700">
            Ancora nessun annuncio in questa categoria
          </p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm text-emerald-700 hover:underline">
            Pubblica tu il primo, è gratis →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {listings.slice(0, 8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
          {listings.length > 8 && (
            <AdSlot slot="1000000008" className="col-span-full min-h-24" />
          )}
          {listings.slice(8).map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Paginazione">
          {page > 1 && (
            <Link
              href={`/annunci/${category.slug}${page - 1 > 1 ? `?pagina=${page - 1}` : ""}`}
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
              href={`/annunci/${category.slug}?pagina=${page + 1}`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:border-emerald-500"
            >
              Successiva →
            </Link>
          )}
        </nav>
      )}

      <AdSlot slot="1000000009" className="min-h-24" />

      {/* Altre categorie: link interni utili per SEO e navigazione */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Altre categorie</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/annunci/${c.slug}`}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-emerald-400"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
