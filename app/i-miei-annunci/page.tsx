import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteListingAction, markSoldAction } from "@/lib/actions";
import { formatPrice, timeAgo, parseImages } from "@/lib/format";
import CategoryIcon from "@/components/CategoryIcon";
import Image from "next/image";

export const metadata: Metadata = { title: "I miei annunci" };
export const dynamic = "force-dynamic";

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/i-miei-annunci");

  const listings = await db.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl animate-rise">
      <div className="mb-6 flex items-center justify-between border-b border-ink/12 pb-4">
        <div>
          <p className="eyebrow">Gestione</p>
          <h1 className="display mt-1 text-3xl">I miei annunci</h1>
        </div>
        <Link href="/pubblica" className="btn-swiss">
          + Nuovo annuncio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="card border-dashed p-14 text-center">
          <p className="display text-xl">Non hai ancora pubblicato annunci</p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm font-bold text-swiss hover:underline">
            Pubblica il tuo primo annuncio gratis →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {listings.map((listing) => {
            const cover = parseImages(listing.images)[0];
            const sold = listing.status === "venduto";
            return (
              <li
                key={listing.id}
                className="card flex flex-wrap items-center gap-4 p-4 transition hover:border-ink"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-smoke">
                  {cover ? (
                    <Image src={cover} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/20">
                      <CategoryIcon slug={listing.category} className="h-7 w-7" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/annunci/${listing.id}`}
                    className="block truncate font-display font-bold text-ink transition hover:text-swiss"
                  >
                    {listing.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-ash">
                    <span className="font-black text-swiss">
                      {formatPrice(listing.price)}
                    </span>{" "}
                    · {listing.views} visite · {timeAgo(listing.createdAt)}
                    {sold && (
                      <span className="ml-2 rounded-full bg-ink px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-paper">
                        Venduto
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!sold && (
                    <form action={markSoldAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="btn-secondary !px-4 !py-2 !text-xs">
                        Segna come venduto
                      </button>
                    </form>
                  )}
                  <form action={deleteListingAction}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button type="submit" className="btn-danger !px-4 !py-2 !text-xs">
                      Elimina
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
