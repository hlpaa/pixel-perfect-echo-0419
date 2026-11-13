import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Bell, PawPrint, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader, PublicFooter } from "@/components/app/public-layout";
import hero from "@/assets/hero-pets.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ração em Dia — Reposição de ração para cães e gatos" },
      { name: "description", content: "Saiba quando a ração do seu pet vai acabar e organize a reposição sem correria." },
      { property: "og:title", content: "Ração em Dia — Reposição de ração para cães e gatos" },
      { property: "og:description", content: "Saiba quando a ração do seu pet vai acabar e organize a reposição sem correria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: PawPrint, t: "Monte seu plano", d: "Informe a ração, o tamanho do pacote e quanto ele come por dia." },
  { icon: CalendarClock, t: "Veja quanto dura", d: "Calculamos na hora quantos dias o pacote rende." },
  { icon: Bell, t: "Feche pelo WhatsApp", d: "Combinamos a entrega pelo WhatsApp e avisamos antes da próxima acabar." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">A ração do seu pet sempre em dia.</h1>
            <p className="mt-4 text-lg text-muted-foreground">Organize a reposição de ração de cães e gatos sem esquecer e sem correria de última hora.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild><Link to="/montar-plano">Montar meu plano</Link></Button>
              <Button size="lg" variant="outline" asChild><a href="#como-funciona">Como funciona</a></Button>
            </div>
          </div>
          <img src={hero} alt="Cão e gato ao lado de um pote de ração" className="w-full rounded-2xl" width={1024} height={768} />
        </section>
        <section id="como-funciona" className="bg-card py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold">Como funciona</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.t} className="rounded-xl border bg-background p-6">
                  <s.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="beneficios" className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 shrink-0 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Seus dados protegidos</h2>
              <p className="mt-2 text-muted-foreground">Cada cliente vê apenas as próprias informações e pedidos.</p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
