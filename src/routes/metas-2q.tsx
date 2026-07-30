import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavHeader } from "@/components/NavHeader";

export const Route = createFileRoute("/metas-2q")({
  head: () => ({
    meta: [
      { title: "Metas 2º Q 2026 — Painel Interno" },
      { name: "description", content: "Quadro de metas do 2º quadrimestre de 2026." },
    ],
  }),
  component: MetasPage,
});

type Quality = "hd" | "fhd" | "4k";

const QUALITIES: Record<Quality, { label: string; resolution: string; file: string; sizeHint: string }> = {
  hd: { label: "HD", resolution: "1280 × 720", file: "/metas_2q_hd.png", sizeHint: "Ideal p/ e-mail" },
  fhd: { label: "Full HD", resolution: "1920 × 1080", file: "/metas_2q_fhd.png", sizeHint: "Recomendado" },
  "4k": { label: "4K Ultra HD", resolution: "3840 × 2160", file: "/metas_2q_4k.png", sizeHint: "Máxima nitidez" },
};

function todayStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const METAS_DATA = [
  { n: 1, meta: "Atingir meta de gastos estabelecida para área no 2º Q26", detalhe: "Realizado de despesas menor que o orçamento planejado para o quadrimestre." },
  { n: 2, meta: "Atingir a Receita de Ativação prevista para o Quadrimestre", detalhe: "Garantir o acompanhamento das ativações mensalmente, atuando na redução da dispersão entre o que foi ativado e que realmente foi pago." },
  { n: 3, meta: "Cockpit de Gestão Comercial: Do Macro ao PDV", detalhe: "Cockpit de Gestão Comercial: Do Macro ao PDV" },
  { n: 4, meta: "Análise de dados - Implantação de Inteligência Analítica Comercial", detalhe: "Análise de dados - Implantação de Inteligência Analítica Comercial" },
  { n: 5, meta: "Criar o painel de POS PARADA visão consolidada (Move e DX) Visão Logistica", detalhe: "Criar o painel de Gestão das POS visão consolidada (Move e DX) Visão Logistica. (Estoque / POS Parada / Modelos / depósitos / etc). Reduzir o % de POS parada em 30%. Reduzir o tempo de geração das informações do parque de máquinas e aumentar a confiabilidade do dado." },
];


function MetasPage() {
  const [quality, setQuality] = useState<Quality>("fhd");
  const [downloading, setDownloading] = useState(false);
  const current = QUALITIES[quality];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(current.file);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Metas_2Q_16x9_${current.label}_${todayStamp()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center">
      <NavHeader />

      <div
        className="bg-white shadow-2xl overflow-hidden relative flex flex-col mb-6 rounded-[40px]"
        style={{ width: "1280px", height: "720px", minWidth: "1280px", transform: "scale(0.7)", transformOrigin: "top center" }}
      >
        <div className="bg-[#A01310] h-16 flex items-center px-12 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#A01310] font-black text-xl">M</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight uppercase">Quadro de Metas</h1>
          </div>
          <div className="text-white/80 text-sm font-medium">2º Quadrimestre 2026</div>
        </div>

        <div className="flex-1 p-8 flex flex-col overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_1.6fr] gap-2 mb-1">
            <div className="bg-[#A01310] text-white text-[17px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg text-center">#</div>
            <div className="bg-[#A01310] text-white text-[17px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg">Meta</div>
            <div className="bg-[#A01310] text-white text-[17px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg">Detalhe da Meta</div>
          </div>

          <div className="flex-1 space-y-[3px]">
            {METAS_DATA.map((row, idx) => (
              <div key={row.n} className="grid grid-cols-[60px_1fr_1.6fr] gap-2">
                <div className={`${idx % 2 === 0 ? "bg-slate-50" : "bg-white"} border border-slate-200 rounded-lg px-3 py-2 text-center text-slate-900 font-bold text-[22px] flex items-center justify-center`}>
                  {row.n}
                </div>
                <div className={`${idx % 2 === 0 ? "bg-slate-50" : "bg-white"} border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-[19px] flex items-center`}>
                  {row.meta}
                </div>
                <div className={`${idx % 2 === 0 ? "bg-slate-50" : "bg-white"} border border-slate-200 rounded-lg px-4 py-2 text-slate-600 text-[18px] flex items-center`}>
                  {row.detalhe}
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="h-10 bg-slate-50 border-t border-slate-200 px-12 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#A01310] rounded-full" />
            <span>Sistema Integrado de Gestão</span>
          </div>
          <span>Página 01/01</span>
        </footer>
      </div>

      <div className="mt-[-180px] w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border border-slate-200 z-10 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exportar para PowerPoint</h2>
            <p className="text-sm text-slate-500">Gere um PNG das metas em alta qualidade</p>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(Object.keys(QUALITIES) as Quality[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  quality === q ? "bg-white text-red-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {QUALITIES[q].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resolução</div>
            <div className="text-lg font-mono font-bold text-slate-700">{current.resolution}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dica</div>
            <div className="text-sm font-medium text-slate-700">{current.sizeHint}</div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full bg-[#A01310] hover:bg-[#7a0e0c] disabled:bg-slate-300 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {downloading ? "Gerando arquivo..." : `Baixar PNG em ${current.label}`}
        </button>
      </div>
    </div>
  );
}
