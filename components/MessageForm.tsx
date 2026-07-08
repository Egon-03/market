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
      <Link href={`/accedi?next=/annunci/${listingId}`} className="btn-primary mt-5 w-full">
        Accedi per contattare
      </Link>
    );
  }

  return (
    <form action={formAction} className="mt-5 space-y-2.5">
      <input type="hidden" name="listingId" value={listingId} />
      <textarea
        name="body"
        required
        rows={3}
        maxLength={2000}
        placeholder="Ciao! Sono interessato al tuo annuncio…"
        className="input resize-none"
      />
      {state?.error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Invio…" : "💬 Invia messaggio"}
      </button>
      <p className="text-center text-xs text-stone-400">
        La conversazione resta privata dentro il sito.
      </p>
    </form>
  );
}
