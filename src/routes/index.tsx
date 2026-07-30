import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gestão de Indicadores — RedeFlex" },
      {
        name: "description",
        content:
          "Estruture, importe e confira indicadores de gestão da RedeFlex.",
      },
      { property: "og:title", content: "Gestão de Indicadores — RedeFlex" },
      {
        property: "og:description",
        content:
          "Estruture, importe e confira indicadores de gestão da RedeFlex.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() { return <Navigate to="/estrutura" />; }
