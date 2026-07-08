import Link from "next/link";
import { db } from "@/lib/db";
import type { Category } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import CategoryIcon from "@/components/CategoryIcon";

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
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-ash" aria-label="Breadcrumb">
        <Link href="/" className="font-medium transition hover:text-swiss">Home</Link>
        <span>›</span>
        <Link href="/annunci" className="font-medium transition hover:text-swiss">Annunci</Link>
        <span>›</span>
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      {/* Testata di categoria */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/12 pb-6">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-paper">
            <CategoryIcon slug={category.slug} className="h-8 w-8" />
          </span>
          <div>
            <p className="eyebrow">Categoria</p>
            <h1 className="display mt-1 text-3xl sm:text-4xl">
              {category.name} — annunci gratuiti
            </h1>
          </div>
        </div>
        <p className="text-sm tabular-nums text-ash">
          {total} {total === 1 ? "annuncio" : "annunci"} ·{" "}
          <Link
            href={`/annunci?categoria=${category.slug}`}
            className="font-bold text-swiss hover:underline"
          >
            Filtri avanzati →
          </Link>
        </p>
      </div>

      {listings.length === 0 ? (
        <div className="card border-dashed p-14 text-center">
          <span className="mx-auto block w-fit text-ink/20">
            <CategoryIcon slug={category.slug} className="h-12 w-12" />
          </span>
          <p className="display mt-4 text-xl">
            Ancora nessun annuncio in questa categoria
          </p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm font-bold text-swiss hover:underline">
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
        <nav className="flex items-center justify-center gap-3" aria-label="Paginazione">
          {page > 1 && (
            <Link
              href={`/annunci/${category.slug}${page - 1 > 1 ? `?pagina=${page - 1}` : ""}`}
              className="btn-secondary"
            >
              ← Precedente
            </Link>
          )}
          <span className="px-2 text-sm font-semibold tabular-nums text-ash">
            Pagina {page} di {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/annunci/${category.slug}?pagina=${page + 1}`}
              className="btn-secondary"
            >
              Successiva →
            </Link>
          )}
        </nav>
      )}

      <AdSlot slot="1000000009" className="min-h-24" />

      {/* Altre categorie: link interni utili per SEO e navigazione */}
      <section className="border-t border-ink/12 pt-8">
        <p className="eyebrow">Continua a esplorare</p>
        <h2 className="display mt-1 text-2xl">Altre categorie</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/annunci/${c.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
            >
              <CategoryIcon slug={c.slug} className="h-4 w-4" />
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
