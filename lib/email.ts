import nodemailer from "nodemailer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "Mercatino.ch <noreply@localhost>",
    to,
    subject: "Conferma il tuo indirizzo e-mail",
    text: `Benvenuto su Mercatino.ch!\n\nConferma il tuo indirizzo e-mail aprendo questo link:\n${url}\n\nIl link è valido per 24 ore. Se non ti sei registrato tu, ignora questo messaggio.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#047857">🛒 Mercatino.ch</h2>
        <p>Benvenuto! Conferma il tuo indirizzo e-mail per poter pubblicare annunci e contattare i venditori.</p>
        <p style="margin:24px 0">
          <a href="${url}" style="background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
            Conferma e-mail
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Il link è valido per 24 ore. Se non ti sei registrato tu, ignora questo messaggio.</p>
      </div>
    `,
  });
}
