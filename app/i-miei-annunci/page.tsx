import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteListingAction, markSoldAction } from "@/lib/actions";
import { formatPrice, timeAgo, parseImages } from "@/lib/format";
import { getCategory } from "@/lib/categories";
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
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
          I miei annunci
        </h1>
        <Link href="/pubblica" className="btn-primary">
          + Nuovo annuncio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="card border-dashed p-12 text-center">
          <p className="text-5xl">📭</p>
          <p className="mt-3 font-bold text-stone-700">Non hai ancora pubblicato annunci</p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm font-bold text-emerald-700 hover:underline">
            Pubblica il tuo primo annuncio gratis →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {listings.map((listing) => {
            const cover = parseImages(listing.images)[0];
            const category = getCategory(listing.category);
            const sold = listing.status === "venduto";
            return (
              <li
                key={listing.id}
                className="card flex flex-wrap items-center gap-4 p-4 transition hover:shadow-md"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                  {cover ? (
                    <Image src={cover} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl opacity-70">
                      {category?.icon ?? "📦"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/annunci/${listing.id}`}
                    className="block truncate font-bold text-stone-800 transition hover:text-emerald-700"
                  >
                    {listing.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-stone-400">
                    <span className="font-extrabold text-emerald-700">
                      {formatPrice(listing.price)}
                    </span>{" "}
                    · {listing.views} visite · {timeAgo(listing.createdAt)}
                    {sold && (
                      <span className="ml-2 rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-600">
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
