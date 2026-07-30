import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const IMG = "/torcida";
const LOGO_RED = `${IMG}/e53f6677af9425a58c52e16d72be0423.png`;
const MAQUININHA = `${IMG}/ca49614e5ceffac4d74e3c87481d9d26.png`;
const ARROW_GLOW = `${IMG}/26dc08c49021e7e3370a99f47ac49f33.png`;
const CONFETTI = `${IMG}/fcd62cd2a42b55e56d48e0e43005325d.png`;
const WHATSAPP = `${IMG}/817774e817350bfebe47555d8a910b89.png`;

const ICONS = [
  `${IMG}/c50723b616ea27cbe003793c1872e2e4.png`, // laptop $
  `${IMG}/340983fde9474b42e7560df6582606f2.png`, // contactless
  `${IMG}/daf617e4a56c70b9d69f1bd9d24ab71b.png`, // wallet
  `${IMG}/398df49b2fa7d2287cf717b7cb7a724d.png`, // card
  `${IMG}/5175cf429d9113ca3fc91dce62be94f9.png`, // phone $
  `${IMG}/1cbc5f3b7ecdb3a4bc76dbd2f8f5f395.png`, // register
];

const BRAND = "#C8102E";
const BRAND_DARK = "#A01310";
const LIME = "#D4F542";

export const Route = createFileRoute("/torcida-premiada")({
  head: () => ({
    meta: [
      { title: "Torcida Premiada Redeflex — Concurso Cultural" },
      { name: "description", content: "Aumente seu volume de vendas com cartões e PIX e concorra a prêmios incríveis com a Torcida Premiada Redeflex." },
      { property: "og:title", content: "Torcida Premiada Redeflex" },
      { property: "og:description", content: "Quanto mais você movimenta, mais chances tem de ganhar!" },
    ],
  }),
  component: TorcidaPremiadaPage,
});

function TorcidaPremiadaPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav />
      <Hero />
      <ComoFunciona />
      <Pergunta />
      <Premios />
      <ComoParticipar />
      <Form />
      <Footer />
      <a
        href="https://api.whatsapp.com/send/?phone=558006470002"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform"
        aria-label="WhatsApp"
      >
        <img src={WHATSAPP} alt="WhatsApp" className="w-full h-full" />
      </a>
    </div>
  );
}

function TopNav() {
  return (
    <header className="w-full bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <img src={LOGO_RED} alt="Redeflex" className="h-9 sm:h-10 w-auto" />
        <nav className="hidden md:flex items-center gap-10 text-slate-700 font-medium">
          <a href="#inicio" className="hover:text-[color:var(--brand)]" style={{ ["--brand" as never]: BRAND }}>Início</a>
          <a href="#regulamento" className="hover:text-[color:var(--brand)]" style={{ ["--brand" as never]: BRAND }}>Regulamento</a>
          <a href="#participar" className="hover:text-[color:var(--brand)]" style={{ ["--brand" as never]: BRAND }}>Quero participar</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden" style={{ background: BRAND }}>
      <img src={CONFETTI} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-white">
          <span className="inline-block text-xs sm:text-sm font-bold tracking-widest px-4 py-2 rounded-md" style={{ background: "#0FBFA9", color: "white" }}>
            CONCURSO CULTURAL
          </span>
          <h1 className="mt-5 leading-[0.85] font-black italic">
            <span className="block text-white text-6xl sm:text-7xl lg:text-8xl drop-shadow-[4px_4px_0_rgba(0,0,0,0.25)]">TORCIDA</span>
            <span className="block text-7xl sm:text-8xl lg:text-9xl drop-shadow-[4px_4px_0_rgba(0,0,0,0.25)]" style={{ color: LIME }}>PREMIADA</span>
            <span className="block text-white text-3xl sm:text-4xl lg:text-5xl mt-2">REDEFLEX</span>
          </h1>
          <p className="mt-8 text-2xl sm:text-3xl font-bold">
            Quanto mais você movimenta,
            <br />
            <span style={{ color: LIME }}>mais chances tem de ganhar!</span>
          </p>
          <p className="mt-4 text-white/90 text-lg max-w-lg">
            Aumente seu volume de vendas com cartões e PIX e concorra a prêmios incríveis.
          </p>
          <a
            href="#participar"
            className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg text-slate-900 shadow-xl hover:scale-105 transition-transform"
            style={{ background: LIME }}
          >
            Quero participar!
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">→</span>
          </a>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute right-0 top-0 grid grid-cols-3 gap-4 opacity-90">
            {ICONS.map((s) => (
              <img key={s} src={s} alt="" className="w-12 h-12 object-contain" />
            ))}
          </div>
          <img src={ARROW_GLOW} alt="" aria-hidden className="absolute -left-6 top-1/4 w-[420px] max-w-none pointer-events-none" />
          <img src={MAQUININHA} alt="Maquininha Redeflex" className="relative w-[340px] sm:w-[420px] drop-shadow-2xl rotate-[8deg]" />
        </div>
      </div>
    </section>
  );
}

const STEP_ICONS = [
  // chart up
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 52h48M14 44V32M26 44V22M38 44V28M50 44V16M44 16h6v6"/></svg>,
  // ticket
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22a4 4 0 014-4h40a4 4 0 014 4v6a4 4 0 000 8v6a4 4 0 01-4 4H12a4 4 0 01-4-4v-6a4 4 0 000-8v-6z"/><path strokeDasharray="2 4" d="M28 18v28"/></svg>,
  // gift
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="10" y="24" width="44" height="10"/><rect x="14" y="34" width="36" height="20"/><path d="M32 24v30M22 24c-4-4-2-12 4-12s6 12 6 12-6 0-10 0zM42 24c4-4 2-12-4-12s-6 12-6 12 6 0 10 0z"/></svg>,
  // trophy
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10h24v14a12 12 0 01-24 0V10zM20 14H10v6a8 8 0 008 8M44 14h10v6a8 8 0 01-8 8M24 50h16M26 42v8M38 42v8M22 54h20"/></svg>,
];

function ComoFunciona() {
  const steps = [
    { t: "Aumente seu volume", d: "Transacione mais com cartões e PIX durante o período do concurso." },
    { t: "Ganhe códigos", d: "A cada R$5.000 de incremento em relação à sua média, você ganha 1 voucher." },
    { t: "Participe", d: "Acesse o concurso, responda à pergunta cultural e garanta seu voucher." },
    { t: "Concorra a prêmios", d: "Quanto maior o incremento, mais vouchers e mais chances de ganhar!" },
  ];
  return (
    <section className="py-20 px-6" style={{ background: BRAND_DARK }}>
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10 -mt-32 relative">
        <h2 className="text-center text-3xl sm:text-4xl font-black mb-12" style={{ color: BRAND }}>
          COMO FUNCIONA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {steps.map((s, i) => (
            <div key={s.t} className="relative text-center">
              <div className="mx-auto w-20 h-20 mb-4" style={{ color: BRAND }}>
                {STEP_ICONS[i]}
              </div>
              <h3 className="font-black text-lg mb-2" style={{ color: BRAND }}>{s.t}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{s.d}</p>
              {i < steps.length - 1 && (
                <span className="hidden md:block absolute top-8 -right-4 text-3xl text-slate-300">›</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Pergunta() {
  const [sel, setSel] = useState<string | null>(null);
  const opts = ["REDEFLEX", "Outra marca", "Não sei"];
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-bold tracking-widest text-slate-500 mb-3">PERGUNTA CULTURAL</p>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
          Responda e participe da <span style={{ color: BRAND }}>Torcida Premiada</span>
        </h2>
        <p className="text-slate-600 mb-10">Qual é a melhor maquininha para vender mais?</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {opts.map((o) => (
            <button
              key={o}
              onClick={() => setSel(o)}
              className={`px-6 py-5 rounded-2xl font-bold border-2 transition-all ${
                sel === o ? "text-white shadow-xl scale-105" : "bg-white text-slate-700 hover:border-[color:var(--b)]"
              }`}
              style={{
                ["--b" as never]: BRAND,
                background: sel === o ? BRAND : undefined,
                borderColor: sel === o ? BRAND : "#e2e8f0",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Premios() {
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: BRAND }}>
      <img src={CONFETTI} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" />
      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-center text-4xl sm:text-5xl font-black text-white mb-2">PRÊMIOS INCRÍVEIS</h2>
        <p className="text-center text-white/80 mb-12 text-sm">* imagens meramente ilustrativas</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <div className="mx-auto w-24 h-24 mb-4" style={{ color: BRAND }}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 8l-12 8 6 10 6-4v34h28V22l6 4 6-10-12-8-8 6h-12l-8-6z"/></svg>
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: BRAND }}>Camisetas da Seleção Brasileira</h3>
            <p className="text-slate-600">Vista a camisa e mostre sua torcida! Brindes exclusivos para os participantes.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
            <div className="mx-auto w-24 h-24 mb-4" style={{ color: BRAND }}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="10" width="52" height="34" rx="3"/><path d="M22 54h20M32 44v10"/></svg>
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: BRAND }}>SMART TVs</h3>
            <p className="text-slate-600">Uma Smart TV para cada regional da Redeflex.</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="#participar" className="inline-block px-10 py-4 rounded-full font-black text-lg text-slate-900 shadow-xl hover:scale-105 transition-transform" style={{ background: LIME }}>
            Quero participar agora!
          </a>
        </div>
      </div>
    </section>
  );
}

function ComoParticipar() {
  const steps = [
    { n: "1", t: "ACESSE", d: "Você receberá um link exclusivo da Redeflex." },
    { n: "2", t: "CONFIRME SEUS DADOS", d: "Informe seus dados para identificação." },
    { n: "3", t: "RESPONDA", d: "Responda a pergunta cultural do concurso." },
    { n: "4", t: "ACEITE OS TERMOS", d: "Leia e aceite os termos de participação." },
    { n: "5", t: "GARANTA SEU VOUCHER", d: "Pronto! Seu voucher estará confirmado." },
  ];
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-black mb-12" style={{ color: BRAND }}>COMO PARTICIPAR</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="text-center p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl text-white mb-4" style={{ background: BRAND }}>
                {s.n}
              </div>
              <h3 className="font-black text-sm mb-2 tracking-wide" style={{ color: BRAND }}>{s.t}</h3>
              <p className="text-slate-600 text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Form() {
  const [agree, setAgree] = useState(false);
  return (
    <section id="participar" className="py-20 px-6 bg-slate-100">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-black mb-2" style={{ color: BRAND }}>Preencha com seus dados</h2>
        <p className="text-slate-600 mb-8">para concluir seu cadastro</p>
        <form onSubmit={(e) => { e.preventDefault(); alert("Cadastro enviado!"); }} className="grid sm:grid-cols-2 gap-4">
          <input required placeholder="Nome completo" className="sm:col-span-2 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[color:var(--b)]" style={{ ["--b" as never]: BRAND }} />
          <input required placeholder="CNPJ / CPF cadastrado na Redeflex" className="sm:col-span-2 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[color:var(--b)]" style={{ ["--b" as never]: BRAND }} />
          <input required placeholder="Telefone com DDD" className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none" />
          <input required type="email" placeholder="E-mail" className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none" />
          <select required className="sm:col-span-2 px-4 py-3 rounded-lg border border-slate-300 bg-white">
            <option value="">Tamanho da camiseta</option>
            <option>P</option><option>M</option><option>G</option><option>GG</option><option>XGG</option>
          </select>
          <label className="sm:col-span-2 flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1" />
            Confirmo que li e concordo com o Regulamento e as condições de participação da Torcida Premiada Redeflex.
          </label>
          <button
            type="submit"
            disabled={!agree}
            className="sm:col-span-2 mt-2 py-4 rounded-full font-black text-lg text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
            style={{ background: BRAND }}
          >
            Enviar participação
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-white" style={{ background: "#1a1a1a" }}>
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-black mb-3">Movimente mais. Concorra mais. Ganhe mais!</h3>
          <p className="text-white/70 text-sm">Torcida unida com a Redeflex é torcida premiada.</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-bold">Atendimento</p>
          <a href="https://api.whatsapp.com/send/?phone=558006470002" target="_blank" rel="noreferrer" className="block text-white/80 hover:text-white">📞 0800 647 0002</a>
          <p className="text-white/80">✉ marketing@redeflex.com.br</p>
          <p className="text-white/60 text-xs mt-3">
            Av. Miguel Sutil, Nº 8800, Sala 301 — Duque de Caxias, Cuiabá – MT, 78043-305
            <br />CNPJ 06.207.421/0001-74
          </p>
        </div>
        <div className="text-sm space-y-1 text-white/80">
          <p className="font-bold text-white mb-2">Horário</p>
          <p>Seg a Sex: 8h às 20h</p>
          <p>Sábado: 8h às 18h</p>
          <p>Domingo: 8h às 14h</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © 2021 Redeflex Comércio e Serviço de Telefonia
      </div>
    </footer>
  );
}
