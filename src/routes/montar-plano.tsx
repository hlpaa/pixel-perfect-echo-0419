import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PublicHeader, PublicFooter } from "@/components/app/public-layout";
import { useSettings } from "@/hooks/use-session";
import { daysOfFood, whatsappLink } from "@/lib/plan";
import { errMsg } from "@/lib/format";

export const Route = createFileRoute("/montar-plano")({
  head: () => ({
    meta: [
      { title: "Monte seu plano — Ração em Dia" },
      { name: "description", content: "Conte sobre seu pet e a ração dele. Calculamos quando ela acaba e combinamos a reposição pelo WhatsApp." },
      { property: "og:title", content: "Monte seu plano — Ração em Dia" },
      { property: "og:description", content: "Conte sobre seu pet e combine a reposição de ração pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MontarPlano,
});

const empty = { name: "", whatsapp: "", neighborhood: "", pet_name: "", species: "cachorro" as "cachorro" | "gato", pet_weight_kg: "", food_brand: "", package_kg: "", daily_grams: "", notes: "" };

function MontarPlano() {
  const { data: settings } = useSettings();
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const days = daysOfFood(Number(f.package_kg), Number(f.daily_grams));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: f.name.trim(), whatsapp: f.whatsapp.trim(), neighborhood: f.neighborhood.trim() || null,
        pet_name: f.pet_name.trim(), species: f.species, pet_weight_kg: f.pet_weight_kg ? Number(f.pet_weight_kg) : null,
        food_brand: f.food_brand.trim() || null, package_kg: Number(f.package_kg), daily_grams: Number(f.daily_grams),
        notes: f.notes.trim() || null,
      });
      if (error) throw error;
      const msg = `Olá! Sou ${f.name} e montei meu plano no site.\nPet: ${f.pet_name} (${f.species})\nRação: ${f.food_brand || "a definir"} — pacote de ${f.package_kg} kg, ${f.daily_grams} g/dia (dura ~${days} dias)\nBairro: ${f.neighborhood || "-"}`;
      const url = whatsappLink(settings?.support_phone, msg);
      setWaUrl(url);
      window.open(url, "_blank");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Monte seu plano</h1>
        <p className="mt-2 text-muted-foreground">Leva 1 minuto. No fim, você fala com a gente pelo WhatsApp para fechar a primeira entrega.</p>
        {waUrl ? (
          <div className="mt-8 rounded-xl border bg-card p-6">
            <h2 className="text-xl font-semibold">Plano recebido! 🐾</h2>
            <p className="mt-2 text-muted-foreground">Se o WhatsApp não abriu sozinho, toque no botão abaixo.</p>
            <Button asChild size="lg" className="mt-4"><a href={waUrl} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-5 w-5" />Abrir WhatsApp</a></Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-6">
            <fieldset className="space-y-3">
              <legend className="font-semibold">Seu pet</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Nome do pet</Label><Input required maxLength={60} value={f.pet_name} onChange={set("pet_name")} /></div>
                <div><Label>Espécie</Label>
                  <div className="mt-1 flex gap-2">
                    {(["cachorro", "gato"] as const).map((s) => (
                      <Button key={s} type="button" variant={f.species === s ? "default" : "outline"} onClick={() => setF({ ...f, species: s })}>{s === "cachorro" ? "Cachorro" : "Gato"}</Button>
                    ))}
                  </div>
                </div>
                <div><Label>Peso (kg, opcional)</Label><Input type="number" step="0.1" min="0.1" value={f.pet_weight_kg} onChange={set("pet_weight_kg")} /></div>
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-semibold">A ração</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3"><Label>Marca / linha</Label><Input maxLength={120} placeholder="Ex.: Premier Adulto Raças Médias" value={f.food_brand} onChange={set("food_brand")} /></div>
                <div><Label>Pacote (kg)</Label><Input required type="number" step="0.1" min="0.1" max="50" value={f.package_kg} onChange={set("package_kg")} /></div>
                <div><Label>Gramas por dia</Label><Input required type="number" min="1" max="3000" value={f.daily_grams} onChange={set("daily_grams")} /></div>
                <div className="flex items-end"><p className="text-sm text-muted-foreground">{days > 0 ? <>Dura cerca de <strong className="text-foreground">{days} dias</strong></> : "Preencha para calcular"}</p></div>
              </div>
            </fieldset>
            <fieldset className="space-y-3">
              <legend className="font-semibold">Você</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Seu nome</Label><Input required minLength={2} maxLength={120} value={f.name} onChange={set("name")} /></div>
                <div><Label>WhatsApp</Label><Input required type="tel" minLength={8} maxLength={20} placeholder="(81) 99999-0000" value={f.whatsapp} onChange={set("whatsapp")} /></div>
                <div className="sm:col-span-2"><Label>Bairro</Label><Input maxLength={120} value={f.neighborhood} onChange={set("neighborhood")} /></div>
                <div className="sm:col-span-2"><Label>Observações (opcional)</Label><Textarea maxLength={1000} value={f.notes} onChange={set("notes")} /></div>
              </div>
            </fieldset>
            <Button type="submit" size="lg" disabled={busy} className="w-full"><MessageCircle className="mr-2 h-5 w-5" />{busy ? "Enviando..." : "Enviar e continuar no WhatsApp"}</Button>
          </form>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
