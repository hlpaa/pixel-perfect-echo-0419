import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicPage } from "@/components/app/public-layout";
import { errMsg } from "@/lib/format";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: "signup" } => (s.mode === "signup" ? { mode: "signup" } : {}),
  head: () => ({ meta: [{ title: "Entrar — Ração em Dia" }, { name: "description", content: "Entre ou crie sua conta na Ração em Dia." }, { property: "og:title", content: "Entrar — Ração em Dia" }, { property: "og:description", content: "Entre ou crie sua conta na Ração em Dia." }] }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const [signup, setSignup] = useState(mode === "signup");
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (signup) {
        const { error } = await supabase.auth.signUp({ email: f.email, password: f.password, options: { emailRedirectTo: window.location.origin, data: { full_name: f.name, phone: f.phone } } });
        if (error) throw error;
        toast.success("Conta criada! Confirme seu e-mail para entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <PublicPage title={signup ? "Criar conta" : "Entrar"}>
      <form onSubmit={submit} className="max-w-sm space-y-3">
        {signup && (<>
          <div><Label>Nome completo</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><Label>Telefone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        </>)}
        <div><Label>E-mail</Label><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><Label>Senha</Label><Input type="password" required minLength={6} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Aguarde..." : signup ? "Criar conta" : "Entrar"}</Button>
        <button type="button" className="text-sm text-primary" onClick={() => setSignup(!signup)}>{signup ? "Já tenho conta" : "Criar uma conta"}</button>
      </form>
    </PublicPage>
  );
}
