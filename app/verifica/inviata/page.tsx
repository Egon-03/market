import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "E-mail di verifica inviata" };

export default function VerificationSentPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-6xl">📬</p>
      <h1 className="mt-4 text-2xl font-bold">E-mail inviata!</h1>
      <p className="mt-2 text-gray-500">
        Ti abbiamo inviato una nuova e-mail di verifica. Controlla la tua casella
        di posta (anche lo spam) e clicca sul link entro 24 ore.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Torna alla home
      </Link>
    </div>
  );
}
