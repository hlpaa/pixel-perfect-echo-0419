import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS, PLAN_STATUS, type OrderStatus } from "@/lib/format";
import type { FoodStatus } from "@/lib/forecast";

export function Logo({ to = "/", className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 font-semibold text-foreground", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <PawPrint className="h-4 w-4" />
      </span>
      <span className="text-lg tracking-tight">Ração em Dia</span>
    </Link>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border bg-card p-5 shadow-soft", className)}>{children}</div>;
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      {icon && <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-primary">{icon}</div>}
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

const pill = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function FoodStatusBadge({ status }: { status: FoodStatus }) {
  const map: Record<FoodStatus, [string, string]> = {
    ok: ["bg-success-soft text-primary", "Estoque suficiente"],
    proximo: ["bg-highlight-soft text-highlight-foreground", "Reposição próxima"],
    critico: ["bg-destructive-soft text-destructive", "Previsão atingida"],
    sem_dados: ["bg-muted text-muted-foreground", "Sem previsão"],
  };
  const [c, l] = map[status];
  return (
    <span className={cn(pill, c)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {l}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c =
    status === "cancelado"
      ? "bg-destructive-soft text-destructive"
      : status === "entregue"
        ? "bg-success-soft text-primary"
        : status === "aguardando_confirmacao"
          ? "bg-highlight-soft text-highlight-foreground"
          : "bg-primary-soft text-primary-soft-foreground";
  return <span className={cn(pill, c)}>{ORDER_STATUS[status]}</span>;
}

export function PlanStatusBadge({ status }: { status: keyof typeof PLAN_STATUS }) {
  const c = status === "ativo" ? "bg-success-soft text-primary" : status === "pausado" ? "bg-highlight-soft text-highlight-foreground" : "bg-destructive-soft text-destructive";
  return <span className={cn(pill, c)}>{PLAN_STATUS[status]}</span>;
}

export function LoadingBlock() {
  return <div className="h-32 animate-pulse rounded-xl bg-muted" />;
}
