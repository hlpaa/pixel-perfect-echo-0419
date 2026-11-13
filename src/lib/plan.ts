/** Dias que um pacote dura: (kg * 1000) / gramas por dia, arredondado para baixo. */
export function daysOfFood(packageKg: number, dailyGrams: number): number {
  if (!(packageKg > 0) || !(dailyGrams > 0)) return 0;
  return Math.floor((packageKg * 1000) / dailyGrams);
}

/** Soma dias a uma data 'YYYY-MM-DD' e devolve 'YYYY-MM-DD'. */
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Link do WhatsApp com mensagem pronta. Aceita telefone com máscara; adiciona 55 se faltar. */
export function whatsappLink(phone: string | null | undefined, message: string): string {
  let digits = (phone ?? "").replace(/\D/g, "");
  if (digits && !digits.startsWith("55")) digits = `55${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
