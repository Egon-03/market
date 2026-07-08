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
      <div className="card flex gap-2 p-2">
        <textarea
          name="body"
          required
          rows={2}
          maxLength={2000}
          placeholder="Scrivi un messaggio…"
          className="w-full resize-none rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
        />
        <button type="submit" disabled={pending} className="btn-primary shrink-0 self-end !px-6">
          {pending ? "…" : "Invia"}
        </button>
      </div>
      {state?.error && (
        <p className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
