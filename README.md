# 🛒 Mercatino.ch — Marketplace di annunci gratuiti

Un marketplace in stile [Ricardo](https://www.ricardo.ch/it/) / [Tutti.ch](https://www.tutti.ch/it),
**100% gratuito per gli utenti**: pubblicare e rispondere agli annunci non costa
nulla e il sito **non gestisce alcun pagamento**. L'unica fonte di guadagno è
**Google AdSense**.

## Caratteristiche

- 📝 **Annunci gratuiti** — pubblicazione con foto (max 5), prezzo fisso / da concordare / regalo
- 🔍 **Ricerca e filtri** — per testo, categoria, cantone e fascia di prezzo, con paginazione
- 👤 **Account utenti** — registrazione/login con sessioni JWT in cookie httpOnly (password con bcrypt)
- 💬 **Contatto diretto** — compratore e venditore si accordano via e-mail/telefono; i recapiti sono visibili solo agli utenti registrati (anti-spam)
- 💰 **Monetizzazione AdSense** — slot pubblicitari in homepage, lista annunci, dettaglio e sidebar; in sviluppo mostrano un segnaposto
- 🔎 **SEO** — rendering lato server, sitemap.xml dinamica, robots.txt, metadati Open Graph e dati strutturati schema.org/Product (fondamentale: più traffico organico = più ricavi pubblicitari)

## Stack tecnico

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 6](https://prisma.io) + SQLite (facilmente migrabile a PostgreSQL)
- Autenticazione custom leggera con `jose` (JWT) e `bcryptjs`

## Avvio in locale

```bash
npm install
cp .env.example .env      # poi modifica AUTH_SECRET
npm run db:push           # crea il database SQLite
npm run db:seed           # (facoltativo) dati demo: demo@example.com / password123
npm run dev
```

Il sito è raggiungibile su http://localhost:3000.

## Attivare Google AdSense (la fonte di guadagno)

1. Registra il dominio su [Google AdSense](https://adsense.google.com) e attendi l'approvazione.
2. Imposta `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"` nel file `.env`.
3. Sostituisci in `public/ads.txt` l'ID `pub-0000000000000000` con il tuo publisher ID.
4. (Consigliato) Crea unità pubblicitarie in AdSense e sostituisci gli ID slot
   segnaposto (`1000000001`…`1000000007`) nei componenti `<AdSlot slot="…" />`.

Senza `NEXT_PUBLIC_ADSENSE_CLIENT` configurato, al posto degli annunci vengono
mostrati dei riquadri segnaposto: utile in sviluppo per verificare il layout.

## Deploy in produzione

- Imposta `NEXT_PUBLIC_SITE_URL` con il dominio reale (usato da sitemap e SEO).
- Genera un `AUTH_SECRET` robusto: `openssl rand -base64 32`.
- SQLite funziona su un singolo server (VPS); per hosting serverless (es. Vercel)
  migra a PostgreSQL cambiando `provider` in `prisma/schema.prisma` e `DATABASE_URL`.
- Le immagini caricate finiscono in `public/uploads/`: su un VPS assicurati che la
  cartella sia persistente; in ambienti serverless serve uno storage esterno (es. S3).

## Struttura del progetto

```
app/                  Pagine (App Router)
  page.tsx            Homepage: hero, categorie, ultimi annunci
  annunci/            Lista con filtri + dettaglio annuncio
  pubblica/           Form di pubblicazione (richiede login)
  i-miei-annunci/     Gestione annunci propri (venduto/elimina)
  accedi/ registrati/ Autenticazione
  come-funziona/      Pagina informativa
  sitemap.ts robots.ts SEO
components/           Header, Footer, AdSlot, ListingCard, form…
lib/                  db, auth, server actions, categorie, cantoni, formattazione
prisma/               Schema database e seed demo
public/ads.txt        Dichiarazione publisher AdSense
```
