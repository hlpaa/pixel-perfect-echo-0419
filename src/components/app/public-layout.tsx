import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./brand";
import { useSession } from "@/hooks/use-session";

export function PublicHeader() {
  const { user } = useSession();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="/#como-funciona" className="hover:text-foreground">Como funciona</a>
          <a href="/#beneficios" className="hover:text-foreground">Benefícios</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild><Link to="/admin">Painel</Link></Button>
          ) : (
            <>
              <Button asChild><Link to="/montar-plano">Montar plano</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">Reposição de ração organizada para cães e gatos.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/sobre" className="hover:text-foreground">Sobre o projeto</Link>
          <Link to="/contato" className="hover:text-foreground">Contato</Link>
          <Link to="/termos" className="hover:text-foreground">Termos de uso</Link>
          <Link to="/privacidade" className="hover:text-foreground">Política de privacidade</Link>
        </nav>
      </div>
    </footer>
  );
}

export function PublicPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
      </main>
      <PublicFooter />
    </div>
  );
}
