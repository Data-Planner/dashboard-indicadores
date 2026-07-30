import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavHeader } from "@/components/NavHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Exportar Escala 16:9" },
      { name: "description", content: "Exporte a escala em PNG de alta resolução para PowerPoint." },
    ],
  }),
  component: Index,
});

type Quality = "hd" | "fhd" | "4k";

const QUALITIES: Record<Quality, { label: string; resolution: string; file: string; sizeHint: string }> = {
  hd: { label: "HD", resolution: "1280 × 720", file: "/escala_hd.png", sizeHint: "Ideal p/ e-mail" },
  fhd: { label: "Full HD", resolution: "1920 × 1080", file: "/escala_fhd.png", sizeHint: "Recomendado" },
  "4k": { label: "4K Ultra HD", resolution: "3840 × 2160", file: "/escala_4k.png", sizeHint: "Máxima nitidez" },
};

function todayStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const SCHEDULE_DATA = [
  {
    dept: "Plancom",
    staff: [
      { name: "Marcelo", start: "7:30", lunchOut: "11:00", lunchIn: "12:00", end: "17:18", cover: "Guilherme, Robson, Gabriel e Rafael" },
      { name: "Guilherme", start: "8:00", lunchOut: "11:30", lunchIn: "12:30", end: "17:48", cover: "Gabriel, Rafael" },
      { name: "Robson", start: "7:00", lunchOut: "11:30", lunchIn: "12:30", end: "16:48", cover: "Gabriel, Rafael" },
      { name: "Gabriel", start: "8:00", lunchOut: "12:00", lunchIn: "13:00", end: "17:48", cover: "Marcelo, Rafael" },
      { name: "Rafael", start: "7:00", lunchOut: "13:00", lunchIn: "14:00", end: "16:48", cover: "Marcelo, Guilherme, Robson e Gabriel" },
    ],
  },
  {
    dept: "Pex",
    staff: [
      { name: "Ericka", start: "7:00", lunchOut: "13:00", lunchIn: "14:00", end: "16:48", cover: "Paulo" },
      { name: "Paulo", start: "7:00", lunchOut: "11:30", lunchIn: "12:30", end: "16:48", cover: "Ericka" },
    ],
  },
  {
    dept: "Trade",
    staff: [
      { name: "Karina", start: "7:00", lunchOut: "12:00", lunchIn: "13:00", end: "16:48", cover: "Nayara" },
      { name: "Nayara", start: "7:00", lunchOut: "13:00", lunchIn: "14:00", end: "16:48", cover: "Karina" },
    ],
  },
  {
    dept: "Marketing",
    staff: [
      { name: "Gabriela", start: "8:00", lunchOut: "12:00", lunchIn: "13:00", end: "17:48", cover: "---" },
      { name: "Estagiário(a)", start: "7:00", lunchOut: "13:00", lunchIn: "", end: "", cover: "---" },
    ],
  },
  {
    dept: "Estagiária e Menor Aprendiz",
    staff: [
      { name: "Ana", start: "7:00", lunchOut: "13:00", lunchIn: "", end: "", cover: "---" },
      { name: "Eishila", start: "", lunchOut: "", lunchIn: "13:30", end: "17:30", cover: "---" },
    ],
  },
];

function Index() {
  const [quality, setQuality] = useState<Quality>("fhd");
  const [downloading, setDownloading] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const current = QUALITIES[quality];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(current.file);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Escala_16x9_${current.label}_${todayStamp()}.png`;
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
      {/* Container 16:9 para Visualização/Cópia */}
      <div 
        className="bg-white shadow-2xl overflow-hidden relative flex flex-col mb-6 rounded-[40px]"
        style={{ width: '1280px', height: '720px', minWidth: '1280px', transform: 'scale(0.7)', transformOrigin: 'top center' }}
      >
        {/* Header Decorator */}
        <div className="bg-[#b91c1c] h-16 flex items-center px-12 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#b91c1c] font-black text-xl">S</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight uppercase">Escalas de Trabalho</h1>
          </div>
          <div className="text-white/80 text-sm font-medium">Junho 2026</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 grid grid-cols-1 gap-4 overflow-hidden content-start">
          {SCHEDULE_DATA.map((section) => (
            <div key={section.dept} className="flex flex-col">
              <div className="flex gap-2 mb-0.5">
                <div className="w-[780px] grid grid-cols-[1.4fr_0.9fr_1fr_1fr_0.9fr] bg-[#A01310] text-white text-[13px] font-bold uppercase tracking-wider rounded-lg overflow-hidden">
                  <div className="px-3 py-1.5 border-r border-white/15 bg-[#7a0e0c]">{section.dept}</div>
                  <div className="px-3 py-1.5 border-r border-white/15">Entrada</div>
                  <div className="px-3 py-1.5 border-r border-white/15 text-center">Saída Almoço</div>
                  <div className="px-3 py-1.5 border-r border-white/15 text-center">Retorno Almoço</div>
                  <div className="px-3 py-1.5 text-center">Término</div>
                </div>
                <div className="flex-1 bg-[#A01310] text-white text-[13px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  Quem fica na sala
                </div>
              </div>
              
              <div className="space-y-[1px]">
                {section.staff.map((person, idx) => (
                  <div key={person.name} className="flex gap-2">
                    <div className={`w-[780px] grid grid-cols-[1.4fr_0.9fr_1fr_1fr_0.9fr] text-[15px] ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border border-slate-200 rounded-lg overflow-hidden`}>
                      <div className="px-3 py-1 text-slate-900 border-r border-slate-200">{person.name}</div>
                      <div className="px-3 py-1 text-slate-600 border-r border-slate-200 text-center">{person.start}</div>
                      <div className="px-3 py-1 text-slate-600 border-r border-slate-200 text-center">{person.lunchOut}</div>
                      <div className="px-3 py-1 text-slate-600 border-r border-slate-200 text-center">{person.lunchIn}</div>
                      <div className="px-3 py-1 text-slate-600 text-center">{person.end}</div>
                    </div>
                    <div className={`flex-1 text-[14px] ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border border-slate-200 px-3 py-1 text-slate-500 flex items-center rounded-lg`}>
                      {person.cover}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Decorator */}
        <footer className="h-10 bg-slate-50 border-t border-slate-200 px-12 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#b91c1c] rounded-full" />
            <span>Sistema Integrado de Gestão</span>
          </div>
          <span>Página 01/01</span>
        </footer>
      </div>

      {/* Export Controls Overlay/Section */}
      <div className="mt-[-180px] w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border border-slate-200 z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exportar para PowerPoint</h2>
            <p className="text-sm text-slate-500">Gere um arquivo PNG de alta qualidade</p>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {(Object.keys(QUALITIES) as Quality[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  quality === q 
                    ? "bg-white text-red-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
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
          className="w-full bg-red-700 hover:bg-red-800 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-700/20 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          {downloading ? "Gerando arquivo..." : `Baixar PNG em ${current.label}`}
        </button>
      </div>
    </div>
  );
}
