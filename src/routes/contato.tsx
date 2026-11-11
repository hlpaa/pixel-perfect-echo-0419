import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/app/public-layout";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Ração em Dia" }, { name: "description", content: "Contato da plataforma Ração em Dia." }, { property: "og:title", content: "Contato — Ração em Dia" }, { property: "og:description", content: "Contato da plataforma Ração em Dia." }] }),
  component: () => (
    <PublicPage title="Contato">
      <p>Texto-base em elaboração. Conteúdo definitivo será publicado pela equipe Ração em Dia.</p>
    </PublicPage>
  ),
});
