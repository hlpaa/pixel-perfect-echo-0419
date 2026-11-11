import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/app/public-layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre o projeto — Ração em Dia" }, { name: "description", content: "Sobre o projeto da plataforma Ração em Dia." }, { property: "og:title", content: "Sobre o projeto — Ração em Dia" }, { property: "og:description", content: "Sobre o projeto da plataforma Ração em Dia." }] }),
  component: () => (
    <PublicPage title="Sobre o projeto">
      <p>Texto-base em elaboração. Conteúdo definitivo será publicado pela equipe Ração em Dia.</p>
    </PublicPage>
  ),
});
