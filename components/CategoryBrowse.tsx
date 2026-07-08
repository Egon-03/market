import Link from "next/link";
import { db } from "@/lib/db";
import type { Category, Subcategory } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import CategoryIcon from "@/components/CategoryIcon";

const PAGE_SIZE = 24;

type Props = {
  category: Category;
  subcategory?: Subcategory;
  page: number;
};

/**
 * Pagina categoria/sottocategoria con URL dedicato — es. /annunci/auto-moto
 * o /annunci/auto-moto/automobili — ottima per la SEO.
 */
export default async function CategoryBrowse({ category, subcategory, page }: Props) {
  const where = {
    category: category.slug,
    status: "attivo",
    ...(subcategory ? { subcategory: subcategory.slug } : {}),
  };

  const basePath = subcategory
    ? `/annunci/${category.slug}/${subcategory.slug}`
    : `/annunci/${category.slug}`;

  const [total, listings, subcategoryCounts] = await Promise.all([
    db.listing.count({ where }),
    db.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    subcategory
      ? Promise.resolve([])
      : db.listing.groupBy({
          by: ["subcategory"],
          where: { category: category.slug, status: "attivo" },
          _count: true,
        }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const countBySub = Object.fromEntries(
    subcategoryCounts.map((c) => [c.subcategory, c._count])
  );

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-ash" aria-label="Breadcrumb">
        <Link href="/" className="font-medium transition hover:text-swiss">Home</Link>
        <span>›</span>
        <Link href="/annunci" className="font-medium transition hover:text-swiss">Annunci</Link>
        <span>›</span>
        {subcategory ? (
          <>
            <Link href={`/annunci/${category.slug}`} className="font-medium transition hover:text-swiss">
              {category.name}
            </Link>
            <span>›</span>
            <span className="font-medium text-ink">{subcategory.name}</span>
          </>
        ) : (
          <span className="font-medium text-ink">{category.name}</span>
        )}
      </nav>

      {/* Testata di categoria */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/12 pb-6">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-paper">
            <CategoryIcon slug={category.slug} className="h-8 w-8" />
          </span>
          <div>
            <p className="eyebrow">{subcategory ? category.name : "Categoria"}</p>
            <h1 className="display mt-1 text-3xl sm:text-4xl">
              {subcategory ? subcategory.name : category.name} — annunci gratuiti
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

      {/* Sottocategorie */}
      {category.subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/annunci/${category.slug}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              !subcategory
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-white text-ink hover:border-ink"
            }`}
          >
            Tutte
          </Link>
          {category.subcategories.map((s) => {
            const active = subcategory?.slug === s.slug;
            return (
              <Link
                key={s.slug}
                href={`/annunci/${category.slug}/${s.slug}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-swiss bg-swiss text-white"
                    : "border-ink/20 bg-white text-ink hover:border-ink"
                }`}
              >
                {s.name}
                {!subcategory && countBySub[s.slug] > 0 && (
                  <span className={`tabular-nums ${active ? "text-white/75" : "text-ash"}`}>
                    {countBySub[s.slug]}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {listings.length === 0 ? (
        <div className="card border-dashed p-14 text-center">
          <span className="mx-auto block w-fit text-ink/20">
            <CategoryIcon slug={category.slug} className="h-12 w-12" />
          </span>
          <p className="display mt-4 text-xl">
            Ancora nessun annuncio in questa {subcategory ? "sottocategoria" : "categoria"}
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
              href={`${basePath}${page - 1 > 1 ? `?pagina=${page - 1}` : ""}`}
              className="btn-secondary"
            >
              ← Precedente
            </Link>
          )}
          <span className="px-2 text-sm font-semibold tabular-nums text-ash">
            Pagina {page} di {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`${basePath}?pagina=${page + 1}`} className="btn-secondary">
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
