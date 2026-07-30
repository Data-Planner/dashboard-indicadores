import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/NavHeader";
import html2canvas from "html2canvas-pro";

async function exportSlideAsImage() {
  const inner = document.getElementById("slide-inner");
  if (!inner) return;
  const prevTransform = inner.style.transform;
  inner.style.transform = "none";
  try {
    const canvas = await html2canvas(inner, {
      width: 1920,
      height: 1080,
      windowWidth: 1920,
      windowHeight: 1080,
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    const link = document.createElement("a");
    link.download = "resumo-criticos.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    inner.style.transform = prevTransform;
  }
}

export const Route = createFileRoute("/resumo-criticos")({
  head: () => ({
    meta: [
      { title: "Resumo Críticos — Pendentes > 1" },
      { name: "description", content: "Resumo de pendências críticas (mais de 1 aberto) por colaborador." },
    ],
  }),
  component: ResumoCriticosPage,
});

type Item = { campanha: string; pendentes: number };
type Colaborador = { nome: string; itens: Item[] };

const COR = "#A01310";
const CORTE = "11/06 às 10:00";

const DADOS: Colaborador[] = [
  {
    nome: "Paulo Henrique",
    itens: [
      { campanha: "ATUALIZAÇÃO E ENVIO BASE RUPTURA", pendentes: 6 },
      { campanha: "INDICADOR E BASE ESTOQUE PDC PRODUTIVO", pendentes: 6 },
      { campanha: "Verificar envio de vendas (chips) Claro", pendentes: 5 },
      { campanha: "ATUALIZAÇÃO BASE AUDITAGEM CLARO", pendentes: 4 },
      { campanha: "GROSS CHIP FLEX", pendentes: 4 },
      { campanha: "INDICADOR DE TUBO DE MERCADO", pendentes: 4 },
      { campanha: "QUALIDADE DE ENVIO", pendentes: 4 },
      { campanha: "AUDITORIA INTERNA PEC CLARO", pendentes: 2 },
      { campanha: "RATEIO CLARO", pendentes: 2 },
      { campanha: "REUNIÃO PEC/PEX/BV MG", pendentes: 2 },
    ],
  },
  {
    nome: "Robson Leite",
    itens: [
      { campanha: "CENTURIÃO FASE 8", pendentes: 7 },
      { campanha: "ADQ - NOVAS ATIVAÇÕES", pendentes: 5 },
      { campanha: "Seridó", pendentes: 5 },
      { campanha: "ACOMPANHAMENTO CURVA C CONSIGNADO TIM", pendentes: 3 },
      { campanha: "ACOMPANHAMENTO CURVA C CONSIGNADO VIVO", pendentes: 3 },
      { campanha: "Input ativações", pendentes: 2 },
      { campanha: "Planilha Canvass TIM", pendentes: 2 },
      { campanha: "Tubo de Mercado & Controle de Ruptura Redeflex NORTE", pendentes: 2 },
    ],
  },
  {
    nome: "Ericka Taques",
    itens: [
      { campanha: "Atribuição de chamados", pendentes: 7 },
      { campanha: "BASE INVASÃO", pendentes: 2 },
      { campanha: "Análise do Mês - Bonus Variável", pendentes: 2 },
    ],
  },
  {
    nome: "Gabriel Faria",
    itens: [
      { campanha: "Invasão Vivo", pendentes: 2 },
    ],
  },
  {
    nome: "Guilherme Oliveira",
    itens: [
      { campanha: "Acompanhamento Gerencial", pendentes: 2 },
    ],
  },
];

function ResumoCriticosPage() {
  const ordenado = DADOS
    .map((c) => {
      const itens = c.itens.filter((i) => i.pendentes > 1).sort((a, b) => b.pendentes - a.pendentes);
      return { ...c, itens, total: itens.reduce((a, b) => a + b.pendentes, 0) };
    })
    .filter((c) => c.itens.length > 0)
    .sort((a, b) => b.total - a.total);

  const totalGeral = ordenado.reduce((a, c) => a + c.total, 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <NavHeader />
      <main className="max-w-[1600px] mx-auto px-6 pb-12">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4 print:hidden">
          <p className="text-slate-500 text-sm">
            Slide 16:9 pronto para PowerPoint — use Imprimir para exportar.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#A01310] text-white text-sm font-semibold hover:bg-[#7a0e0c]"
            >
              Imprimir / Exportar
            </button>
            <button
              onClick={exportSlideAsImage}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
            >
              Baixar Imagem (PNG)
            </button>
          </div>
        </div>

        <div
          id="slide-16x9"
          className="relative w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          style={{ aspectRatio: "16 / 9", containerType: "inline-size" } as React.CSSProperties}
        >
          <div
            id="slide-inner"
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: 1920, height: 1080, transform: "scale(var(--s))", ["--s" as never]: "calc(100cqw / 1920)" } as React.CSSProperties}
          >
            <div className="w-full h-full p-10 flex flex-col">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h1 className="text-5xl font-black text-slate-900 leading-none">Resumo Críticos</h1>
                  <p className="text-slate-500 text-lg mt-2">
                    Somente itens com <span className="font-semibold text-[#A01310]">mais de 1 pendente</span> em aberto.
                  </p>
                  <p className="text-slate-600 text-sm mt-1">
                    <span className="font-bold">Data de corte:</span> {CORTE}
                  </p>
                </div>
                <div className="bg-white border-2 border-[#A01310] rounded-2xl px-6 py-3 shadow-sm">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#A01310]">Total geral</div>
                  <div className="text-4xl font-black text-slate-900">{totalGeral}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 flex-1 min-h-0 content-start">
                {ordenado.map((c) => (
                  <div key={c.nome} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col self-start">
                    <div className="px-3 py-2 flex items-center justify-between shrink-0" style={{ backgroundColor: COR }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-[11px] shrink-0">
                          {c.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="text-white font-bold text-sm leading-tight truncate">{c.nome}</div>
                          <div className="text-white/70 text-[10px]">{c.itens.length} campanha{c.itens.length > 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[8px] text-white/70 font-bold uppercase tracking-widest">Pend.</div>
                        <div className="text-white text-xl font-black leading-none">{c.total}</div>
                      </div>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {c.itens.map((it) => (
                        <li key={it.campanha} className="px-2.5 py-1 flex items-center gap-1.5">
                          <span className="min-w-0 text-[12px] text-slate-700 font-medium leading-tight">{it.campanha}</span>
                          <span className="shrink-0 min-w-[22px] text-center px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: COR }}>
                            {it.pendentes}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          @page { size: 1920px 1080px; margin: 0; }
          body * { visibility: hidden; }
          #slide-16x9, #slide-16x9 * { visibility: visible; }
          #slide-16x9 { position: absolute; inset: 0; width: 1920px !important; height: 1080px !important; box-shadow: none; border: none; border-radius: 0; aspect-ratio: auto !important; }
          #slide-16x9 > div { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
