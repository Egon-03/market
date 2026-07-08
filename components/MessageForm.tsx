"use client";

import Link from "next/link";
import { useActionState } from "react";
import { startConversationAction, type ActionState } from "@/lib/actions";

type Props = {
  listingId: string;
  loggedIn: boolean;
};

/**
 * Form di primo contatto col venditore: crea (o riusa) la conversazione
 * interna. Nessun recapito personale viene esposto pubblicamente.
 */
export default function MessageForm({ listingId, loggedIn }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    startConversationAction,
    undefined
  );

  if (!loggedIn) {
    return (
      <Link
        href={`/accedi?next=/annunci/${listingId}`}
        className="mt-4 block rounded-lg bg-emerald-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Accedi per contattare
      </Link>
    );
  }

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <input type="hidden" name="listingId" value={listingId} />
      <textarea
        name="body"
        required
        rows={3}
        maxLength={2000}
        placeholder="Ciao! Sono interessato al tuo annuncio…"
        className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
      />
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Invio…" : "💬 Invia messaggio"}
      </button>
      <p className="text-center text-xs text-gray-400">
        La conversazione resta privata dentro il sito.
      </p>
    </form>
  );
}
