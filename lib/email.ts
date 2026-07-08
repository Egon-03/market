import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const BRAND_SWISS = "#e8402a";
const BRAND_INK = "#191813";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

function emailShell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2 style="color:${BRAND_INK}">
        <span style="color:${BRAND_SWISS}">mercatino</span>.ch
      </h2>
      <h3 style="color:${BRAND_INK}">${title}</h3>
      ${bodyHtml}
    </div>
  `;
}

/**
 * Invia l'e-mail di verifica dell'indirizzo.
 *
 * In produzione configura le variabili SMTP_* nel file .env.
 * Senza SMTP configurato (sviluppo) il link viene stampato nel log del server,
 * così puoi completare la verifica anche in locale.
 */
export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const url = `${SITE_URL}/verifica?token=${token}`;

  if (!process.env.SMTP_HOST) {
    console.log(`[email] SMTP non configurato. Link di verifica per ${to}: ${url}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? "Mercatino.ch <noreply@localhost>",
    to,
    subject: "Conferma il tuo indirizzo e-mail",
    text: `Benvenuto su Mercatino.ch!\n\nConferma il tuo indirizzo e-mail aprendo questo link:\n${url}\n\nIl link è valido per 24 ore. Se non ti sei registrato tu, ignora questo messaggio.`,
    html: emailShell(
      "Benvenuto!",
      `
        <p>Conferma il tuo indirizzo e-mail per poter pubblicare annunci e contattare i venditori.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:${BRAND_SWISS};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Conferma e-mail
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Il link è valido per 24 ore. Se non ti sei registrato tu, ignora questo messaggio.</p>
      `
    ),
  });
}

type NewMessageEmailParams = {
  to: string;
  recipientName: string;
  senderName: string;
  listingTitle: string;
  preview: string;
  conversationId: string;
};

/**
 * Notifica via e-mail quando arriva un nuovo messaggio in una conversazione.
 * Non espone mai l'indirizzo del mittente: il destinatario deve accedere al
 * sito per rispondere, così i recapiti personali restano privati.
 */
export async function sendNewMessageEmail({
  to,
  recipientName,
  senderName,
  listingTitle,
  preview,
  conversationId,
}: NewMessageEmailParams): Promise<void> {
  const url = `${SITE_URL}/messaggi/${conversationId}`;
  const truncatedPreview =
    preview.length > 200 ? `${preview.slice(0, 200)}…` : preview;

  if (!process.env.SMTP_HOST) {
    console.log(
      `[email] SMTP non configurato. Notifica messaggio per ${to}: ${senderName} ti ha scritto per "${listingTitle}" — ${url}`
    );
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? "Mercatino.ch <noreply@localhost>",
    to,
    subject: `${senderName} ti ha scritto per "${listingTitle}"`,
    text: `Ciao ${recipientName},\n\n${senderName} ti ha scritto un messaggio riguardo al tuo annuncio "${listingTitle}":\n\n"${truncatedPreview}"\n\nRispondi qui: ${url}\n\nPer proteggere la tua privacy, l'indirizzo e-mail non viene mai condiviso: rispondi direttamente dal sito.`,
    html: emailShell(
      `${senderName} ti ha scritto`,
      `
        <p>Ciao ${recipientName}, hai ricevuto un nuovo messaggio riguardo al tuo annuncio <strong>${listingTitle}</strong>:</p>
        <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid ${BRAND_SWISS};background:#f7f6f2;color:#44403c">
          ${truncatedPreview}
        </blockquote>
        <p style="margin:24px 0">
          <a href="${url}" style="background:${BRAND_SWISS};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Rispondi ora
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Per proteggere la tua privacy, il tuo indirizzo e-mail non viene mai condiviso: rispondi direttamente dal sito.</p>
      `
    ),
  });
}
