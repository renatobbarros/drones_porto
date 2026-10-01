import { WA } from "@/lib/site";
import { CheckIcon, WhatsAppIcon } from "./icons";
import Telemetry from "./Telemetry";

// Título animado letra a letra; cada palavra fica inteira (nowrap) para não quebrar no meio.
let delay = 0.15;
const words = (text) =>
  text.split(" ").map((word) =>
    Array.from(word).map((ch) => {
      delay += 0.05;
      return { ch, delay: delay.toFixed(2) + "s" };
    })
  );
const LINE1 = words("Vídeo aéreo");
const LINE2 = words("que vende.");

function Kinetic({ line }) {
  return line.map((chars, i) => (
    <span className="word" key={i}>
      {chars.map((c, j) => (
        <span className="ch" key={j} style={{ animationDelay: c.delay }}>{c.ch}</span>
      ))}
    </span>
  ));
}

const foam = { fill: "none", strokeLinecap: "round" };

function AerialScene() {
  return (
    <svg viewBox="0 0 1000 1250" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} role="img" aria-label="Ilustração de vista aérea da praia de Porto de Galinhas com piscinas naturais">
      <g className="drift">
        <rect x="-300" y="-300" width="1700" height="1900" fill="#3F7A72" />
        <path d="M420 -300 C 520 100 480 420 580 700 C 660 940 620 1200 700 1600 L 1400 1600 L 1400 -300 Z" fill="#4E8F84" />
        <path d="M330 -300 C 410 100 380 420 470 700 C 540 940 510 1200 560 1600 L 860 1600 C 790 1200 830 940 750 700 C 660 420 700 100 640 -300 Z" fill="#6FAE9C" />
        <path d="M290 -300 C 370 100 340 420 430 700 C 500 940 470 1200 510 1600 L 640 1600 C 600 1200 630 950 550 710 C 470 440 500 100 440 -300 Z" fill="#9CCCB6" />
        <path d="M700 160 C 800 130 900 170 905 250 C 910 330 810 360 730 340 C 650 320 620 190 700 160 Z" fill="#3A6B5C" />
        <path className="shimmer" d="M730 205 C 790 190 850 215 850 255 C 850 295 790 305 740 292 C 700 280 695 215 730 205 Z" fill="#A9DCC6" />
        <path d="M760 560 C 870 520 980 570 970 650 C 960 730 840 750 770 715 C 700 680 680 590 760 560 Z" fill="#3A6B5C" />
        <path className="shimmer" d="M790 605 C 850 590 920 612 915 650 C 910 690 840 698 795 680 C 755 662 755 615 790 605 Z" fill="#A9DCC6" />
        <path d="M690 930 C 770 910 850 940 840 990 C 830 1040 740 1050 695 1025 C 650 1000 640 945 690 930 Z" fill="#3A6B5C" />
        <g className="boat"><g transform="translate(820 1050)"><rect x="0" y="0" width="12" height="34" rx="3" fill="#FBF3E4" /><path d="M6 4 L 30 18 L 6 26 Z" fill="#C2552A" /></g></g>
        <g className="boat b"><g transform="translate(940 1160)"><rect x="0" y="0" width="12" height="34" rx="3" fill="#FBF3E4" /><path d="M6 4 L 30 18 L 6 26 Z" fill="#E9B44C" /></g></g>
        <path d="M-300 -300 L 320 -300 C 400 100 370 420 460 700 C 530 940 500 1200 540 1600 L -300 1600 Z" fill="#E4D2AE" />
        <path d="M290 -300 C 370 100 340 420 430 700 C 500 940 470 1200 510 1600" stroke="#C9B48C" strokeWidth="22" fill="none" opacity=".8" />
        <g className="surf"><path className="foam" d="M320 -300 C 400 100 370 420 460 700 C 530 940 500 1200 540 1600" stroke="#FFFDF7" strokeWidth="7" {...foam} /></g>
        <g className="surf b"><path className="foam b" d="M355 -300 C 435 100 405 420 495 700 C 565 940 535 1200 575 1600" stroke="#FFFDF7" strokeWidth="3.5" opacity=".75" {...foam} /></g>
        <g className="surf"><path className="foam c" d="M405 -300 C 485 100 455 420 545 700 C 615 940 585 1200 625 1600" stroke="#FFFDF7" strokeWidth="2" opacity=".5" {...foam} /></g>
        <g fill="#C2552A">
          {[[230, 140], [270, 250], [250, 360], [305, 520], [330, 660], [355, 820]].map(([cx, cy]) => <circle key={cy} cx={cx} cy={cy} r="13" />)}
        </g>
        <g fill="#F2EBDD">
          {[[200, 230], [265, 460], [300, 740], [370, 960]].map(([cx, cy]) => <circle key={cy} cx={cx} cy={cy} r="12" />)}
        </g>
        <rect x="-300" y="-300" width="420" height="1900" fill="#4D5A35" />
        <g fill="#66763F">
          {[[110, 40, 28], [130, 200, 32], [105, 360, 26], [140, 520, 32], [115, 690, 28], [145, 850, 32], [120, 1010, 28]].map(([cx, cy, r]) => <circle key={cy} cx={cx} cy={cy} r={r} />)}
        </g>
        <g fill="#F4EEE2">
          <rect x="-60" y="90" width="120" height="90" rx="4" />
          <rect x="-40" y="290" width="130" height="100" rx="4" />
          <rect x="-70" y="480" width="130" height="120" rx="4" />
          <rect x="-30" y="720" width="110" height="90" rx="4" />
        </g>
        <g fill="#7FC3B4">
          <rect x="-10" y="515" width="44" height="26" rx="7" />
          <rect x="0" y="318" width="40" height="22" rx="7" />
        </g>
      </g>
    </svg>
  );
}

const corner = (pos) => ({ position: "absolute", width: 34, height: 34, ...pos });
const edge = "2px solid #FFFDF7";

export default function Hero() {
  return (
    <section id="topo" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", padding: "clamp(96px, 12vw, 130px) 0 clamp(48px, 6vw, 72px)", overflow: "hidden" }}>
      <svg className="topo" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", pointerEvents: "none" }}>
        <g fill="none" stroke="rgba(33,27,20,.07)" strokeWidth="1.5">
          {[120, 220, 330, 450, 580, 720, 860].map((y, i) => (
            <path key={y} d={`M-50 ${y} C ${200 + i * 20} ${y - 60} ${380 + i * 20} ${y + 80} ${620 + i * 20} ${y + 20} S ${1050 + i * 20} ${y - 80} ${1300 + i * 20} ${y} S ${1600 + i * 10} ${y + 60} 1700 ${y}`} />
          ))}
        </g>
      </svg>

      <div className="wrap hero-grid" style={{ position: "relative", zIndex: 1 }}>
        <div>
          <h1 className="mono fadeup" style={{ margin: "0 0 22px", fontSize: 12, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#A8471A", lineHeight: 1.6, animationDelay: ".1s" }}>
            Filmagem e fotos com drone em Porto de Galinhas — PE
          </h1>
          <p className="xp" style={{ margin: 0, fontWeight: 900, fontSize: "clamp(46px, 7.6vw, 124px)", lineHeight: 0.9, letterSpacing: "-.02em", textTransform: "uppercase" }}>
            <span className="sr">Vídeo aéreo que vende.</span>
            <span className="line" aria-hidden="true" style={{ color: "#211B14" }}><Kinetic line={LINE1} /></span>
            <span className="line" aria-hidden="true" style={{ color: "#A8471A", paddingBottom: ".2em" }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                <Kinetic line={LINE2} />
                <svg className="underline" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true" style={{ position: "absolute", left: 0, bottom: "-.16em", width: "100%", height: ".16em", overflow: "visible" }}>
                  <path d="M4 16 C 90 4 190 22 270 10 S 370 8 396 12" fill="none" stroke="#211B14" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </p>
          <p className="lead fadeup" style={{ marginTop: 26, maxWidth: 540, color: "#3B3227", animationDelay: "1.1s" }}>
            Vídeos e fotos aéreas que fazem o hóspede reservar, o comprador visitar e o seu evento ser lembrado. Para pousadas, imóveis e eventos em Porto de Galinhas e Ipojuca, prontos para Instagram, site, Airbnb e anúncios.
          </p>
          <div className="fadeup" style={{ marginTop: 32, animationDelay: "1.3s" }}>
            <div className="ctas">
              <a className="btn btn-main pulse" href={WA.geral}>
                <WhatsAppIcon />
                Quero meu orçamento
              </a>
              <a className="btn btn-ghost" href="#pacotes">Ver pacotes</a>
            </div>
            <p className="micro"><span className="dot" />Resposta pelo WhatsApp · orçamento sem compromisso</p>
          </div>
          <div className="trust fadeup" style={{ animationDelay: "1.5s" }}>
            {["Piloto local de Ipojuca", "Vídeo 4K HDR", "Reels verticais nativos"].map((t) => (
              <span key={t}><CheckIcon />{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-frame" style={{ position: "relative", width: "100%", padding: "4% 0" }}>
          <div className="sun" aria-hidden="true" style={{ position: "absolute", right: "-10%", top: "-4%", width: "72%", aspectRatio: "1 / 1", borderRadius: "50%", background: "#E6D3B3" }} />
          <svg className="sun" viewBox="0 0 200 200" aria-hidden="true" style={{ position: "absolute", left: "-8%", bottom: "-6%", width: "46%", height: "auto", overflow: "visible" }}>
            <circle className="orbit" cx="100" cy="100" r="96" fill="none" stroke="rgba(168,71,26,.5)" strokeWidth="1.2" strokeDasharray="2 9" />
          </svg>
          <div className="chip a" style={{ left: "-6%", top: "9%" }}>
            <span className="blink" style={{ width: 9, height: 9, borderRadius: "50%", background: "#D23B2A", display: "inline-block" }} />
            Gravando em Porto de Galinhas
          </div>
          <div className="chip b" style={{ right: "-6%", bottom: "12%" }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "#A8471A", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
                <circle cx="12" cy="6" r="3" />
              </svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.2 }}>
              <span>Piscinas naturais</span>
              <span style={{ fontWeight: 500, color: "#5C5143", fontSize: 12 }}>voo na maré baixa</span>
            </span>
          </div>
          <div className="chip c" style={{ right: "-9%", top: "40%" }}>
            <span className="mono" style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, background: "#211B14", color: "#F3ECDF" }}>9:16</span>
            Reels nativo
          </div>

          <div className="tilt" style={{ position: "relative", zIndex: 1, borderRadius: 28, boxShadow: "0 50px 90px -40px rgba(33,27,20,.6)" }}>
            <div className="frame-in" style={{ position: "relative", aspectRatio: "4 / 5", maxHeight: "74vh", width: "100%", borderRadius: 28, overflow: "hidden" }}>
              <AerialScene />
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, background: "linear-gradient(to bottom, rgba(33,27,20,.55), rgba(33,27,20,0))" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "linear-gradient(to top, rgba(33,27,20,.6), rgba(33,27,20,0))" }} />
              <div className="scan" style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(255,253,247,.35)" }} />
              <div style={{ position: "absolute", inset: 16, pointerEvents: "none" }}>
                <div style={corner({ left: 0, top: 0, borderLeft: edge, borderTop: edge })} />
                <div style={corner({ right: 0, top: 0, borderRight: edge, borderTop: edge })} />
                <div style={corner({ left: 0, bottom: 0, borderLeft: edge, borderBottom: edge })} />
                <div style={corner({ right: 0, bottom: 0, borderRight: edge, borderBottom: edge })} />
                <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%, -50%)" }}>
                  <svg width="96" height="96" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                    <circle className="reticle" cx="60" cy="60" r="52" stroke="rgba(255,253,247,.85)" strokeWidth="1.5" strokeDasharray="6 10" />
                    <path d="M60 22v20M60 78v20M22 60h20M78 60h20" stroke="#FFFDF7" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="3" fill="#FFFDF7" />
                  </svg>
                </div>
                <Telemetry />
              </div>
              <div className="shadow-fly" aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <svg width="84" height="84" viewBox="0 0 240 240" style={{ transform: "rotate(-35deg)", opacity: 0.28 }}>
                  <g fill="#211B14">
                    <circle cx="50" cy="50" r="34" /><circle cx="190" cy="50" r="34" /><circle cx="50" cy="190" r="34" /><circle cx="190" cy="190" r="34" />
                    <rect x="88" y="84" width="64" height="76" rx="18" />
                  </g>
                  <g stroke="#211B14" strokeWidth="12"><path d="M120 120 L50 50M120 120 L190 50M120 120 L50 190M120 120 L190 190" /></g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cue hud-hide" aria-hidden="true" style={{ position: "absolute", left: "50%", bottom: 22, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 1 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: ".2em", color: "#5C5143" }}>ROLE</span>
        <span style={{ width: 1.5, height: 40, background: "rgba(33,27,20,.15)", position: "relative", overflow: "hidden" }}>
          <span className="cue-line" style={{ position: "absolute", inset: 0, background: "#A8471A" }} />
        </span>
      </div>
    </section>
  );
}
