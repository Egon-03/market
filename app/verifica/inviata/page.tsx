import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "E-mail di verifica inviata" };

export default function VerificationSentPage() {
  return (
    <div className="mx-auto max-w-md animate-fade-up py-10">
      <div className="card p-10 text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-emerald-50 to-emerald-100 text-5xl shadow-inner">
          📬
        </span>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-stone-900">
          E-mail inviata!
        </h1>
        <p className="mt-2 leading-relaxed text-stone-500">
          Ti abbiamo inviato una nuova e-mail di verifica. Controlla la tua casella
          di posta (anche lo spam) e clicca sul link entro 24 ore.
        </p>
        <Link href="/" className="btn-primary mt-7">
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
