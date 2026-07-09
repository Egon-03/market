"use client";

import Link from "next/link";
import { useActionState, useId, useRef, useState } from "react";
import { reportListingAction, reportUserAction } from "@/lib/reportActions";
import { LISTING_REPORT_REASONS, USER_REPORT_REASONS } from "@/lib/reports";
import { FlagIcon } from "@/components/icons";
import type { ActionState } from "@/lib/actions";

type Props =
  | { targetType: "listing"; targetId: string; targetLabel: string; loggedIn: boolean; triggerLabel?: string }
  | { targetType: "user"; targetId: string; targetLabel: string; loggedIn: boolean; triggerLabel?: string };

/**
 * Bottone + finestra modale per segnalare un annuncio o un utente.
 * Usa l'elemento <dialog> nativo: nessuna libreria aggiuntiva, accessibile
 * (focus trap e chiusura con Esc gestiti dal browser).
 */
export default function ReportButton({ targetType, targetId, targetLabel, loggedIn, triggerLabel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const uid = useId();

  const action = targetType === "listing" ? reportListingAction : reportUserAction;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);
  const reasons = targetType === "listing" ? LISTING_REPORT_REASONS : USER_REPORT_REASONS;
  const idFieldName = targetType === "listing" ? "listingId" : "reportedUserId";
  const success = submitted && !pending && !state?.error;

  if (!loggedIn) {
    return (
      <Link
        href="/accedi"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-ash underline decoration-dotted underline-offset-2 transition hover:text-swiss"
      >
        <FlagIcon className="h-3.5 w-3.5" />
        {triggerLabel ?? `Segnala ${targetLabel}`}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSubmitted(false);
          dialogRef.current?.showModal();
        }}
        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-ash underline decoration-dotted underline-offset-2 transition hover:text-swiss"
      >
        <FlagIcon className="h-3.5 w-3.5" />
        {triggerLabel ?? `Segnala ${targetLabel}`}
      </button>

      <dialog ref={dialogRef} className="dialog-panel" onClose={() => setSubmitted(false)}>
        <form
          action={formAction}
          onSubmit={() => setSubmitted(true)}
          className="w-[min(420px,90vw)] p-6"
        >
          <input type="hidden" name={idFieldName} value={targetId} />

          <h3 className="display text-lg">Segnala {targetLabel}</h3>
          <p className="mt-1.5 text-sm text-ash">
            Il nostro team esaminerà la segnalazione. In caso di reato, contatta
            direttamente le autorità competenti.
          </p>

          {success ? (
            <>
              <p className="mt-5 rounded-lg border border-swiss/25 bg-swiss/5 px-4 py-3 text-sm font-medium text-ink">
                Grazie, la tua segnalazione è stata inviata.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="btn-secondary !px-4 !py-2 !text-xs"
                >
                  Chiudi
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-5">
                <label htmlFor={`reason-${uid}`} className="label">
                  Motivo
                </label>
                <select id={`reason-${uid}`} name="reason" required className="input">
                  <option value="">Seleziona…</option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor={`message-${uid}`} className="label">
                  Dettagli <span className="font-normal normal-case tracking-normal text-ash">(facoltativo)</span>
                </label>
                <textarea
                  id={`message-${uid}`}
                  name="message"
                  rows={3}
                  maxLength={1000}
                  placeholder="Aggiungi informazioni utili alla verifica…"
                  className="input resize-none"
                />
              </div>

              {state?.error && (
                <p className="mt-3 rounded-lg border border-swiss/25 bg-swiss/5 px-3 py-2 text-sm font-medium text-swiss-deep">
                  {state.error}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="btn-secondary !px-4 !py-2 !text-xs"
                >
                  Annulla
                </button>
                <button type="submit" disabled={pending} className="btn-swiss !px-4 !py-2 !text-xs">
                  {pending ? "Invio…" : "Invia segnalazione"}
                </button>
              </div>
            </>
          )}
        </form>
      </dialog>
    </>
  );
}
