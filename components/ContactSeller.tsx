"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  email: string;
  phone: string | null;
  loggedIn: boolean;
  listingTitle: string;
};

/**
 * Il contatto avviene direttamente tra utenti (e-mail/telefono):
 * il sito non gestisce pagamenti né trattative.
 * I recapiti sono mostrati solo agli utenti registrati, per limitare lo spam.
 */
export default function ContactSeller({ email, phone, loggedIn, listingTitle }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (!loggedIn) {
    return (
      <Link
        href="/accedi"
        className="mt-4 block rounded-lg bg-emerald-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Accedi per contattare
      </Link>
    );
  }

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Mostra contatti
      </button>
    );
  }

  const subject = encodeURIComponent(`Interesse per: ${listingTitle}`);

  return (
    <div className="mt-4 space-y-2 text-sm">
      <a
        href={`mailto:${email}?subject=${subject}`}
        className="block rounded-lg bg-emerald-600 py-2 text-center font-semibold text-white transition hover:bg-emerald-700"
      >
        ✉️ {email}
      </a>
      {phone && (
        <a
          href={`tel:${phone}`}
          className="block rounded-lg border border-emerald-600 py-2 text-center font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          📞 {phone}
        </a>
      )}
    </div>
  );
}
