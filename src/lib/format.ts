export const DEFAULT_TZ = "America/Recife";

export function todayISO(tz: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** 'YYYY-MM-DD' ou timestamp -> DD/MM/AAAA */
export function fmtDate(value: string | null | undefined, tz: string = DEFAULT_TZ): string {
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  return new Intl.DateTimeFormat("pt-BR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export function fmtDateTime(value: string | null | undefined, tz: string = DEFAULT_TZ): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function fmtBRL(value: number | null | undefined): string {
  if (value === null || value === undefined) return "A confirmar";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));
}

export function fmtKg(grams: number | null | undefined): string {
  if (!grams) return "—";
  return grams >= 1000 ? `${(grams / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg` : `${grams} g`;
}

export const ORDER_STATUS = {
  aguardando_confirmacao: "Aguardando confirmação",
  confirmado: "Confirmado",
  em_preparacao: "Em preparação",
  saiu_para_entrega: "Saiu para entrega",
  entregue: "Entregue",
  cancelado: "Cancelado",
} as const;
export type OrderStatus = keyof typeof ORDER_STATUS;
export const ORDER_STATUS_LIST = Object.keys(ORDER_STATUS) as OrderStatus[];

export const PLAN_STATUS = { ativo: "Ativo", pausado: "Pausado", cancelado: "Cancelado" } as const;
export const SPECIES = { cachorro: "Cachorro", gato: "Gato" } as const;

export function errMsg(e: unknown): string {
  const m = (e as { message?: string })?.message ?? "Algo deu errado. Tente novamente.";
  if (m.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("User already registered")) return "Já existe uma conta com este e-mail.";
  if (m.includes("Password should be")) return "A senha deve ter pelo menos 6 caracteres.";
  return m;
}
