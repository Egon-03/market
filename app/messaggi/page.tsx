import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseImages, timeAgo } from "@/lib/format";
import { getCategory } from "@/lib/categories";

export const metadata: Metadata = { title: "Messaggi" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/messaggi");

  const conversations = await db.conversation.findMany({
    where: {
      OR: [{ buyerId: user.id }, { listing: { userId: user.id } }],
    },
    include: {
      listing: { select: { id: true, title: true, images: true, category: true, userId: true, user: { select: { name: true } } } },
      buyer: { select: { name: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: {
        select: {
          messages: { where: { read: false, senderId: { not: user.id } } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Messaggi</h1>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-4xl">💬</p>
          <p className="mt-2 font-medium">Nessuna conversazione</p>
          <p className="mt-1 text-sm text-gray-500">
            Quando contatti un venditore (o qualcuno risponde a un tuo annuncio),
            la conversazione apparirà qui.
          </p>
          <Link href="/annunci" className="mt-3 inline-block text-sm text-emerald-700 hover:underline">
            Sfoglia gli annunci →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conv) => {
            const isSeller = conv.listing.userId === user.id;
            const otherName = isSeller ? conv.buyer.name : conv.listing.user.name;
            const lastMessage = conv.messages[0];
            const unread = conv._count.messages;
            const cover = parseImages(conv.listing.images)[0];
            const icon = getCategory(conv.listing.category)?.icon ?? "📦";
            return (
              <li key={conv.id}>
                <Link
                  href={`/messaggi/${conv.id}`}
                  className={`flex items-center gap-4 rounded-xl border bg-white p-4 transition hover:shadow-sm ${
                    unread > 0 ? "border-emerald-300" : "border-gray-200"
                  }`}
                >
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {cover ? (
                      <Image src={cover} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">{icon}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{otherName}</span>
                      <span className="text-gray-400">·</span>
                      <span className="truncate text-gray-500">{conv.listing.title}</span>
                    </p>
                    {lastMessage && (
                      <p className={`mt-0.5 truncate text-sm ${unread > 0 ? "font-medium text-gray-900" : "text-gray-500"}`}>
                        {lastMessage.body}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {lastMessage && (
                      <span className="text-xs text-gray-400">{timeAgo(lastMessage.createdAt)}</span>
                    )}
                    {unread > 0 && (
                      <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                        {unread}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
