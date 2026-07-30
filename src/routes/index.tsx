import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RedeFlex · Dashboard de Indicadores" },
      {
        name: "description",
        content:
          "Painel de vendas RedeFlex: metas, realizado, projeções e agendamentos importados das suas planilhas.",
      },
      { property: "og:title", content: "RedeFlex · Dashboard de Indicadores" },
      {
        property: "og:description",
        content:
          "Painel de vendas RedeFlex: metas, realizado, projeções e agendamentos importados das suas planilhas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <iframe
      src="/dashboard.html"
      title="RedeFlex · Dashboard de Indicadores"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
