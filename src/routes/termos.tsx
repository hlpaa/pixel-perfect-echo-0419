import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/app/public-layout";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de uso — Ração em Dia" }, { name: "description", content: "Termos de uso da plataforma Ração em Dia." }, { property: "og:title", content: "Termos de uso — Ração em Dia" }, { property: "og:description", content: "Termos de uso da plataforma Ração em Dia." }] }),
  component: () => (
    <PublicPage title="Termos de uso">
      <p>Texto-base em elaboração. Conteúdo definitivo será publicado pela equipe Ração em Dia.</p>
    </PublicPage>
  ),
});
