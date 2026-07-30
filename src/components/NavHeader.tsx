import { Link } from "@tanstack/react-router";

export function NavHeader() {
  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm mb-6">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#A01310] rounded-full flex items-center justify-center">
            <span className="text-white font-black text-lg">S</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">Painel Interno</span>
        </div>
        <nav className="flex items-center justify-center flex-wrap gap-2">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Escala de Trabalho
          </Link>
          <Link
            to="/metas"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Metas 1º Q 2026
          </Link>
          <Link
            to="/metas-2q"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Metas 2º Q 2026
          </Link>
          <Link
            to="/ativacoes"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Ativações
          </Link>
          <Link
            to="/resumo"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Resumo
          </Link>
          <Link
            to="/resumo-criticos"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Críticos
          </Link>
          <a
            href="/torcida-premiada"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Torcida Premiada
          </a>
          <Link
            to="/atingimento-ddd"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Atingimento DDD
          </Link>
          <Link
            to="/paginas"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold bg-[#A01310] text-white hover:bg-[#7a0e0c]" }}
          >
            Páginas
          </Link>




        </nav>
      </div>
    </header>
  );
}
