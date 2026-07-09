# Guida al deploy — online gratis, in sicurezza, con il tuo dominio

Questa guida ti porta dal codice a un sito vero e proprio raggiungibile sul
tuo dominio, usando solo servizi con un piano gratuito generoso. Con il
traffico di un marketplace nuovo **non pagherai nulla**. Se il sito crescerà
molto, i costi restano comunque bassi e scalano solo con il traffico reale.

Tempo richiesto: 30-45 minuti, nessuna conoscenza di server necessaria.

## Cosa userai

| Servizio | A cosa serve | Piano gratuito |
|---|---|---|
| **GitHub** | Ospita il codice, Vercel lo legge da lì | Gratis |
| **[Vercel](https://vercel.com)** | Fa girare il sito, HTTPS automatico | Gratis |
| **[Neon](https://neon.tech)** | Database PostgreSQL | Gratis (0.5 GB) |
| **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** | Storage delle foto annunci | Gratis (10 GB) |
| **[Brevo](https://www.brevo.com)** | Invio e-mail (verifica, notifiche) | Gratis (300 e-mail/giorno) |

Il tuo dominio già acquistato lo collegherai a Vercel al passo 6.

---

## 1. Metti il codice su GitHub

Se il progetto non è già su GitHub:

```bash
git init
git add .
git commit -m "Primo commit"
```

Crea un repository vuoto su [github.com/new](https://github.com/new) (puoi
tenerlo privato) e poi:

```bash
git remote add origin https://github.com/TUO-UTENTE/TUO-REPO.git
git push -u origin main
```

## 2. Crea il database — Neon (PostgreSQL gratuito)

1. Vai su [neon.tech](https://neon.tech) e registrati (puoi usare l'account GitHub).
2. Crea un nuovo progetto (es. "mercatino").
3. Nella dashboard del progetto trovi la **connection string**, qualcosa come:
   ```
   postgresql://utente:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Copiala: sarà la tua `DATABASE_URL`.

> 💡 Neon supporta i "branch" del database, comodo se in futuro vuoi un
> database separato per test senza toccare quello vero.

## 3. Crea lo storage immagini — Cloudflare R2

1. Vai su [dash.cloudflare.com](https://dash.cloudflare.com) e registrati.
2. Nel menu laterale apri **R2 Object Storage** e crea un bucket (es. `mercatino-immagini`).
3. Nelle impostazioni del bucket, sezione **Public access**, attiva l'accesso
   pubblico e copia l'URL pubblico generato (dominio tipo `pub-xxxx.r2.dev`)
   — sarà la tua `R2_PUBLIC_URL`. In alternativa puoi collegare un
   sottodominio del tuo dominio (es. `img.tuodominio.ch`) se preferisci.
4. Vai su **R2 → Manage API Tokens** e crea un token con permessi di
   **lettura e scrittura** solo su questo bucket. Otterrai:
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
5. L'`R2_ACCOUNT_ID` lo trovi nell'URL della dashboard Cloudflare o nella
   pagina R2 stessa (a destra, "Account ID").
6. `R2_BUCKET_NAME` è il nome che hai dato al bucket (es. `mercatino-immagini`).

## 4. Attiva l'invio e-mail — Brevo

1. Registrati su [brevo.com](https://www.brevo.com) (piano gratuito, 300 e-mail/giorno).
2. Vai su **Impostazioni → SMTP & API → SMTP** e genera una chiave SMTP.
3. Otterrai:
   - `SMTP_HOST` → `smtp-relay.brevo.com`
   - `SMTP_PORT` → `587`
   - `SMTP_USER` → il tuo indirizzo login Brevo
   - `SMTP_PASS` → la chiave SMTP generata
4. In Brevo, verifica il tuo indirizzo mittente (es. `noreply@tuodominio.ch`)
   in **Mittenti e IP → Mittenti**: senza questo passaggio le e-mail
   potrebbero finire in spam o essere rifiutate.

## 5. Genera la chiave di sessione

Sul tuo computer, in un terminale:

```bash
openssl rand -base64 32
```

Copia il risultato: sarà `AUTH_SECRET`. È la chiave che firma i cookie di
login — tienila segreta, non va mai messa nel codice o su GitHub.

## 6. Crea il progetto su Vercel

1. Vai su [vercel.com](https://vercel.com) e registrati con GitHub.
2. Clicca **Add New → Project**, seleziona il repository appena creato.
3. Vercel riconosce automaticamente Next.js: non serve cambiare nulla nelle
   impostazioni di build.
4. Prima di premere "Deploy", apri **Environment Variables** e aggiungi
   tutte queste (usa i valori raccolti nei passi precedenti):

   ```
   DATABASE_URL=postgresql://...           (da Neon)
   AUTH_SECRET=...                         (generato al passo 5)
   NEXT_PUBLIC_SITE_URL=https://tuodominio.ch
   NEXT_PUBLIC_ADSENSE_CLIENT=             (vuoto finché non hai AdSense, vedi README)

   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=...
   SMTP_PASS=...
   SMTP_FROM=Mercatino.ch <noreply@tuodominio.ch>

   R2_ACCOUNT_ID=...
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   R2_BUCKET_NAME=...
   R2_PUBLIC_URL=https://pub-xxxx.r2.dev
   ```

5. Premi **Deploy**. Vercel installa le dipendenze, esegue le migrazioni del
   database (`prisma migrate deploy`, già collegato allo script di build) e
   pubblica il sito su un URL tipo `tuo-progetto.vercel.app`.

## 7. Collega il tuo dominio

1. Nel progetto Vercel vai su **Settings → Domains** e aggiungi il tuo dominio
   (es. `mercatino.ch`).
2. Vercel ti mostra i record DNS da impostare (di solito un record `A` verso
   un IP, oppure un `CNAME` per il sottodominio `www`).
3. Vai dal tuo registrar (dove hai comprato il dominio) e aggiungi quei
   record nella gestione DNS.
4. Attendi la propagazione DNS (di solito minuti, a volte fino a qualche
   ora): Vercel emette automaticamente il certificato HTTPS non appena il
   dominio punta a lui.
5. Torna nelle variabili d'ambiente del progetto e aggiorna
   `NEXT_PUBLIC_SITE_URL` con l'URL definitivo, poi rifai il deploy
   (Vercel → Deployments → "..." → Redeploy).

## 8. Popolare il sito (facoltativo)

Il sito parte vuoto, senza annunci finti. Se vuoi comunque partire con
qualche annuncio dimostrativo (**sconsigliato su un sito reale**, perché il
seed crea account con password nota `password123`), puoi lanciarlo una
tantum dal tuo computer puntando alla `DATABASE_URL` di Neon:

```bash
DATABASE_URL="postgresql://...neon..." ALLOW_SEED=true npm run db:seed
```

Più sensato: registra tu stesso il primo account reale e pubblica i primi
annunci veri, così i visitatori vedono contenuti autentici fin da subito.

## 9. Attivare AdSense

Segui la sezione "Attivare Google AdSense" nel [README](./README.md).
Ricordati di aggiungere `NEXT_PUBLIC_ADSENSE_CLIENT` tra le variabili
d'ambiente su Vercel e di rifare il deploy dopo averla impostata.

---

## Checklist di sicurezza (già implementata nel codice)

- ✅ HTTPS automatico e obbligatorio (gestito da Vercel)
- ✅ Password con hashing bcrypt, mai salvate in chiaro
- ✅ Cookie di sessione `httpOnly` + `secure` + `sameSite`, non leggibili da JavaScript
- ✅ Header di sicurezza HTTP (CSP, HSTS, X-Frame-Options, ecc.)
- ✅ Rate limiting su login, registrazione e messaggi (anti-bruteforce e anti-spam)
- ✅ Verifica e-mail obbligatoria prima di pubblicare o contattare
- ✅ Nessun recapito personale (e-mail/telefono) esposto pubblicamente

Cosa resta a tuo carico:

- Tieni `AUTH_SECRET` e le chiavi API (Neon/R2/Brevo) segrete: non
  condividerle né inserirle nel codice sorgente.
- Aggiorna periodicamente le dipendenze (`npm outdated`, poi `npm update`)
  per ricevere le patch di sicurezza degli strumenti usati.
- Se noti account o annunci sospetti, valuta di aggiungere una moderazione
  manuale (per ora il sito non ha un pannello di amministrazione).

## Manutenzione ordinaria

- **Aggiornare il sito**: fai push su GitHub, Vercel ridistribuisce
  automaticamente in circa un minuto.
- **Backup del database**: Neon mantiene snapshot automatici; per un
  backup manuale usa `pg_dump` con la connection string.
- **Monitorare i limiti gratuiti**: controlla ogni tanto le dashboard di
  Vercel, Neon, R2 e Brevo — ti avvisano comunque prima di qualunque addebito.
