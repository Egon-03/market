export function formatPrice(price: number | null): string {
  if (price === null) return "Prezzo da concordare";
  if (price === 0) return "Gratis";
  return `CHF ${price.toLocaleString("it-CH", {
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("it-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "pochi secondi fa";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min fa`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 ora fa" : `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "ieri" : `${days} giorni fa`;
  return formatDate(date);
}

export function parseImages(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
