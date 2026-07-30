import { createFileRoute, Link } from "@tanstack/react-router";
import { NavHeader } from "@/components/NavHeader";

export const Route = createFileRoute("/paginas")({
  head: () => ({
    meta: [{ title: "Páginas — Painel Interno" }],
  }),
  component: PaginasPage,
});

const PAGES: { path: string; name: string; description: string; external?: boolean }[] = [
  { path: "/", name: "Escala de Trabalho", description: "Escala da equipe" },
  { path: "/metas", name: "Metas 1º Q 2026", description: "Metas do primeiro quadrimestre" },
  { path: "/metas-2q", name: "Metas 2º Q 2026", description: "Metas do segundo quadrimestre" },
  { path: "/ativacoes", name: "Ativações", description: "Painel de ativações" },
  { path: "/resumo", name: "Resumo", description: "Resumo consolidado" },
  { path: "/resumo-criticos", name: "Críticos", description: "Resumo de pontos críticos" },
  { path: "/torcida-premiada", name: "Torcida Premiada", description: "Landing page da campanha", external: true },
];

function PaginasPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavHeader />
      <main className="max-w-6xl mx-auto px-6 pb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Páginas do Projeto</h1>
        <p className="text-slate-600 mb-8">Lista de todas as páginas criadas neste painel.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGES.map((p) =>
            p.external ? (
              <a
                key={p.path}
                href={p.path}
                target="_blank"
                rel="noreferrer"
                className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-[#A01310] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-bold text-slate-900">{p.name}</h2>
                  <span className="text-xs font-semibold text-[#A01310] bg-red-50 px-2 py-1 rounded">Nova aba</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{p.description}</p>
                <code className="text-xs text-slate-500">{p.path}</code>
              </a>
            ) : (
              <Link
                key={p.path}
                to={p.path}
                className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-[#A01310] hover:shadow-md transition-all"
              >
                <h2 className="font-bold text-slate-900 mb-2">{p.name}</h2>
                <p className="text-sm text-slate-600 mb-3">{p.description}</p>
                <code className="text-xs text-slate-500">{p.path}</code>
              </Link>
            ),
          )}
        </div>
      </main>
    </div>
  );
}
