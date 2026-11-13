import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession, useSettings, useTz } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/app/brand";
import { addDays, daysOfFood, whatsappLink } from "@/lib/plan";
import { errMsg, fmtBRL, fmtDate, fmtDateTime, todayISO } from "@/lib/format";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Painel — Ração em Dia" }, { name: "description", content: "Painel de administração da Ração em Dia." }, { property: "og:title", content: "Painel — Ração em Dia" }, { property: "og:description", content: "Painel de administração." }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Lead = Tables<"leads">;
const LEAD_STATUS: Record<string, string> = { novo: "Novo", em_conversa: "Em conversa", cliente: "Cliente", perdido: "Perdido" };

function useLeads() {
  return useQuery({ queryKey: ["leads"], queryFn: async () => { const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; } });
}
function useDeliveries() {
  return useQuery({ queryKey: ["deliveries"], queryFn: async () => { const { data, error } = await supabase.from("deliveries").select("*, leads(name, pet_name, whatsapp, daily_grams)").order("delivery_date", { ascending: false }); if (error) throw error; return data; } });
}
function useReminders() {
  return useQuery({ queryKey: ["reminders"], queryFn: async () => { const { data, error } = await supabase.from("reminders").select("*, leads(name, pet_name, whatsapp)").order("remind_on"); if (error) throw error; return data; } });
}

function AdminPage() {
  const { user, loading } = useSession();
  const { data: isAdmin, isLoading } = useIsAdmin(user?.id);
  if (loading || (user && isLoading)) return <p className="p-8 text-muted-foreground">Carregando...</p>;
  if (!user) return <Gate text="Entre com sua conta de administrador." />;
  if (!isAdmin) return <Gate text="Esta conta não tem acesso ao painel." />;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"><Logo /><Button variant="ghost" onClick={() => supabase.auth.signOut()}>Sair</Button></div></header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="leads">
          <TabsList className="flex-wrap"><TabsTrigger value="leads">Leads</TabsTrigger><TabsTrigger value="clientes">Clientes</TabsTrigger><TabsTrigger value="entregas">Entregas</TabsTrigger><TabsTrigger value="lembretes">Lembretes</TabsTrigger><TabsTrigger value="config">Configurações</TabsTrigger></TabsList>
          <TabsContent value="leads"><LeadsTab filter={(l) => l.status !== "cliente"} empty="Nenhum lead ainda. Eles aparecem aqui quando alguém monta um plano." /></TabsContent>
          <TabsContent value="clientes"><LeadsTab filter={(l) => l.status === "cliente"} empty="Nenhum cliente ainda. Marque um lead como Cliente quando a venda fechar." isClients /></TabsContent>
          <TabsContent value="entregas"><DeliveriesTab /></TabsContent>
          <TabsContent value="lembretes"><RemindersTab /></TabsContent>
          <TabsContent value="config"><SettingsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Gate({ text }: { text: string }) {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center"><Logo /><p className="text-muted-foreground">{text}</p><Button asChild><Link to="/auth">Entrar</Link></Button></div>;
}

function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-xl border bg-card p-4">{children}</div>; }

function LeadsTab({ filter, empty, isClients }: { filter: (l: Lead) => boolean; empty: string; isClients?: boolean }) {
  const { data = [] } = useLeads();
  const tz = useTz();
  const qc = useQueryClient();
  const upd = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("leads").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }), onError: (e) => toast.error(errMsg(e)),
  });
  const rows = data.filter(filter);
  if (!rows.length) return <p className="py-10 text-center text-muted-foreground">{empty}</p>;
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {rows.map((l) => (
        <Card key={l.id}>
          <div className="flex items-start justify-between gap-2">
            <div><p className="font-semibold">{l.name}</p><p className="text-sm text-muted-foreground">{l.whatsapp} · {l.neighborhood || "sem bairro"}</p></div>
            <Badge variant="secondary">{LEAD_STATUS[l.status]}</Badge>
          </div>
          <p className="mt-2 text-sm">{l.pet_name} ({l.species}) — {l.food_brand || "ração a definir"}, {l.package_kg} kg, {l.daily_grams} g/dia · dura ~{daysOfFood(Number(l.package_kg), l.daily_grams)} dias</p>
          {l.notes && <p className="mt-1 text-sm text-muted-foreground">“{l.notes}”</p>}
          <p className="mt-1 text-xs text-muted-foreground">{fmtDateTime(l.created_at, tz)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" asChild><a href={whatsappLink(l.whatsapp, `Olá ${l.name}! Aqui é da Ração em Dia.`)} target="_blank" rel="noreferrer"><MessageCircle className="mr-1 h-4 w-4" />WhatsApp</a></Button>
            {!isClients && Object.entries(LEAD_STATUS).filter(([k]) => k !== l.status).map(([k, v]) => <Button key={k} size="sm" variant="outline" onClick={() => upd.mutate({ id: l.id, status: k })}>{v}</Button>)}
          </div>
        </Card>
      ))}
    </div>
  );
}

function DeliveriesTab() {
  const { data: leads = [] } = useLeads();
  const { data = [] } = useDeliveries();
  const tz = useTz();
  const qc = useQueryClient();
  const clients = leads.filter((l) => l.status === "cliente");
  const [f, setF] = useState({ lead_id: "", delivery_date: todayISO(tz), package_kg: "", amount: "" });
  const create = useMutation({
    mutationFn: async () => {
      const lead = clients.find((c) => c.id === f.lead_id);
      if (!lead) throw new Error("Escolha um cliente.");
      const kg = Number(f.package_kg || lead.package_kg);
      const { error } = await supabase.from("deliveries").insert({ lead_id: lead.id, delivery_date: f.delivery_date, package_kg: kg, amount: f.amount ? Number(f.amount) : null });
      if (error) throw error;
      const days = daysOfFood(kg, lead.daily_grams);
      if (days > 0) {
        const { error: e2 } = await supabase.from("reminders").insert({ lead_id: lead.id, remind_on: addDays(f.delivery_date, Math.max(days - 5, 0)), note: `Ração acaba por volta de ${fmtDate(addDays(f.delivery_date, days))}` });
        if (e2) throw e2;
      }
    },
    onSuccess: () => { toast.success("Entrega registrada e lembrete criado."); qc.invalidateQueries({ queryKey: ["deliveries"] }); qc.invalidateQueries({ queryKey: ["reminders"] }); setF({ ...f, package_kg: "", amount: "" }); },
    onError: (e) => toast.error(errMsg(e)),
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { const { error } = await supabase.from("deliveries").update({ status }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deliveries"] }), onError: (e) => toast.error(errMsg(e)),
  });
  return (
    <div className="mt-4 space-y-4">
      <Card>
        <p className="mb-3 font-semibold">Nova entrega</p>
        <div className="grid gap-3 sm:grid-cols-5">
          <div className="sm:col-span-2"><Label>Cliente</Label>
            <select className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm" value={f.lead_id} onChange={(e) => setF({ ...f, lead_id: e.target.value })}>
              <option value="">Escolha…</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.pet_name}</option>)}
            </select>
          </div>
          <div><Label>Data</Label><Input type="date" value={f.delivery_date} onChange={(e) => setF({ ...f, delivery_date: e.target.value })} /></div>
          <div><Label>Pacote (kg)</Label><Input type="number" step="0.1" placeholder="do plano" value={f.package_kg} onChange={(e) => setF({ ...f, package_kg: e.target.value })} /></div>
          <div><Label>Valor (R$)</Label><Input type="number" step="0.01" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} /></div>
        </div>
        <Button className="mt-3" disabled={create.isPending} onClick={() => create.mutate()}>Registrar entrega</Button>
        {!clients.length && <p className="mt-2 text-sm text-muted-foreground">Marque um lead como Cliente para registrar entregas.</p>}
      </Card>
      {data.map((d) => (
        <Card key={d.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-semibold">{d.leads?.name} — {d.leads?.pet_name}</p><p className="text-sm text-muted-foreground">{fmtDate(d.delivery_date)} · {d.package_kg} kg · {fmtBRL(d.amount)}</p></div>
            <div className="flex gap-2"><Badge variant="secondary">{d.status}</Badge>
              {d.status === "agendada" && <><Button size="sm" onClick={() => setStatus.mutate({ id: d.id, status: "entregue" })}>Entregue</Button><Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: d.id, status: "cancelada" })}>Cancelar</Button></>}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RemindersTab() {
  const { data = [] } = useReminders();
  const tz = useTz();
  const today = todayISO(tz);
  const qc = useQueryClient();
  const done = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("reminders").update({ done: true }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }), onError: (e) => toast.error(errMsg(e)),
  });
  const open = data.filter((r) => !r.done);
  if (!open.length) return <p className="py-10 text-center text-muted-foreground">Nenhum lembrete pendente. Eles são criados automaticamente a cada entrega.</p>;
  return (
    <div className="mt-4 space-y-3">
      {open.map((r) => (
        <Card key={r.id}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-semibold">{r.leads?.name} — {r.leads?.pet_name} {r.remind_on <= today && <Badge className="ml-2" variant="destructive">Hoje / atrasado</Badge>}</p><p className="text-sm text-muted-foreground">Avisar em {fmtDate(r.remind_on)} · {r.note}</p></div>
            <div className="flex gap-2">
              <Button size="sm" asChild><a href={whatsappLink(r.leads?.whatsapp, `Oi ${r.leads?.name}! A ração do ${r.leads?.pet_name} está acabando. Vamos agendar a próxima entrega?`)} target="_blank" rel="noreferrer"><MessageCircle className="mr-1 h-4 w-4" />Avisar</a></Button>
              <Button size="sm" variant="outline" onClick={() => done.mutate(r.id)}>Concluído</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SettingsTab() {
  const { data } = useSettings();
  const qc = useQueryClient();
  const [phone, setPhone] = useState<string | null>(null);
  const value = phone ?? data?.support_phone ?? "";
  const save = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("app_settings").update({ support_phone: value }).eq("id", 1); if (error) throw error; },
    onSuccess: () => { toast.success("Salvo."); qc.invalidateQueries({ queryKey: ["settings"] }); }, onError: (e) => toast.error(errMsg(e)),
  });
  return (
    <div className="mt-4 max-w-sm space-y-3">
      <div><Label>WhatsApp da loja (recebe os planos)</Label><Input type="tel" placeholder="(81) 99999-0000" value={value} onChange={(e) => setPhone(e.target.value)} /></div>
      <Button onClick={() => save.mutate()}>Salvar</Button>
    </div>
  );
}
