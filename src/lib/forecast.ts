// Regras de previsão de consumo de ração.
export type FoodStatus = "ok" | "proximo" | "critico" | "sem_dados";

/** Dias estimados = gramas do pacote / consumo diário (arredondado para baixo). */
export function estimateDays(packageGrams: number, dailyGrams: number | null | undefined): number | null {
  if (!dailyGrams || dailyGrams <= 0 || !packageGrams || packageGrams <= 0) return null;
  return Math.floor(packageGrams / dailyGrams);
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export function diffDaysISO(fromISO: string, toISO: string): number {
  const a = Date.UTC(...(fromISO.split("-").map(Number).map((v, i) => (i === 1 ? v - 1 : v)) as [number, number, number]));
  const b = Date.UTC(...(toISO.split("-").map(Number).map((v, i) => (i === 1 ? v - 1 : v)) as [number, number, number]));
  return Math.round((b - a) / 86400000);
}

/** Data de término: manual tem prioridade; sem consumo e sem manual => null. */
export function estimateEndDate(
  openedISO: string,
  packageGrams: number,
  dailyGrams: number | null | undefined,
  manualEndISO?: string | null,
): string | null {
  if (manualEndISO) return manualEndISO;
  const days = estimateDays(packageGrams, dailyGrams);
  if (days === null) return null;
  return addDaysISO(openedISO, days);
}

export function daysRemaining(endISO: string | null | undefined, todayISO: string): number | null {
  if (!endISO) return null;
  return diffDaysISO(todayISO, endISO);
}

/** Verde: suficiente; amarelo: dentro da antecedência; vermelho: término atingido. */
export function foodStatus(daysLeft: number | null, reminderDays: number): FoodStatus {
  if (daysLeft === null) return "sem_dados";
  if (daysLeft <= 0) return "critico";
  if (daysLeft <= reminderDays) return "proximo";
  return "ok";
}

export function monthlyConsumptionGrams(dailyGrams: number | null | undefined): number | null {
  if (!dailyGrams || dailyGrams <= 0) return null;
  return dailyGrams * 30;
}
