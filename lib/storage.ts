import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // es. https://immagini.tuodominio.ch

function getR2Client(): S3Client | null {
  if (!R2_BUCKET || !process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Salva un'immagine caricata e restituisce l'URL pubblico da mostrare nel sito.
 *
 * In produzione (variabili R2_* configurate) carica su Cloudflare R2, uno
 * storage oggetti compatibile S3 con generoso piano gratuito.
 * Senza R2 configurato (sviluppo locale) salva su disco in public/uploads,
 * così il progetto funziona anche senza credenziali cloud.
 */
export async function saveUploadedImage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const client = getR2Client();

  if (client && R2_BUCKET) {
    await client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    if (!R2_PUBLIC_URL) {
      throw new Error(
        "R2_PUBLIC_URL non configurato: impossibile generare l'URL pubblico dell'immagine caricata."
      );
    }
    return `${R2_PUBLIC_URL.replace(/\/$/, "")}/uploads/${filename}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export function randomImageFilename(extension: string): string {
  return `${crypto.randomUUID()}${extension}`;
}
