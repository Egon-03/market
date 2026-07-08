# 🛒 Mercatino.ch — Marketplace di annunci gratuiti

Un marketplace in stile [Ricardo](https://www.ricardo.ch/it/) / [Tutti.ch](https://www.tutti.ch/it),
**100% gratuito per gli utenti**: pubblicare e rispondere agli annunci non costa
nulla e il sito **non gestisce alcun pagamento**. L'unica fonte di guadagno è
**Google AdSense**.

## Caratteristiche

- 📝 **Annunci gratuiti** — pubblicazione con foto (max 5), prezzo fisso / da concordare / regalo
- 🔍 **Ricerca e filtri** — per testo, categoria, cantone e fascia di prezzo, con paginazione
- 🗂️ **Pagine categoria dedicate** — URL puliti tipo `/annunci/elettronica`, ottimi per Google
- 👤 **Account utenti** — registrazione/login con sessioni JWT in cookie httpOnly (password con bcrypt)
- ✅ **Verifica e-mail** — chi non conferma l'indirizzo non può pubblicare né contattare (anti-spam); invio via SMTP o link nel log in sviluppo
- 💬 **Messaggistica interna** — compratore e venditore si scrivono dentro il sito, con badge dei non letti; nessun recapito personale viene esposto
- 💰 **Monetizzazione AdSense** — slot pubblicitari in homepage, lista annunci, pagine categoria, dettaglio e sidebar; in sviluppo mostrano un segnaposto
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
npm run db:seed           # (facoltativo) dati demo, vedi sotto
npm run dev
```

Il sito è raggiungibile su http://localhost:3000.

Utenti demo dopo il seed (già verificati, password `password123`):
`demo@example.com` (6 annunci) e `anna@example.com`, con una conversazione
di esempio tra i due.

Senza SMTP configurato, il link di verifica e-mail dei nuovi utenti viene
stampato nel log del server (`npm run dev`): aprilo nel browser per completare
la registrazione in locale.

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
- Configura le variabili `SMTP_*` per l'invio reale delle e-mail di verifica
  (qualsiasi provider SMTP: Brevo, Mailgun, Postmark…).
- SQLite funziona su un singolo server (VPS); per hosting serverless (es. Vercel)
  migra a PostgreSQL cambiando `provider` in `prisma/schema.prisma` e `DATABASE_URL`.
- Le immagini caricate finiscono in `public/uploads/`: su un VPS assicurati che la
  cartella sia persistente; in ambienti serverless serve uno storage esterno (es. S3).

## Struttura del progetto

```
app/                  Pagine (App Router)
  page.tsx            Homepage: hero, categorie, ultimi annunci
  annunci/            Lista con filtri + pagine categoria + dettaglio annuncio
  pubblica/           Form di pubblicazione (richiede login + e-mail verificata)
  i-miei-annunci/     Gestione annunci propri (venduto/elimina)
  messaggi/           Messaggistica interna (lista conversazioni + thread)
  accedi/ registrati/ Autenticazione
  verifica/           Conferma dell'indirizzo e-mail
  come-funziona/      Pagina informativa
  sitemap.ts robots.ts SEO
components/           Header, Footer, AdSlot, ListingCard, form…
lib/                  db, auth, email, server actions, categorie, cantoni
prisma/               Schema database e seed demo
public/ads.txt        Dichiarazione publisher AdSense
```
