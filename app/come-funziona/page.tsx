import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Come funziona",
  description:
    "Mercatino.ch è un mercatino online 100% gratuito: pubblichi annunci senza commissioni e ti accordi direttamente con compratori e venditori.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">Come funziona Mercatino.ch</h1>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Gratuito. Davvero.</h2>
        <p className="mt-2 text-gray-700">
          Pubblicare un annuncio non costa nulla, e non ci sono commissioni sulla
          vendita. Il sito si finanzia esclusivamente tramite gli annunci
          pubblicitari che vedi tra i contenuti: è così che possiamo offrire il
          servizio gratis a tutti.
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Nessun pagamento tramite il sito</h2>
        <p className="mt-2 text-gray-700">
          Mercatino.ch non gestisce pagamenti, spedizioni o garanzie: mette
          semplicemente in contatto chi vende con chi compra. Prezzo, consegna e
          pagamento si concordano direttamente tra le persone, come in un vero
          mercatino.
        </p>
      </section>

      <AdSlot slot="1000000007" className="min-h-24" />

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold">In tre passi</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-700">
          <li>
            <strong>Registrati gratis</strong> con la tua e-mail (serve solo per
            gestire i tuoi annunci ed essere contattato).
          </li>
          <li>
            <strong>Pubblica l&apos;annuncio</strong> con foto, descrizione, prezzo e
            luogo.
          </li>
          <li>
            <strong>Rispondi agli interessati</strong> via e-mail o telefono e
            concludi l&apos;affare di persona.
          </li>
        </ol>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-semibold text-amber-900">Consigli di sicurezza</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-amber-800">
          <li>Incontra l&apos;altra persona in un luogo pubblico e frequentato.</li>
          <li>Esamina l&apos;articolo prima di pagare.</li>
          <li>Preferisci il pagamento in contanti alla consegna.</li>
          <li>Non inviare mai denaro in anticipo a sconosciuti.</li>
          <li>Diffida di offerte troppo belle per essere vere.</li>
        </ul>
      </section>

      <div className="text-center">
        <Link
          href="/pubblica"
          className="inline-block rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Pubblica il tuo primo annuncio
        </Link>
      </div>
    </div>
  );
}
