"use client";

import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

// Leitura de voo simulada no visor do hero (REC, altitude, velocidade, bateria).
export default function Telemetry() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), 250);
    return () => clearInterval(id);
  }, []);

  const secs = Math.floor(t / 4);
  const climb = Math.min(1, t / 24);
  const alt = Math.round(climb * 87 + Math.sin(t / 6) * 2 * climb);
  const vel = Math.max(0, Math.round(climb * 24 + Math.sin(t / 3) * 3));
  const bat = Math.max(62, 98 - Math.floor(t / 240));
  const hud = { position: "absolute", left: 46, right: 46, display: "flex", justifyContent: "space-between", gap: 12, fontSize: 11, letterSpacing: ".08em", color: "#FFFDF7" };

  return (
    <>
      <div className="mono" style={{ ...hud, top: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="blink" style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5A4A", display: "inline-block" }} />
          REC 00:{pad(Math.floor(secs / 60))}:{pad(secs % 60)}
        </span>
        <span className="hud-hide">4K · 30FPS · HDR</span>
        <span>BAT {bat}%</span>
      </div>
      <div className="mono" style={{ ...hud, bottom: 8 }}>
        <span>ALT <b style={{ fontSize: 15 }}>{String(alt).padStart(3, "0")}</b>m</span>
        <span>VEL <b style={{ fontSize: 15 }}>{vel}</b>km/h</span>
        <span className="hud-hide">8°30′S 35°00′W</span>
      </div>
    </>
  );
}
