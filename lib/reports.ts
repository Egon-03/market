export type ReportReason = { value: string; label: string };

export const LISTING_REPORT_REASONS: ReportReason[] = [
  { value: "vietato", label: "Articolo vietato o illegale" },
  { value: "truffa", label: "Sospetto di truffa" },
  { value: "spam", label: "Spam o annuncio duplicato" },
  { value: "inappropriato", label: "Contenuto inappropriato" },
  { value: "ingannevole", label: "Prezzo o descrizione ingannevole" },
  { value: "altro", label: "Altro motivo" },
];

export const USER_REPORT_REASONS: ReportReason[] = [
  { value: "truffa", label: "Ha tentato di truffarmi" },
  { value: "molestie", label: "Comportamento offensivo o molestie" },
  { value: "spam", label: "Spam o messaggi indesiderati" },
  { value: "falso-account", label: "Account falso o impersonificazione" },
  { value: "altro", label: "Altro motivo" },
];

export function getListingReportReasonLabel(value: string): string {
  return LISTING_REPORT_REASONS.find((r) => r.value === value)?.label ?? value;
}

export function getUserReportReasonLabel(value: string): string {
  return USER_REPORT_REASONS.find((r) => r.value === value)?.label ?? value;
}

export const REPORT_STATUS_LABELS: Record<string, string> = {
  in_attesa: "In attesa",
  risolta: "Risolta",
  archiviata: "Archiviata",
};
