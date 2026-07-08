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
    <div className="mx-auto max-w-3xl animate-fade-up">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-stone-900">
        Messaggi
      </h1>

      {conversations.length === 0 ? (
        <div className="card border-dashed p-12 text-center">
          <p className="text-5xl">💬</p>
          <p className="mt-3 font-bold text-stone-700">Nessuna conversazione</p>
          <p className="mt-1 text-sm text-stone-500">
            Quando contatti un venditore (o qualcuno risponde a un tuo annuncio),
            la conversazione apparirà qui.
          </p>
          <Link href="/annunci" className="mt-3 inline-block text-sm font-bold text-emerald-700 hover:underline">
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
                  className={`card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    unread > 0 ? "!border-emerald-300 ring-1 ring-emerald-200" : ""
                  }`}
                >
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {cover ? (
                      <Image src={cover} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl opacity-70">{icon}</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm">
                      <span className="font-extrabold text-stone-900">{otherName}</span>
                      <span className="text-stone-300">·</span>
                      <span className="truncate text-stone-500">{conv.listing.title}</span>
                    </p>
                    {lastMessage && (
                      <p className={`mt-1 truncate text-sm ${unread > 0 ? "font-semibold text-stone-800" : "text-stone-400"}`}>
                        {lastMessage.body}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {lastMessage && (
                      <span className="text-xs text-stone-400">{timeAgo(lastMessage.createdAt)}</span>
                    )}
                    {unread > 0 && (
                      <span className="rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600 px-2.5 py-0.5 text-xs font-extrabold text-white shadow">
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
