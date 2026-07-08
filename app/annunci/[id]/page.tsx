import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate, parseImages } from "@/lib/format";
import { getCantonName } from "@/lib/cantons";
import { getCategory, getConditionLabel } from "@/lib/categories";
import ListingCard from "@/components/ListingCard";
import AdSlot from "@/components/AdSlot";
import MessageForm from "@/components/MessageForm";
import ImageGallery from "@/components/ImageGallery";
import CategoryBrowse from "@/components/CategoryBrowse";

export const dynamic = "force-dynamic";

// La rotta serve sia le pagine categoria (/annunci/elettronica) sia il
// dettaglio annuncio (/annunci/<id>): gli slug categoria sono riservati.
type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ pagina?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;

  const categoryPage = getCategory(id);
  if (categoryPage) {
    return {
      title: `${categoryPage.name} — annunci gratuiti`,
      description: `Annunci gratuiti nella categoria ${categoryPage.name}: compra e vendi senza commissioni su Mercatino.ch.`,
      alternates: { canonical: `/annunci/${categoryPage.slug}` },
    };
  }

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) return { title: "Annuncio non trovato" };
  const images = parseImages(listing.images);
  return {
    title: listing.title,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: images.length > 0 ? [images[0]] : undefined,
    },
  };
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;

  const categoryPage = getCategory(id);
  if (categoryPage) {
    const { pagina } = await searchParams;
    const page = Math.max(1, Number(pagina) || 1);
    return <CategoryBrowse category={categoryPage} page={page} />;
  }
  const listing = await db.listing.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, createdAt: true } } },
  });
  if (!listing) notFound();

  // Contatore visite (best effort, non blocca il rendering)
  db.listing.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const viewer = await getCurrentUser();
  const isOwner = viewer?.id === listing.userId;
  const images = parseImages(listing.images);
  const category = getCategory(listing.category);
  const sold = listing.status === "venduto";

  const similar = await db.listing.findMany({
    where: { category: listing.category, status: "attivo", id: { not: listing.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: images,
    offers: {
      "@type": "Offer",
      price: listing.price ?? undefined,
      priceCurrency: "CHF",
      availability: sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition:
        listing.condition === "nuovo"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        {" › "}
        <Link href="/annunci" className="hover:text-emerald-700">Annunci</Link>
        {" › "}
        {category && (
          <>
            <Link href={`/annunci/${category.slug}`} className="hover:text-emerald-700">
              {category.name}
            </Link>
            {" › "}
          </>
        )}
        <span className="text-gray-700">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonna principale */}
        <div className="space-y-6 lg:col-span-2">
          <ImageGallery images={images} title={listing.title} fallbackIcon={category?.icon ?? "📦"} />

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Pubblicato il {formatDate(listing.createdAt)} · {listing.views} visualizzazioni
                </p>
              </div>
              <p className="text-2xl font-extrabold text-emerald-700">
                {formatPrice(listing.price)}
              </p>
            </div>

            {sold && (
              <p className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                ⚠️ Questo articolo è stato venduto.
              </p>
            )}

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-gray-500">Categoria</dt>
                <dd className="font-medium">{category?.name ?? listing.category}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Condizione</dt>
                <dd className="font-medium">{getConditionLabel(listing.condition)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Luogo</dt>
                <dd className="font-medium">
                  {getCantonName(listing.canton)}
                  {listing.city ? ` · ${listing.city}` : ""}
                </dd>
              </div>
            </dl>

            <h2 className="mt-6 font-semibold">Descrizione</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {listing.description}
            </p>
          </div>

          <AdSlot slot="1000000005" className="min-h-24" />
        </div>

        {/* Sidebar venditore */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold">Venditore</h2>
            <p className="mt-2 text-lg font-medium">{listing.user.name}</p>
            <p className="text-sm text-gray-500">
              Membro da {formatDate(listing.user.createdAt)}
            </p>
            {isOwner ? (
              <Link
                href="/i-miei-annunci"
                className="mt-4 block rounded-lg border border-emerald-600 py-2 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Gestisci questo annuncio
              </Link>
            ) : (
              <MessageForm listingId={listing.id} loggedIn={Boolean(viewer)} />
            )}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <p className="font-semibold">💡 Consigli di sicurezza</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              <li>Incontra il venditore di persona in un luogo pubblico</li>
              <li>Controlla l&apos;articolo prima di pagare</li>
              <li>Non inviare mai denaro in anticipo</li>
            </ul>
          </div>

          <AdSlot slot="1000000006" className="min-h-60" />
        </div>
      </div>

      {/* Annunci simili */}
      {similar.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">Annunci simili</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
