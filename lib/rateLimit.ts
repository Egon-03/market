import { headers } from "next/headers";
import { db } from "@/lib/db";

/** Indirizzo IP del chiamante, letto dagli header impostati dal proxy (Vercel). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

type RateLimitOptions = {
  /** Identificatore univoco per l'azione+soggetto, es. "login:1.2.3.4" */
  key: string;
  /** Numero massimo di richieste consentite nella finestra */
  limit: number;
  /** Ampiezza della finestra temporale in millisecondi */
  windowMs: number;
};

/**
 * Limitatore di frequenza basato sul database (nessun servizio esterno
 * necessario). Ritorna true se la richiesta è consentita, false se il
 * limite è stato superato. Ogni chiamata consentita viene registrata.
 */
export async function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowMs);

  await db.rateLimitHit.deleteMany({ where: { key, createdAt: { lt: windowStart } } });
  const count = await db.rateLimitHit.count({ where: { key, createdAt: { gte: windowStart } } });
  if (count >= limit) return false;

  await db.rateLimitHit.create({ data: { key } });
  return true;
}
