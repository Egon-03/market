export const CANTONS = [
  { code: "AG", name: "Argovia" },
  { code: "AI", name: "Appenzello Interno" },
  { code: "AR", name: "Appenzello Esterno" },
  { code: "BE", name: "Berna" },
  { code: "BL", name: "Basilea Campagna" },
  { code: "BS", name: "Basilea Città" },
  { code: "FR", name: "Friburgo" },
  { code: "GE", name: "Ginevra" },
  { code: "GL", name: "Glarona" },
  { code: "GR", name: "Grigioni" },
  { code: "JU", name: "Giura" },
  { code: "LU", name: "Lucerna" },
  { code: "NE", name: "Neuchâtel" },
  { code: "NW", name: "Nidvaldo" },
  { code: "OW", name: "Obvaldo" },
  { code: "SG", name: "San Gallo" },
  { code: "SH", name: "Sciaffusa" },
  { code: "SO", name: "Soletta" },
  { code: "SZ", name: "Svitto" },
  { code: "TG", name: "Turgovia" },
  { code: "TI", name: "Ticino" },
  { code: "UR", name: "Uri" },
  { code: "VD", name: "Vaud" },
  { code: "VS", name: "Vallese" },
  { code: "ZG", name: "Zugo" },
  { code: "ZH", name: "Zurigo" },
] as const;

export function getCantonName(code: string): string {
  return CANTONS.find((c) => c.code === code)?.name ?? code;
}
