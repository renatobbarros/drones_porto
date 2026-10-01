import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import { ArrowIcon, CheckIcon, InstagramIcon, PlusIcon, Sparkle, WhatsAppIcon, XIcon } from "@/components/icons";
import { FAQ, INSTAGRAM, PLACES, SITE_URL, WA, WHATSAPP, WHATSAPP_DISPLAY, wa } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      name: "Drone Porto PE",
      url: SITE_URL,
      description: "Filmagem e fotografia aérea com drone para pousadas, imóveis, eventos e comércio em Porto de Galinhas e Ipojuca.",
      telephone: "+55-81-99681-0562",
      address: { "@type": "PostalAddress", addressLocality: "Nossa Senhora do Ó, Ipojuca", addressRegion: "PE", addressCountry: "BR" },
      geo: { "@type": "GeoCoordinates", latitude: -8.5, longitude: -35.0 },
      areaServed: PLACES,
      sameAs: [INSTAGRAM, `https://wa.me/${WHATSAPP}`],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

const PAINS = [
  ["O hóspede não entende onde você fica", "Do chão, ninguém vê que a pousada fica pertinho do mar. De cima, isso salta aos olhos."],
  ["O terreno parece igual a todos", "Tamanho, acesso, vizinhança e distância da praia só aparecem numa vista aérea."],
  ["O evento acaba e não sobra nada marcante", "A tomada aérea é a que todo mundo compartilha. Ela mostra o tamanho do que aconteceu."],
];

const SEGMENTS = [
  {
    title: "Pousadas & hotéis",
    text: "Mostre a piscina, o mar e a distância até a praia antes do hóspede perguntar. Vídeo para o Booking, Airbnb e Reels.",
    cta: "Orçamento para pousada",
    href: WA.pousada,
    icon: <><path d="M6 40h36M10 40V20l14-10 14 10v20" /><rect x="19" y="26" width="10" height="14" /></>,
  },
  {
    title: "Imóveis & terrenos",
    text: "Para corretores e construtoras: anúncio com vista aérea, limites do lote e o entorno que valoriza o preço.",
    cta: "Orçamento para imóvel",
    href: WA.imovel,
    icon: <><rect x="6" y="6" width="36" height="36" rx="2" /><path d="M6 24h36M24 6v36" /><circle cx="33" cy="15" r="4" /></>,
  },
  {
    title: "Casamentos & eventos",
    text: "Cerimônia na praia, festa, campeonato ou ação de empresa com a tomada aérea que todo mundo vai compartilhar.",
    cta: "Orçamento para evento",
    href: WA.evento,
    icon: <><circle cx="24" cy="24" r="18" /><path d="M24 12v12l8 6" /></>,
  },
  {
    title: "Restaurantes & comércio",
    text: "Reels verticais de verdade (a câmera gira 90°) para o seu perfil parar o dedo de quem está na praia.",
    cta: "Orçamento para comércio",
    href: WA.comercio,
    icon: <><rect x="15" y="4" width="18" height="40" rx="4" /><path d="M21 38h6" /></>,
  },
];

const PACKAGES = [
  {
    name: "Essencial",
    desc: "Para começar a aparecer de cima.",
    items: ["1 local, voo rápido e objetivo", "Fotos aéreas editadas", "Vídeo vertical para Reels", "Entrega rápida por link, em alta qualidade"],
  },
  {
    name: "Destaque",
    desc: "O pacote completo para vender mais.",
    hot: true,
    items: ["Voo no melhor horário de luz", "Pacote completo de fotos aéreas", "Vídeo horizontal para site e Booking", "Reels verticais prontos", "Trilha, cor e entrega rápida"],
  },
  {
    name: "Evento",
    desc: "Cobertura aérea do seu dia.",
    items: ["Cobertura aérea do evento", "Tomadas dos momentos-chave", "Vídeo resumo para compartilhar", "Fotos aéreas do grupo"],
  },
];

// Ilustrações provisórias da galeria: trocar por fotos/vídeos reais do Instagram.
const SHOTS = [
  { title: "Orla de Porto", place: "Porto de Galinhas", tag: "TURISMO", deep: "#3F7A72", mid: "#8EC4AE", land: "#E4D2AE",
    shallow: "M150 0 C 210 160 170 330 240 500 L 400 500 L 400 0 Z", sand: "M0 0 L 140 0 C 200 160 160 330 230 500 L 0 500 Z", foam: "M142 0 C 202 160 162 330 232 500" },
  { title: "Faixa de areia", place: "Ipojuca", tag: "PAISAGEM", deep: "#4B7F78", mid: "#7FB5A2", land: "#DCC8A0",
    shallow: "M0 260 C 120 230 260 300 400 250 L 400 500 L 0 500 Z", sand: "M0 0 L 400 0 L 400 230 C 260 280 120 210 0 240 Z", foam: "M0 245 C 120 215 260 285 400 235" },
  { title: "Piscinas naturais", place: "Porto de Galinhas", tag: "TURISMO", deep: "#3F7A72", mid: "#A9DCC6", land: "#3A6B5C",
    shallow: "M120 140 C 220 100 330 160 320 250 C 310 340 190 360 130 320 C 70 280 40 170 120 140 Z", sand: "M150 190 C 210 170 270 200 265 240 C 260 280 200 290 160 270 C 125 250 120 200 150 190 Z", foam: "M120 140 C 220 100 330 160 320 250" },
  { title: "Praia limpa", place: "Ação de limpeza na orla", tag: "COMUNIDADE", deep: "#456F66", mid: "#86B9A4", land: "#D6C29A",
    shallow: "M260 0 C 220 170 300 330 250 500 L 400 500 L 400 0 Z", sand: "M0 0 L 250 0 C 210 170 290 330 240 500 L 0 500 Z", foam: "M252 0 C 212 170 292 330 242 500" },
  { title: "Rio e cidade", place: "Recife", tag: "URBANO", deep: "#6B6152", mid: "#7E9A8C", land: "#8C8170",
    shallow: "M0 180 C 140 210 260 160 400 200 L 400 330 C 260 300 140 350 0 320 Z", sand: "M0 0 L 400 0 L 400 190 C 260 150 140 200 0 170 Z", foam: "M0 175 C 140 205 260 155 400 195" },
];

const STEPS = [
  ["Chame no WhatsApp", "Conte o local e o que quer mostrar. O orçamento sai na conversa."],
  ["Plano de voo", "Definimos o melhor horário de luz, maré e vento para o seu lugar."],
  ["Captação", "Voo com vídeo 4K e fotos 48MP, na horizontal e na vertical."],
  ["Pronto para postar", "Entrega rápida do material editado, nos formatos de feed, Reels e site."],
];

const muted = "#5C5143";
const stepNum = { margin: "0 0 16px", fontSize: 52, fontWeight: 900, color: "#A8471A", lineHeight: 1 };

export default function Home() {
  const ticker = [...PLACES, ...PLACES];

  return (
    <div style={{ overflowX: "hidden", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <main>
        <Hero />

        <div aria-label="Regiões atendidas" style={{ borderTop: "1px solid rgba(33,27,20,.12)", borderBottom: "1px solid rgba(33,27,20,.12)", padding: "20px 0", overflow: "hidden", background: "#E9DEC9" }}>
          <div className="track">
            {ticker.map((name, i) => (
              <span key={i} className="xp" style={{ display: "flex", alignItems: "center", gap: 32, paddingRight: 32, fontWeight: 800, fontSize: "clamp(18px, 2.4vw, 28px)", textTransform: "uppercase", whiteSpace: "nowrap", color: i % 2 ? "#A8471A" : "#211B14" }}>
                {name}
                <Sparkle />
              </span>
            ))}
          </div>
        </div>

        {/* PROBLEMA */}
        <section className="sec" aria-labelledby="t-problema">
          <div className="wrap g-2">
            <div className="rv-l">
              <p className="eyebrow">O problema</p>
              <h2 id="t-problema" className="h2">Foto de celular não mostra o pé na areia</h2>
              <p className="lead" style={{ marginTop: 24, maxWidth: 480 }}>O cliente decide em segundos, rolando o Instagram ou o Airbnb. Se a sua imagem parece igual à do vizinho, ele passa direto.</p>
            </div>
            <div>
              {PAINS.map(([title, text]) => (
                <div className="pain rv" key={title}>
                  <span className="x" aria-hidden="true"><XIcon /></span>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontSize: 19 }}>{title}</h3>
                    <p style={{ margin: 0, color: muted, lineHeight: 1.55 }}>{text}</p>
                  </div>
                </div>
              ))}
              <div className="rv" style={{ borderTop: "1px solid rgba(33,27,20,.14)", paddingTop: 26 }}>
                <p className="xp" style={{ margin: 0, fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 32px)", lineHeight: 1.1, textTransform: "uppercase" }}>
                  Com o drone, a primeira imagem <span style={{ color: "#A8471A" }}>já vende.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM */}
        <section id="para-quem" className="sec" style={{ paddingTop: 0 }} aria-labelledby="t-para-quem">
          <div className="wrap">
            <div className="head-row">
              <div className="rv-l">
                <p className="eyebrow">Para quem é</p>
                <h2 id="t-para-quem" className="h2">Feito para<br />quem vende aqui</h2>
              </div>
              <p className="lead rv" style={{ maxWidth: 420 }}>Escolha o seu caso: o orçamento já chega no WhatsApp com o assunto certo.</p>
            </div>
            <div className="g-4">
              {SEGMENTS.map((s) => (
                <article className="card rv" key={s.title}>
                  <svg className="ic" width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#A8471A" strokeWidth="2" strokeLinecap="round" aria-hidden="true">{s.icon}</svg>
                  <h3 className="xp" style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05 }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: muted }}>{s.text}</p>
                  <a className="card-link" href={s.href}>{s.cta} <ArrowIcon /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div aria-hidden="true" style={{ overflow: "hidden", paddingBottom: "clamp(56px, 8vw, 110px)" }}>
          <p className="xp slide-big" style={{ margin: 0, whiteSpace: "nowrap", fontWeight: 900, fontSize: "clamp(72px, 15vw, 240px)", lineHeight: 0.9, textTransform: "uppercase", color: "transparent", WebkitTextStroke: "2px rgba(168,71,26,.55)" }}>
            Quem vê de cima, reserva · Quem vê de cima, reserva ·
          </p>
        </div>

        {/* EQUIPAMENTO */}
        <section style={{ padding: "0 0 clamp(72px, 11vw, 150px)" }} aria-labelledby="t-equip">
          <div className="wrap">
            <div className="grow" style={{ background: "#211B14", color: "#F3ECDF", borderRadius: 24, padding: "clamp(28px, 5vw, 72px)" }}>
              <div className="head-row" style={{ marginBottom: "clamp(32px, 4vw, 56px)" }}>
                <div>
                  <p className="eyebrow" style={{ color: "#E39A6E" }}>Qualidade de cinema</p>
                  <h2 id="t-equip" className="h2" style={{ fontSize: "clamp(32px, 5vw, 72px)" }}>DJI Mini 3 no ar</h2>
                </div>
                <p style={{ margin: 0, maxWidth: 420, fontSize: 17, lineHeight: 1.6, color: "#D9CFBF" }}>Leve, silencioso e seguro perto de pessoas e construções. Sensor HDR que aguenta o sol forte do meio-dia e o dourado do fim de tarde.</p>
              </div>
              <Stats />
            </div>
          </div>
        </section>

        {/* PACOTES */}
        <section id="pacotes" className="sec" style={{ paddingTop: 0 }} aria-labelledby="t-pacotes">
          <div className="wrap">
            <div className="head-row">
              <div className="rv-l">
                <p className="eyebrow">Pacotes</p>
                <h2 id="t-pacotes" className="h2">Escolha<br />o seu voo</h2>
              </div>
              <p className="lead rv" style={{ maxWidth: 420 }}>Orçamento sob medida e sem compromisso, direto no WhatsApp. Precisa de algo diferente? A gente monta junto.</p>
            </div>
            <div className="g-3 pkg-wrap">
              {PACKAGES.map((k) => (
                <article className={`pkg rv ${k.hot ? "hot" : ""}`} key={k.name}>
                  {k.hot && <span className="badge">Ideal para pousadas</span>}
                  <div>
                    <h3 className="xp" style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 900, textTransform: "uppercase" }}>{k.name}</h3>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: k.hot ? "#D9CFBF" : muted }}>{k.desc}</p>
                  </div>
                  <ul>
                    {k.items.map((it) => (
                      <li key={it}><CheckIcon color={k.hot ? "#E39A6E" : "#A8471A"} style={{ flex: "0 0 auto", marginTop: 2 }} /><span>{it}</span></li>
                    ))}
                  </ul>
                  <a className={`btn ${k.hot ? "btn-main" : "btn-ghost"}`} href={wa(`Olá! Quero o pacote ${k.name} de filmagem com drone.`)} style={{ marginTop: "auto", width: "100%" }}>
                    {`Quero o ${k.name}`}
                  </a>
                </article>
              ))}
            </div>
            <p className="rv" style={{ margin: "28px 0 0", textAlign: "center", fontSize: 14, color: muted }}>Alta temporada (dezembro a fevereiro) e fins de semana lotam primeiro. Garanta a sua data.</p>
          </div>
        </section>

        {/* VOOS */}
        <section id="voos" className="sec" style={{ paddingTop: 0 }} aria-labelledby="t-voos">
          <div className="wrap">
            <div className="head-row">
              <div className="rv-l">
                <p className="eyebrow">Voos recentes</p>
                <h2 id="t-voos" className="h2">Do feed<br /><span style={{ fontSize: ".62em", letterSpacing: 0 }}>@droneportope</span></h2>
              </div>
              <a className="btn btn-ghost rv" href={INSTAGRAM} target="_blank" rel="noopener"><InstagramIcon />Ver no Instagram</a>
            </div>
          </div>
          <div className="rail" role="list">
            {SHOTS.map((sh) => (
              <a key={sh.title} className="shot rv" role="listitem" href={INSTAGRAM} target="_blank" rel="noopener" style={{ textDecoration: "none", color: "#FFFDF7" }}>
                <svg className="bg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="400" height="500" fill={sh.deep} />
                  <path d={sh.shallow} fill={sh.mid} />
                  <path d={sh.sand} fill={sh.land} />
                  <path className="foam" d={sh.foam} stroke="#FFFDF7" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,27,20,.88) 0%, rgba(33,27,20,0) 55%)" }} />
                <span className="mono" style={{ position: "absolute", top: 16, left: 16, fontSize: 11, letterSpacing: ".1em", background: "rgba(33,27,20,.75)", padding: "6px 10px", borderRadius: 6 }}>{sh.tag}</span>
                <span className="play" style={{ position: "absolute", top: 12, right: 12, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,253,247,.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="#211B14" /></svg>
                </span>
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
                  <h3 className="xp" style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 21, textTransform: "uppercase", lineHeight: 1.05 }}>{sh.title}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#EDE3D2" }}>{sh.place}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como" className="sec" style={{ paddingTop: 0 }} aria-labelledby="t-como">
          <div className="wrap">
            <p className="eyebrow rv">Como funciona</p>
            <h2 id="t-como" className="h2 rv" style={{ marginBottom: "clamp(36px, 5vw, 64px)" }}>Da mensagem<br />ao post em 4 passos</h2>
            <div className="g-4">
              {STEPS.map(([title, text], i) => (
                <div className="step rv" key={title}>
                  <p className="xp" style={stepNum}>0{i + 1}</p>
                  <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{title}</h3>
                  <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: muted }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PILOTO */}
        <section id="piloto" className="sec" style={{ background: "#E9DEC9" }} aria-labelledby="t-piloto">
          <div className="wrap g-2" style={{ alignItems: "center" }}>
            <div className="px" style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 520, width: "100%", margin: "0 auto", borderRadius: "50%", background: "#F3ECDF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
                <circle className="orbit" cx="200" cy="200" r="186" fill="none" stroke="rgba(168,71,26,.55)" strokeWidth="1.5" strokeDasharray="2 12" />
                <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(33,27,20,.1)" />
              </svg>
              <svg className="hover-drone" viewBox="0 0 240 240" style={{ width: "60%", position: "relative" }} aria-hidden="true">
                <g stroke="#4A3F33" strokeWidth="10" strokeLinecap="round"><path d="M120 120 L50 50M120 120 L190 50M120 120 L50 190M120 120 L190 190" /></g>
                <g fill="#2E261D" stroke="#A8471A" strokeWidth="2">
                  <circle cx="50" cy="50" r="36" /><circle cx="190" cy="50" r="36" /><circle cx="50" cy="190" r="36" /><circle cx="190" cy="190" r="36" />
                </g>
                <g fill="rgba(243,236,223,.6)">
                  {[[18, 47], [158, 47], [18, 187], [158, 187]].map(([x, y]) => (
                    <g className="prop" key={`${x}-${y}`}><rect x={x} y={y} width="64" height="6" rx="3" /></g>
                  ))}
                </g>
                <rect x="92" y="88" width="56" height="70" rx="16" fill="#9C9389" />
                <rect x="106" y="150" width="28" height="18" rx="6" fill="#2E261D" />
                <circle cx="120" cy="160" r="5" fill="#E39A6E" />
              </svg>
            </div>
            <div>
              <p className="eyebrow rv">Quem pilota</p>
              <h2 id="t-piloto" className="h2 rv" style={{ marginBottom: 24 }}>Juninho,<br />daqui do Ó</h2>
              <p className="lead rv" style={{ marginBottom: 18, color: "#3B3227" }}>Piloto de Nossa Senhora do Ó, Ipojuca. Conhece cada trecho da costa: a hora em que as piscinas naturais aparecem, de onde vem o vento e qual ângulo valoriza cada lugar.</p>
              <p className="lead rv" style={{ marginBottom: 32, color: "#3B3227" }}>Por ser daqui, ele chega rápido e ajusta a agenda à maré e à luz de cada praia.</p>
              <a className="btn btn-ghost rv" href={WA.geral}>Falar com o Juninho</a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="sec" aria-labelledby="t-faq">
          <div className="wrap g-2">
            <div className="rv-l">
              <p className="eyebrow">Dúvidas</p>
              <h2 id="t-faq" className="h2">Antes de<br />decolar</h2>
              <p className="lead" style={{ marginTop: 24, maxWidth: 420 }}>Não achou sua resposta? Pergunte direto no WhatsApp.</p>
            </div>
            <div className="rv">
              {FAQ.map(({ q, a }, i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}<span className="pl" aria-hidden="true"><PlusIcon /></span></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section style={{ position: "relative", padding: "clamp(96px, 13vw, 190px) 0", overflow: "hidden", background: "#211B14", color: "#F3ECDF" }} aria-labelledby="t-cta">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "55%", opacity: 0.55 }} aria-hidden="true">
            <path className="foam" d="M0 120 C 200 60 400 180 600 120 S 1000 60 1200 120" stroke="#E39A6E" strokeWidth="2" fill="none" />
            <path className="foam b" d="M0 200 C 200 140 400 260 600 200 S 1000 140 1200 200" stroke="#E39A6E" strokeWidth="1.5" fill="none" opacity=".6" />
            <path className="foam c" d="M0 280 C 200 220 400 340 600 280 S 1000 220 1200 280" stroke="#E39A6E" strokeWidth="1" fill="none" opacity=".4" />
          </svg>
          <div className="wrap" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="eyebrow rv" style={{ color: "#E39A6E" }}>Agenda aberta</p>
            <h2 id="t-cta" className="xp rv" style={{ margin: "0 0 28px", fontWeight: 900, fontSize: "clamp(60px, 13vw, 200px)", lineHeight: 0.85, textTransform: "uppercase", letterSpacing: "-.02em" }}>
              Bora<br /><span style={{ color: "#E39A6E" }}>voar?</span>
            </h2>
            <p className="rv" style={{ margin: "0 0 36px", maxWidth: 520, fontSize: "clamp(16px, 1.6vw, 19px)", lineHeight: 1.6, color: "#D9CFBF" }}>Mande o local e o tipo de vídeo. O orçamento sai pelo WhatsApp, sem compromisso.</p>
            <div className="ctas rv" style={{ justifyContent: "center", width: "100%" }}>
              <a className="btn btn-light" href={WA.geral} style={{ minHeight: 62, padding: "0 34px", fontSize: 18 }}>
                <WhatsAppIcon />
                Quero meu orçamento
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ background: "#211B14", color: "#D9CFBF", borderTop: "1px solid rgba(243,236,223,.12)", padding: "48px 0 56px" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
          <div>
            <p className="xp" style={{ margin: "0 0 12px", fontWeight: 900, fontSize: 18, color: "#F3ECDF" }}>DRONE <span style={{ color: "#E39A6E" }}>PORTO</span> PE</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>Filmagem e fotografia aérea com drone em Porto de Galinhas e Ipojuca — PE.</p>
          </div>
          <div>
            <p className="mono" style={{ margin: "0 0 12px", fontSize: 12, letterSpacing: ".12em", color: "#E39A6E" }}>ATENDEMOS</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{PLACES.join(" · ")}</p>
          </div>
          <div>
            <p className="mono" style={{ margin: "0 0 12px", fontSize: 12, letterSpacing: ".12em", color: "#E39A6E" }}>CONTATO</p>
            <p style={{ margin: "0 0 6px", fontSize: 14 }}><a href={WA.geral} style={{ color: "#F3ECDF" }}>WhatsApp {WHATSAPP_DISPLAY}</a></p>
            <p style={{ margin: 0, fontSize: 14 }}><a href={INSTAGRAM} target="_blank" rel="noopener" style={{ color: "#F3ECDF" }}>@droneportope</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
