"use client";

import { useActionState, useRef, useEffect } from "react";
import { replyMessageAction, type ActionState } from "@/lib/actions";

export default function ReplyForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    replyMessageAction,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Svuota il campo dopo l'invio riuscito
  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="mt-4">
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex gap-2">
        <textarea
          name="body"
          required
          rows={2}
          maxLength={2000}
          placeholder="Scrivi un messaggio…"
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 self-end rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "…" : "Invia"}
        </button>
      </div>
      {state?.error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
