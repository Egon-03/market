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
    <div className="mx-auto max-w-3xl animate-rise space-y-10">
      <div className="border-b border-ink/12 pb-6">
        <p className="eyebrow">Le regole del gioco</p>
        <h1 className="display mt-1 text-4xl sm:text-5xl">Come funziona</h1>
      </div>

      <section className="card relative overflow-hidden p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-swiss" aria-hidden="true" />
        <h2 className="display text-xl">Gratuito. Davvero.</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink/75">
          Pubblicare un annuncio non costa nulla, e non ci sono commissioni sulla
          vendita. Il sito si finanzia esclusivamente tramite gli annunci
          pubblicitari che vedi tra i contenuti: è così che possiamo offrire il
          servizio gratis a tutti.
        </p>
      </section>

      <section className="card p-7">
        <h2 className="display text-xl">Nessun pagamento tramite il sito</h2>
        <p className="mt-3 max-w-prose leading-relaxed text-ink/75">
          Mercatino.ch non gestisce pagamenti, spedizioni o garanzie: mette
          semplicemente in contatto chi vende con chi compra. Prezzo, consegna e
          pagamento si concordano direttamente tra le persone, come in un vero
          mercatino.
        </p>
      </section>

      <AdSlot slot="1000000007" className="min-h-24" />

      <section>
        <h2 className="display mb-5 text-2xl">In tre passi</h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-ink/12 bg-ink/12 sm:grid-cols-3">
          {[
            {
              n: "1",
              title: "Registrati gratis",
              text: "con la tua e-mail (serve solo per gestire i tuoi annunci ed essere contattato).",
            },
            {
              n: "2",
              title: "Pubblica l'annuncio",
              text: "con foto, descrizione, prezzo e luogo.",
            },
            {
              n: "3",
              title: "Rispondi agli interessati",
              text: "nella chat interna e concludi l'affare di persona.",
            },
          ].map((step) => (
            <div key={step.n} className="bg-white p-6">
              <span className="font-display text-4xl font-black text-swiss">{step.n}</span>
              <h3 className="display mt-3 text-base">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ash">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-ink p-7 text-paper">
        <h2 className="flex items-center gap-2.5 font-display text-xl font-black uppercase tracking-wide">
          <ShieldIcon className="h-6 w-6 text-swiss" />
          Consigli di sicurezza
        </h2>
        <ul className="mt-4 space-y-2 leading-relaxed text-paper/75">
          <li>— Incontra l&apos;altra persona in un luogo pubblico e frequentato.</li>
          <li>— Esamina l&apos;articolo prima di pagare.</li>
          <li>— Preferisci il pagamento in contanti alla consegna.</li>
          <li>— Non inviare mai denaro in anticipo a sconosciuti.</li>
          <li>— Diffida di offerte troppo belle per essere vere.</li>
        </ul>
      </section>

      <div className="pt-2 text-center">
        <Link href="/pubblica" className="btn-swiss !px-12 !py-4 text-base">
          Pubblica il tuo primo annuncio
        </Link>
      </div>
    </div>
  );
}
