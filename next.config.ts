import type { NextConfig } from "next";

// Se le immagini sono ospitate su Cloudflare R2 (produzione), autorizza
// quel dominio per next/image. In sviluppo locale (senza R2_PUBLIC_URL)
// le immagini restano sotto /uploads, sullo stesso dominio: nessuna
// configurazione necessaria.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
let r2Hostname = "";
if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    r2Hostname = url.hostname;
    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      pathname: "/**",
    });
  } catch {
    // URL non valido: le immagini remote non verranno ottimizzate,
    // ma il sito continua a funzionare.
  }
}

const GOOGLE_AD_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
  "https://*.gstatic.com",
];

function buildCsp(): string {
  const imgSrc = ["'self'", "data:", "blob:", ...GOOGLE_AD_ORIGINS];
  if (r2Hostname) imgSrc.push(`https://${r2Hostname}`);

  return [
    `default-src 'self'`,
    // 'unsafe-inline' resta necessario per l'hydration di Next.js e il
    // JSON-LD inline (script-src con nonce richiederebbe un middleware
    // dedicato); gli script esterni restano comunque limitati ai soli
    // domini Google Ads elencati sotto.
    `script-src 'self' 'unsafe-inline' ${GOOGLE_AD_ORIGINS.join(" ")}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src ${imgSrc.join(" ")}`,
    `font-src 'self' data:`,
    `connect-src 'self' ${GOOGLE_AD_ORIGINS.join(" ")}`,
    `frame-src ${GOOGLE_AD_ORIGINS.join(" ")}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
  async headers() {
    const baseHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // CSP e HSTS solo in produzione: in sviluppo (Turbopack, hot reload)
    // richiederebbero eccezioni che vanificherebbero la protezione.
    if (process.env.NODE_ENV === "production") {
      baseHeaders.push(
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "Content-Security-Policy", value: buildCsp() }
      );
    }

    return [{ source: "/(.*)", headers: baseHeaders }];
  },
};

export default nextConfig;
