# 🛒 Mercatino.ch — Marketplace di annunci gratuiti

Un marketplace in stile [Ricardo](https://www.ricardo.ch/it/) / [Tutti.ch](https://www.tutti.ch/it),
**100% gratuito per gli utenti**: pubblicare e rispondere agli annunci non costa
nulla e il sito **non gestisce alcun pagamento**. L'unica fonte di guadagno è
**Google AdSense**.

## Caratteristiche

- 📝 **Annunci gratuiti** — pubblicazione con foto (max 5), prezzo fisso / da concordare / regalo
- 🗂️ **13 categorie e 64 sottocategorie** — struttura completa stile Ricardo/Tutti.ch
- 🚗 **Scheda tecnica veicoli** — per Auto & Moto: marca, modello, anno, chilometraggio, alimentazione, cambio, potenza (CV)
- 🔍 **Ricerca e filtri** — per testo, categoria, sottocategoria, cantone e fascia di prezzo, con paginazione
- 🔗 **Pagine categoria/sottocategoria dedicate** — URL puliti tipo `/annunci/auto-moto/automobili`, ottimi per Google
- 👤 **Account utenti** — registrazione/login con sessioni JWT in cookie httpOnly (password con bcrypt)
- ✅ **Verifica e-mail** — chi non conferma l'indirizzo non può pubblicare né contattare (anti-spam); invio via SMTP o link nel log in sviluppo
- 💬 **Messaggistica interna con notifiche e-mail** — compratore e venditore si scrivono dentro il sito; nessun recapito personale viene esposto
- 🛡️ **Sicurezza** — header HTTP (CSP, HSTS, X-Frame-Options…), rate limiting anti-bruteforce/spam su login, registrazione e messaggi, cookie di sessione httpOnly
- 💰 **Monetizzazione AdSense** — slot pubblicitari in homepage, lista annunci, pagine categoria, dettaglio e sidebar; in sviluppo mostrano un segnaposto
- 🔎 **SEO** — rendering lato server, sitemap.xml dinamica, robots.txt, metadati Open Graph e dati strutturati schema.org/Product

## Stack tecnico

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 6](https://prisma.io) + PostgreSQL
- Autenticazione custom leggera con `jose` (JWT) e `bcryptjs`
- Storage immagini su Cloudflare R2 in produzione, filesystem locale in sviluppo

## Avvio in locale

Richiede un database PostgreSQL raggiungibile (locale o gratuito su [Neon](https://neon.tech)).

```bash
npm install
cp .env.example .env       # imposta DATABASE_URL e genera un AUTH_SECRET
npm run db:migrate         # crea le tabelle
ALLOW_SEED=true npm run db:seed   # (facoltativo) dati demo, vedi sotto
npm run dev
```

Il sito è raggiungibile su http://localhost:3000.

Utenti demo dopo il seed (già verificati, password `password123`):
`demo@example.com`, `anna@example.com`, `marco@example.com` e `giulia@example.com`,
proprietari in totale di **96 annunci realistici** distribuiti su tutte le
categorie e sottocategorie (auto e moto con marca/modello/CV veri), più una
conversazione di esempio tra demo e anna.

> ⚠️ Il seed richiede `ALLOW_SEED=true` di proposito: crea account con una
> password nota e pubblica (`password123`). **Non va mai eseguito contro il
> database di produzione**, altrimenti chiunque potrebbe accedere con quelle
> credenziali sul sito vero.

Senza SMTP configurato, i link/notifiche via e-mail vengono stampati nel log
del server (`npm run dev`) invece che inviati: comodo per sviluppare in locale.
Senza credenziali R2 configurate, le foto caricate finiscono in `public/uploads/`.

## Attivare Google AdSense (la fonte di guadagno)

1. Registra il dominio su [Google AdSense](https://adsense.google.com) e attendi l'approvazione.
2. Imposta `NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"` nelle variabili d'ambiente.
3. Sostituisci in `public/ads.txt` l'ID `pub-0000000000000000` con il tuo publisher ID.
4. (Consigliato) Crea unità pubblicitarie in AdSense e sostituisci gli ID slot
   segnaposto (`1000000001`…`1000000009`) nei componenti `<AdSlot slot="…" />`.

Senza `NEXT_PUBLIC_ADSENSE_CLIENT` configurato, al posto degli annunci vengono
mostrati dei riquadri segnaposto: utile in sviluppo per verificare il layout.

## Deploy in produzione — gratis, con dominio proprio

Guida completa passo-passo (nessun costo con traffico normale per un sito
nuovo): **[DEPLOY.md](./DEPLOY.md)**.

In sintesi, lo stack scelto è:

| Servizio | Cosa fa | Costo |
|---|---|---|
| [Vercel](https://vercel.com) | Hosting del sito, HTTPS automatico | Gratis |
| [Neon](https://neon.tech) | Database PostgreSQL | Gratis |
| [Cloudflare R2](https://www.cloudflare.com/products/r2/) | Storage delle foto | Gratis |
| [Brevo](https://www.brevo.com) | Invio e-mail (verifica, notifiche) | Gratis (300/giorno) |

## Struttura del progetto

```
app/                  Pagine (App Router)
  page.tsx            Homepage: hero, categorie, ultimi annunci
  annunci/            Lista con filtri; rotta [...slug] serve categoria,
                      sottocategoria e dettaglio annuncio con un solo file
  pubblica/           Form di pubblicazione (richiede login + e-mail verificata)
  i-miei-annunci/     Gestione annunci propri (venduto/elimina)
  messaggi/           Messaggistica interna (lista conversazioni + thread)
  accedi/ registrati/ Autenticazione
  verifica/           Conferma dell'indirizzo e-mail
  come-funziona/      Pagina informativa
  sitemap.ts robots.ts SEO
components/           Header, Footer, AdSlot, ListingCard, form…
lib/                  db, auth, email, storage, rate limit, server actions…
prisma/               Schema database, migrazioni e seed demo
public/ads.txt        Dichiarazione publisher AdSense
DEPLOY.md             Guida al deploy in produzione
```
