import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, ClipboardCheck, FileUp, LayoutList, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const navigation = [
  { to: "/estrutura", label: "Estrutura", icon: LayoutList },
  { to: "/importar", label: "Importar", icon: FileUp },
  { to: "/conferencia", label: "Conferência", icon: ClipboardCheck },
  { to: "/relatorio", label: "Relatório", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname === "/") return children;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-6 px-4 lg:px-8">
          <Link to="/estrutura" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-sm font-black text-primary-foreground">RF</div>
            <div><strong className="block text-lg leading-none">RedeFlex</strong><span className="text-xs text-muted-foreground">Gestão de indicadores</span></div>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {navigation.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-primary/10 text-primary" }}><Icon className="h-4 w-4" />{label}</Link>)}
          </nav>
          <Button className="ml-auto md:hidden" variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</Button>
        </div>
        {open && <nav className="grid gap-1 border-t p-3 md:hidden">{navigation.map(({ to, label, icon: Icon }) => <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium" activeProps={{ className: "bg-primary/10 text-primary" }}><Icon className="h-4 w-4" />{label}</Link>)}</nav>}
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}