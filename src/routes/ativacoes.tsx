import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { NavHeader } from "@/components/NavHeader";

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;
const EXPORT_SCALE = 2;
const BRAND_RED = "#A01310";

export const Route = createFileRoute("/ativacoes")({
  head: () => ({
    meta: [
      { title: "Ativações por Diretoria — Painel Interno" },
      { name: "description", content: "Comparativo entre estrutura atual e estrutura correta." },
    ],
  }),
  component: AtivacoesPage,
});

function todayStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, color: string) {
  ctx.fillStyle = color;
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fill();
}

function strokeRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, color: string) {
  ctx.strokeStyle = color;
  roundedRect(ctx, x, y, width, height, radius);
  ctx.stroke();
}

function drawPillCentered(ctx: CanvasRenderingContext2D, text: string, centerX: number, y: number, color: string, textColor: string) {
  ctx.font = "700 11px Arial, sans-serif";
  const padding = 20;
  const textWidth = ctx.measureText(text).width;
  const width = textWidth + padding * 2;
  const height = 26;
  const x = centerX - width / 2;
  fillRoundedRect(ctx, x, y, width, height, height / 2, color);
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, centerX, y + height / 2);
}

function drawImageAtRatio(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, ratio: number) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const drawWidth = iw * ratio;
  const drawHeight = ih * ratio;
  const drawX = x + (width - drawWidth) / 2;
  const drawY = y + (height - drawHeight) / 2;
  ctx.save();
  roundedRect(ctx, x, y, width, height, 10);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

function commonRatio(imgs: HTMLImageElement[], width: number, height: number) {
  return Math.min(...imgs.map((img) => Math.min(width / (img.naturalWidth || 1), height / (img.naturalHeight || 1))));
}

function drawSlide(ctx: CanvasRenderingContext2D, atualImg: HTMLImageElement, corretaImg: HTMLImageElement) {
  ctx.save();
  roundedRect(ctx, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, 40);
  ctx.clip();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);

  ctx.fillStyle = BRAND_RED;
  ctx.fillRect(0, 0, SLIDE_WIDTH, 64);

  fillRoundedRect(ctx, 44, 12, 36, 36, 18, "#ffffff");
  ctx.fillStyle = BRAND_RED;
  ctx.font = "900 20px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("A", 62, 31);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 23px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("ATIVAÇÕES — REESTRUTURAÇÃO", 96, 31);
  ctx.font = "500 13px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("Comparativo de Estruturas", 1232, 31);

  const contentY = 96;
  const cardY = 132;
  const cardH = 516;
  const cardW = 584;
  const leftX = 40;
  const rightX = 656;

  drawPillCentered(ctx, "ESTRUTURA ATUAL", leftX + cardW / 2, contentY, "#e2e8f0", "#334155");
  drawPillCentered(ctx, "ESTRUTURA CORRETA", rightX + cardW / 2, contentY, BRAND_RED, "#ffffff");


  fillRoundedRect(ctx, leftX, cardY, cardW, cardH, 18, "#f8fafc");
  strokeRoundedRect(ctx, leftX, cardY, cardW, cardH, 18, "#e2e8f0");
  fillRoundedRect(ctx, rightX, cardY, cardW, cardH, 18, "#f8fafc");
  strokeRoundedRect(ctx, rightX, cardY, cardW, cardH, 18, "#e2e8f0");

  const imgBoxW = cardW - 32;
  const imgBoxH = cardH - 32;
  const ratio = commonRatio([atualImg, corretaImg], imgBoxW, imgBoxH);
  drawImageAtRatio(ctx, atualImg, leftX + 16, cardY + 16, imgBoxW, imgBoxH, ratio);
  drawImageAtRatio(ctx, corretaImg, rightX + 16, cardY + 16, imgBoxW, imgBoxH, ratio);

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 680, SLIDE_WIDTH, 40);
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(0, 680);
  ctx.lineTo(SLIDE_WIDTH, 680);
  ctx.stroke();
  ctx.fillStyle = BRAND_RED;
  ctx.beginPath();
  ctx.arc(46, 704, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#94a3b8";
  ctx.font = "700 10px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("SISTEMA INTEGRADO DE GESTÃO", 58, 704);
  ctx.textAlign = "right";
  ctx.fillText("PÁGINA 01/01", 1232, 704);
  ctx.restore();
}

function AtivacoesPage() {
  const slideRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const [atualImg, corretaImg] = await Promise.all([loadImage("/estrutura_atual.png"), loadImage("/estrutura_correta.png")]);
      const canvas = document.createElement("canvas");
      canvas.width = SLIDE_WIDTH * EXPORT_SCALE;
      canvas.height = SLIDE_HEIGHT * EXPORT_SCALE;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Não foi possível gerar a imagem.");
      ctx.scale(EXPORT_SCALE, EXPORT_SCALE);
      drawSlide(ctx, atualImg, corretaImg);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ativacoes_Comparativo_${todayStamp()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center">
      <NavHeader />

      <div
        ref={slideRef}
        className="bg-white shadow-2xl overflow-hidden relative flex flex-col mb-6 rounded-[40px]"
        style={{ width: "1280px", height: "720px", minWidth: "1280px", transform: "scale(0.9)", transformOrigin: "top center" }}
      >
        <div className="bg-[#A01310] h-16 flex items-center px-12 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#A01310] font-black text-xl">A</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight uppercase">Ativações — Reestruturação</h1>
          </div>
          <div className="text-white/80 text-sm font-medium">Comparativo de Estruturas</div>
        </div>

        <div className="flex-1 px-10 py-8 grid grid-cols-2 gap-8 overflow-hidden">
          <div className="flex flex-col items-center">
            <div className="bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Estrutura Atual
            </div>
            <div className="flex-1 w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-hidden">
              <img
                src="/estrutura_atual.png"
                alt="Estrutura atual de ativações por DDD"
                crossOrigin="anonymous"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-[#A01310] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              Estrutura Correta
            </div>
            <div className="flex-1 w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-hidden">
              <img
                src="/estrutura_correta.png"
                alt="Estrutura correta agrupada por Diretoria"
                crossOrigin="anonymous"
                className="max-h-full max-w-full object-contain"
              />
            </div>
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

      <div className="mt-[-60px] w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border border-slate-200 z-10 mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exportar tela</h2>
            <p className="text-sm text-slate-500">Baixe o slide comparativo como PNG em alta resolução</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full bg-[#A01310] hover:bg-[#7a0e0c] disabled:bg-slate-300 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {exporting ? "Gerando imagem..." : "Baixar PNG da tela"}
        </button>
      </div>
    </div>
  );
}
