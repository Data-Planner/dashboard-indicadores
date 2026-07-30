import { createFileRoute } from "@tanstack/react-router";
import { NavHeader } from "@/components/NavHeader";

export const Route = createFileRoute("/resumo")({
  head: () => ({
    meta: [
      { title: "Resumo de Pendentes" },
      { name: "description", content: "Resumo de pendências por colaborador e campanha." },
    ],
  }),
  component: ResumoPage,
});

type Item = { campanha: string; pendentes: number };
type Colaborador = { nome: string; cor: string; itens: Item[] };

// Resumo agrupado por colaborador e campanha (contagem de pendentes)
const DADOS: Colaborador[] = [
  {
    nome: "Paulo Henrique",
    cor: "#A01310",
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
      { campanha: "ATUALIZAÇÃO DA BASE DE AUDITORIA EXTERNA", pendentes: 1 },
      { campanha: "MONTAR A VISÃO DO EXTRATO", pendentes: 1 },
    ],
  },
  {
    nome: "Robson Leite",
    cor: "#0F766E",
    itens: [
      { campanha: "CENTURIÃO FASE 8", pendentes: 7 },
      { campanha: "ADQ - NOVAS ATIVAÇÕES", pendentes: 5 },
      { campanha: "Seridó", pendentes: 5 },
      { campanha: "ACOMPANHAMENTO CURVA C CONSIGNADO TIM", pendentes: 3 },
      { campanha: "ACOMPANHAMENTO CURVA C CONSIGNADO VIVO", pendentes: 3 },
      { campanha: "Input ativações", pendentes: 2 },
      { campanha: "Planilha Canvass TIM", pendentes: 2 },
      { campanha: "Tubo de Mercado & Controle de Ruptura Redeflex NORTE", pendentes: 2 },
      { campanha: "ACOMPANHAMENTO HC", pendentes: 1 },
      { campanha: "ATIVAÇÃO 3 CHIP", pendentes: 1 },
      { campanha: "CENTURIÃO FASE 8 - Divulgação SAVE", pendentes: 1 },
      { campanha: "Material da Operadora Claro de MG", pendentes: 1 },
      { campanha: "Material da operadora - Maio - Claro MG", pendentes: 1 },
    ],
  },
  {
    nome: "Ericka Taques",
    cor: "#7C3AED",
    itens: [
      { campanha: "Atribuição de chamados", pendentes: 7 },
      { campanha: "BASE INVASÃO", pendentes: 2 },
      { campanha: "Análise do Mês - Bonus Variável", pendentes: 2 },
      { campanha: "Análise Extrato VIVO", pendentes: 1 },
      { campanha: "Análise Extrato TIM", pendentes: 1 },
      { campanha: "Base de Atuação - Vivo", pendentes: 1 },
      { campanha: "Exportação Base Estoque Inventariado - Vivo", pendentes: 1 },
      { campanha: "Exportação Base Disponibilidade", pendentes: 1 },
      { campanha: "Material Redir", pendentes: 1 },
    ],
  },
  {
    nome: "Gabriel Faria",
    cor: "#B45309",
    itens: [
      { campanha: "Contestação RV + Campanhas", pendentes: 1 },
      { campanha: "PLAN UNICO || ATUALIZAÇÃO E ENVIO", pendentes: 1 },
      { campanha: "Invasão Vivo", pendentes: 2 },
      { campanha: "RV + Campanhas", pendentes: 1 },
      { campanha: "Divulgação RV + Campanhas - Diretoria", pendentes: 1 },
      { campanha: "Apuração Campanha - Novo PDV ADQ", pendentes: 1 },
      { campanha: "Apuração Flexcred (NOVO CONTRATO)", pendentes: 1 },
      { campanha: "Apuração RV - Chip Flex", pendentes: 1 },
      { campanha: "Apurar RV Exclusivo Corban", pendentes: 1 },
      { campanha: "Cálculo de Metas Mensal", pendentes: 1 },
    ],
  },
  {
    nome: "Guilherme Oliveira",
    cor: "#1D4ED8",
    itens: [
      { campanha: "Acompanhamento Gerencial", pendentes: 2 },
      { campanha: "Material Redir", pendentes: 1 },
      { campanha: "Sugestão de Compromisso", pendentes: 1 },
    ],
  },
  {
    nome: "Marcelo",
    cor: "#BE185D",
    itens: [
      { campanha: "Revisar o Código de Compromisso Chip Diário", pendentes: 1 },
    ],
  },
  {
    nome: "Rafael",
    cor: "#0E7490",
    itens: [
      { campanha: "Indicador - Banda Larga", pendentes: 1 },
    ],
  },
];

function ResumoPage() {
  const ordenado = [...DADOS]
    .map((c) => ({
      ...c,
      total: c.itens.reduce((a, b) => a + b.pendentes, 0),
      itens: [...c.itens].sort((a, b) => b.pendentes - a.pendentes),
    }))
    .sort((a, b) => b.total - a.total);

  const totalGeral = ordenado.reduce((a, c) => a + c.total, 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <NavHeader />
      <main className="max-w-6xl mx-auto px-6 pb-12">
        <div className="mb-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Resumo de Pendentes</h1>
            <p className="text-slate-500 text-sm mt-1">
              Agrupado por colaborador e campanha — total de itens em status{" "}
              <span className="font-semibold text-[#A01310]">Pendente</span>.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Total geral
            </div>
            <div className="text-3xl font-black text-slate-900">{totalGeral}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ordenado.map((c) => (
            <div
              key={c.nome}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
            >
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ backgroundColor: c.cor }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-black">
                    {c.nome
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg leading-tight">{c.nome}</div>
                    <div className="text-white/70 text-xs">
                      {c.itens.length} campanha{c.itens.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-white/70 font-bold uppercase tracking-widest">
                    Pendentes
                  </div>
                  <div className="text-white text-3xl font-black leading-none">{c.total}</div>
                </div>
              </div>

              <ul className="divide-y divide-slate-100">
                {c.itens.map((it) => (
                  <li
                    key={it.campanha}
                    className="px-5 py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50"
                  >
                    <span className="text-sm text-slate-700 font-medium leading-snug">
                      {it.campanha}
                    </span>
                    <span
                      className="shrink-0 min-w-[32px] text-center px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: c.cor }}
                    >
                      {it.pendentes}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
