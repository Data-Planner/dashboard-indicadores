import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/NavHeader";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const Route = createFileRoute("/atingimento-ddd")({
  head: () => ({
    meta: [
      { title: "Atingimento de Meta por DDD" },
      { name: "description", content: "Ranking de atingimento de meta por DDD com gráfico de barras horizontais." },
    ],
  }),
  component: AtingimentoDDDPage,
});

type Row = { ddd: string; pct: number; diretoria: "DIR. MG/BA" | "DIR. CO/RO/AC" | "DIR. NO" };

const DADOS: Row[] = [
  { ddd: "31", pct: 39.1, diretoria: "DIR. MG/BA" },
  { ddd: "33", pct: 72.3, diretoria: "DIR. MG/BA" },
  { ddd: "35", pct: 117.5, diretoria: "DIR. MG/BA" },
  { ddd: "38", pct: 105.1, diretoria: "DIR. MG/BA" },
  { ddd: "74", pct: 48.6, diretoria: "DIR. MG/BA" },
  { ddd: "75", pct: 59.5, diretoria: "DIR. MG/BA" },
  { ddd: "77", pct: 19.8, diretoria: "DIR. MG/BA" },
  { ddd: "62", pct: 73.5, diretoria: "DIR. CO/RO/AC" },
  { ddd: "64", pct: 89.6, diretoria: "DIR. CO/RO/AC" },
  { ddd: "65", pct: 46.1, diretoria: "DIR. CO/RO/AC" },
  { ddd: "66", pct: 103.6, diretoria: "DIR. CO/RO/AC" },
  { ddd: "68", pct: 127.0, diretoria: "DIR. CO/RO/AC" },
  { ddd: "69", pct: 149.1, diretoria: "DIR. CO/RO/AC" },
  { ddd: "91", pct: 130.5, diretoria: "DIR. NO" },
  { ddd: "92", pct: 32.7, diretoria: "DIR. NO" },
  { ddd: "93", pct: 293.2, diretoria: "DIR. NO" },
  { ddd: "94", pct: 111.6, diretoria: "DIR. NO" },
  { ddd: "95", pct: 123.8, diretoria: "DIR. NO" },
  { ddd: "96", pct: 110.8, diretoria: "DIR. NO" },
  { ddd: "97", pct: 236.3, diretoria: "DIR. NO" },
];

const DIRETORIA_TOTAIS = [
  { nome: "DIR. MG/BA", pct: 68.71 },
  { nome: "DIR. CO/RO/AC", pct: 87.81 },
  { nome: "DIR. NO", pct: 142.64 },
];
const TOTAL_GERAL = 100.35;

// Gradiente: bordô (melhor, topo) -> cinza (pior, fim)
const COR_TOP = { r: 0xA0, g: 0x13, b: 0x10 }; // #A01310
const COR_BOT = { r: 0x9C, g: 0xA3, b: 0xAF }; // slate-400

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function corDoRank(i: number, total: number) {
  const t = total <= 1 ? 0 : i / (total - 1);
  const r = lerp(COR_TOP.r, COR_BOT.r, t);
  const g = lerp(COR_TOP.g, COR_BOT.g, t);
  const b = lerp(COR_TOP.b, COR_BOT.b, t);
  return `rgb(${r}, ${g}, ${b})`;
}

function AtingimentoDDDPage() {
  const ordenado = [...DADOS].sort((a, b) => b.pct - a.pct);
  const max = Math.max(...ordenado.map((d) => d.pct));
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const el = exportRef.current;
      const width = el.offsetWidth;
      const height = el.scrollHeight;
      const canvas = await html2canvas(el, {
        backgroundColor: "#f8fafc",
        scale: 2,
        useCORS: true,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        scrollX: 0,
        scrollY: 0,
      });
      const link = document.createElement("a");
      link.download = `atingimento-ddd-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavHeader />
      <main className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex justify-end mb-3">
          <Button onClick={handleExport} disabled={exporting} className="bg-[#A01310] hover:bg-[#7d0e0c]">
            <Download className="w-4 h-4" />
            {exporting ? "Exportando..." : "Exportar PNG"}
          </Button>
        </div>
        <div ref={exportRef} className="bg-slate-50 p-6 rounded-2xl">
        <header className="mb-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Atingimento de Meta por DDD</h1>
            <p className="text-slate-500 text-sm mt-1">
              Ranking — <span className="font-semibold text-[#A01310]">bordô</span> = melhor,{" "}
              <span className="font-semibold text-slate-500">cinza</span> = pior. Linha 100% indica a meta.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Geral</div>
            <div className="text-3xl font-black text-slate-900">{TOTAL_GERAL.toFixed(2)}%</div>
          </div>
        </header>


        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {DIRETORIA_TOTAIS.map((d) => (
            <div key={d.nome} className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{d.nome}</div>
              <div className="text-2xl font-black text-slate-900">{d.pct.toFixed(2)}%</div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="relative">

            <div className="space-y-2">
              {ordenado.map((row, i) => {
                const cor = corDoRank(i, ordenado.length);
                const larguraPct = (row.pct / max) * 100;
                return (
                  <div key={row.ddd} className="flex items-center gap-3">
                    <div className="w-12 shrink-0 text-right">
                      <div className="text-sm font-bold text-slate-900">{row.ddd}</div>
                      <div className="text-[9px] text-slate-400 leading-none">{row.diretoria}</div>
                    </div>
                    <div className="flex-1 relative h-7 bg-slate-100 rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md flex items-center justify-end pr-2 transition-all"
                        style={{
                          width: `${larguraPct}%`,
                          background: `linear-gradient(90deg, ${cor} 0%, ${cor} 100%)`,
                        }}
                      >
                        <span className="text-white text-xs font-bold drop-shadow-sm">
                          {row.pct.toFixed(1)}%
                        </span>
                      </div>
                      {/* Meta 100% */}
                      <div
                        className="absolute top-0 bottom-0 border-l border-dashed border-slate-400/70 pointer-events-none"
                        style={{ left: `${(100 / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded" style={{ background: `rgb(${COR_TOP.r},${COR_TOP.g},${COR_TOP.b})` }} />
                Melhor desempenho
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded" style={{ background: `rgb(${COR_BOT.r},${COR_BOT.g},${COR_BOT.b})` }} />
                Pior desempenho
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 border-t-2 border-dashed border-slate-400" />
                Meta (100%)
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>

    </div>
  );
}
