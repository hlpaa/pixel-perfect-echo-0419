import { createFileRoute } from "@tanstack/react-router";
import { PublicPage } from "@/components/app/public-layout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Política de privacidade — Ração em Dia" }, { name: "description", content: "Política de privacidade da plataforma Ração em Dia." }, { property: "og:title", content: "Política de privacidade — Ração em Dia" }, { property: "og:description", content: "Política de privacidade da plataforma Ração em Dia." }] }),
  component: () => (
    <PublicPage title="Política de privacidade">
      <p>Texto-base em elaboração. Conteúdo definitivo será publicado pela equipe Ração em Dia.</p>
    </PublicPage>
  ),
});
