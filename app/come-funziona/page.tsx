import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Come funziona",
  description:
    "Mercatino.ch è un mercatino online 100% gratuito: pubblichi annunci senza commissioni e ti accordi direttamente con compratori e venditori.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        Come funziona Mercatino.ch
      </h1>

      <section className="card relative overflow-hidden p-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"
          aria-hidden="true"
        />
        <h2 className="text-xl font-extrabold text-stone-900">Gratuito. Davvero.</h2>
        <p className="mt-2.5 leading-relaxed text-stone-600">
          Pubblicare un annuncio non costa nulla, e non ci sono commissioni sulla
          vendita. Il sito si finanzia esclusivamente tramite gli annunci
          pubblicitari che vedi tra i contenuti: è così che possiamo offrire il
          servizio gratis a tutti.
        </p>
      </section>

      <section className="card p-7">
        <h2 className="text-xl font-extrabold text-stone-900">
          Nessun pagamento tramite il sito
        </h2>
        <p className="mt-2.5 leading-relaxed text-stone-600">
          Mercatino.ch non gestisce pagamenti, spedizioni o garanzie: mette
          semplicemente in contatto chi vende con chi compra. Prezzo, consegna e
          pagamento si concordano direttamente tra le persone, come in un vero
          mercatino.
        </p>
      </section>

      <AdSlot slot="1000000007" className="min-h-24" />

      <section className="card p-7">
        <h2 className="text-xl font-extrabold text-stone-900">In tre passi</h2>
        <ol className="mt-4 space-y-4">
          {[
            {
              title: "Registrati gratis",
              text: "con la tua e-mail (serve solo per gestire i tuoi annunci ed essere contattato).",
            },
            {
              title: "Pubblica l'annuncio",
              text: "con foto, descrizione, prezzo e luogo.",
            },
            {
              title: "Rispondi agli interessati",
              text: "nella chat interna e concludi l'affare di persona.",
            },
          ].map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-600/25">
                {i + 1}
              </span>
              <p className="pt-1 leading-relaxed text-stone-600">
                <strong className="font-extrabold text-stone-900">{step.title}</strong>{" "}
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50 to-orange-50/50 p-7">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-amber-900">
          <ShieldIcon className="h-6 w-6 text-amber-600" />
          Consigli di sicurezza
        </h2>
        <ul className="mt-3.5 space-y-2 leading-relaxed text-amber-800">
          <li>· Incontra l&apos;altra persona in un luogo pubblico e frequentato.</li>
          <li>· Esamina l&apos;articolo prima di pagare.</li>
          <li>· Preferisci il pagamento in contanti alla consegna.</li>
          <li>· Non inviare mai denaro in anticipo a sconosciuti.</li>
          <li>· Diffida di offerte troppo belle per essere vere.</li>
        </ul>
      </section>

      <div className="pt-2 text-center">
        <Link href="/pubblica" className="btn-primary !px-10 !py-3.5 text-base">
          Pubblica il tuo primo annuncio
        </Link>
      </div>
    </div>
  );
}
