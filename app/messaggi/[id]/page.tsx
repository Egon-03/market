import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, parseImages } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import ReplyForm from "@/components/ReplyForm";

export const metadata: Metadata = { title: "Conversazione" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/messaggi");

  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          images: true,
          category: true,
          status: true,
          userId: true,
          user: { select: { name: true } },
        },
      },
      buyer: { select: { name: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  const isParticipant =
    conversation &&
    (conversation.buyerId === user.id || conversation.listing.userId === user.id);
  if (!conversation || !isParticipant) notFound();

  // Segna come letti i messaggi ricevuti
  await db.message.updateMany({
    where: { conversationId: id, senderId: { not: user.id }, read: false },
    data: { read: true },
  });

  const isSeller = conversation.listing.userId === user.id;
  const otherName = isSeller ? conversation.buyer.name : conversation.listing.user.name;
  const cover = parseImages(conversation.listing.images)[0];
  const icon = getCategory(conversation.listing.category)?.icon ?? "📦";

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <Link
        href="/messaggi"
        className="text-sm font-semibold text-stone-400 transition hover:text-emerald-700"
      >
        ← Tutti i messaggi
      </Link>

      {/* Annuncio di riferimento */}
      <Link
        href={`/annunci/${conversation.listing.id}`}
        className="card mt-3 flex items-center gap-3 p-3 transition hover:shadow-md"
      >
        <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
          {cover ? (
            <Image src={cover} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xl opacity-70">{icon}</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-stone-800">
            {conversation.listing.title}
          </p>
          <p className="text-sm font-extrabold text-emerald-700">
            {formatPrice(conversation.listing.price)}
            {conversation.listing.status === "venduto" && (
              <span className="ml-2 text-xs font-medium text-stone-400">(venduto)</span>
            )}
          </p>
        </div>
        <span className="hidden text-xs font-medium text-stone-400 sm:block">
          {isSeller ? `Acquirente: ${otherName}` : `Venditore: ${otherName}`}
        </span>
      </Link>

      {/* Messaggi */}
      <div className="card mt-4 space-y-3 p-4 sm:p-5">
        {conversation.messages.map((msg) => {
          const mine = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-stone-400 to-stone-500 text-xs font-extrabold text-white">
                  {otherName.charAt(0).toUpperCase()}
                </span>
              )}
              <div
                className={`max-w-[80%] px-4 py-2.5 text-sm shadow-sm ${
                  mine
                    ? "rounded-2xl rounded-br-md bg-gradient-to-b from-emerald-500 to-emerald-600 text-white"
                    : "rounded-2xl rounded-bl-md bg-stone-100 text-stone-800"
                }`}
              >
                <p className="whitespace-pre-line break-words">{msg.body}</p>
                <p className={`mt-1 text-right text-[10px] ${mine ? "text-emerald-100/90" : "text-stone-400"}`}>
                  {msg.createdAt.toLocaleString("it-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ReplyForm conversationId={conversation.id} />
    </div>
  );
}
