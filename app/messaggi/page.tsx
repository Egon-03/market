import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseImages, timeAgo } from "@/lib/format";
import CategoryIcon from "@/components/CategoryIcon";
import { ChatIcon } from "@/components/icons";

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
    <div className="mx-auto max-w-3xl animate-rise">
      <div className="mb-6 border-b border-ink/12 pb-4">
        <p className="eyebrow">Le tue conversazioni</p>
        <h1 className="display mt-1 text-3xl">Messaggi</h1>
      </div>

      {conversations.length === 0 ? (
        <div className="card border-dashed p-14 text-center">
          <ChatIcon className="mx-auto h-10 w-10 text-ink/20" />
          <p className="display mt-4 text-xl">Nessuna conversazione</p>
          <p className="mt-2 text-sm text-ash">
            Quando contatti un venditore (o qualcuno risponde a un tuo annuncio),
            la conversazione apparirà qui.
          </p>
          <Link href="/annunci" className="mt-3 inline-block text-sm font-bold text-swiss hover:underline">
            Sfoglia gli annunci →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {conversations.map((conv) => {
            const isSeller = conv.listing.userId === user.id;
            const otherName = isSeller ? conv.buyer.name : conv.listing.user.name;
            const lastMessage = conv.messages[0];
            const unread = conv._count.messages;
            const cover = parseImages(conv.listing.images)[0];
            return (
              <li key={conv.id}>
                <Link
                  href={`/messaggi/${conv.id}`}
                  className={`card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-ink ${
                    unread > 0 ? "border-swiss" : ""
                  }`}
                >
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-smoke">
                    {cover ? (
                      <Image src={cover} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink/20">
                        <CategoryIcon slug={conv.listing.category} className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm">
                      <span className="font-display font-bold text-ink">{otherName}</span>
                      <span className="text-ink/25">·</span>
                      <span className="truncate text-ash">{conv.listing.title}</span>
                    </p>
                    {lastMessage && (
                      <p className={`mt-1 truncate text-sm ${unread > 0 ? "font-semibold text-ink" : "text-ash"}`}>
                        {lastMessage.body}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    {lastMessage && (
                      <span className="text-xs text-ash">{timeAgo(lastMessage.createdAt)}</span>
                    )}
                    {unread > 0 && (
                      <span className="rounded-full bg-swiss px-2.5 py-0.5 font-display text-xs font-black text-white">
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
