"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { pre: "", target: 4, dec: 0, unit: "K", label: "Vídeo HDR" },
  { pre: "", target: 48, dec: 0, unit: "MP", label: "Fotos em alta" },
  { pre: "", target: 249, dec: 0, unit: "g", label: "Leve e seguro" },
  { pre: "f/", target: 1.7, dec: 1, unit: "", label: "Luz de fim de tarde" },
];

// Números do equipamento que contam do zero quando entram na tela.
export default function Stats() {
  const ref = useRef(null);
  const [k, setK] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setK(1);
      return;
    }
    let raf;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / 1600);
        setK(1 - Math.pow(1 - p, 3));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="g-stats" ref={ref}>
      {STATS.map((s) => (
        <div key={s.label} style={{ borderTop: "1px solid rgba(227,154,110,.5)", paddingTop: 18 }}>
          <p className="xp" style={{ margin: 0, fontWeight: 900, fontSize: "clamp(42px, 6vw, 88px)", lineHeight: 1, color: "#F3ECDF" }}>
            {s.pre}{(s.target * k).toFixed(s.dec)}
            <span style={{ color: "#E39A6E", fontSize: ".45em" }}>{s.unit}</span>
          </p>
          <p className="mono" style={{ margin: "10px 0 0", fontSize: 12, letterSpacing: ".1em", color: "#D9CFBF", textTransform: "uppercase" }}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
