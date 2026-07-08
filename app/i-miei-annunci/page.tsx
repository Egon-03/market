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
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">I miei annunci</h1>
        <Link
          href="/pubblica"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Nuovo annuncio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-2 font-medium">Non hai ancora pubblicato annunci</p>
          <Link href="/pubblica" className="mt-2 inline-block text-sm text-emerald-700 hover:underline">
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
                className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {cover ? (
                    <Image src={cover} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">
                      {category?.icon ?? "📦"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/annunci/${listing.id}`}
                    className="block truncate font-medium hover:text-emerald-700"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatPrice(listing.price)} · {listing.views} visite ·{" "}
                    {timeAgo(listing.createdAt)}
                    {sold && (
                      <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">
                        Venduto
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!sold && (
                    <form action={markSoldAction}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-emerald-500"
                      >
                        Segna come venduto
                      </button>
                    </form>
                  )}
                  <form action={deleteListingAction}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
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
