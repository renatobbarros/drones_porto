"use client";

import { useEffect, useState } from "react";
import { WA, INSTAGRAM } from "@/lib/site";
import { ArrowIcon, DroneMark, WhatsAppIcon } from "./icons";

const LINKS = [
  ["Para quem", "#para-quem"],
  ["Pacotes", "#pacotes"],
  ["Voos", "#voos"],
  ["Como funciona", "#como"],
  ["Dúvidas", "#duvidas"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(243,236,223,.86)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderBottom: "1px solid rgba(33,27,20,.08)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 20 }}>
          <a href="#topo" aria-label="Drone Porto PE — início" onClick={close} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#211B14", minHeight: 44 }}>
            <DroneMark />
            <span className="xp" style={{ fontWeight: 900, fontSize: 17, letterSpacing: ".02em", lineHeight: 1, whiteSpace: "nowrap" }}>
              DRONE <span style={{ color: "#A8471A" }}>PORTO</span> PE
            </span>
          </a>
          <nav className="nav-links" aria-label="Seções">
            {LINKS.filter(([label]) => label !== "Como funciona").map(([label, href]) => (
              <a key={href} className="navlink" href={href}>{label}</a>
            ))}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a className="btn btn-main nav-cta" href={WA.geral} style={{ minHeight: 44, padding: "0 20px", fontSize: 14 }}>Pedir orçamento</a>
            <button
              className={`burger ${open ? "open" : ""}`}
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen(!open)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <nav id="menu-mobile" className="mmenu" aria-label="Menu">
          {LINKS.map(([label, href], i) => (
            <a key={href} className="mlink" href={href} onClick={close} style={{ animationDelay: `${0.05 + i * 0.06}s` }}>
              {label}
              <ArrowIcon size={22} color="#A8471A" />
            </a>
          ))}
          <div style={{ marginTop: "auto", paddingTop: 32, display: "flex", flexDirection: "column", gap: 14 }}>
            <a className="btn btn-main" href={WA.geral} onClick={close} style={{ width: "100%" }}>
              <WhatsAppIcon size={20} />
              Pedir orçamento no WhatsApp
            </a>
            <a className="btn btn-ghost" href={INSTAGRAM} target="_blank" rel="noopener" style={{ width: "100%" }}>@droneportope</a>
          </div>
        </nav>
      )}

      <a className="fab" href={WA.geral} aria-label="Pedir orçamento no WhatsApp">
        <WhatsAppIcon size={28} color="#FFFFFF" />
      </a>
      {!open && (
        <div className="mbar">
          <a className="btn btn-main" href={WA.geral}>
            <WhatsAppIcon size={20} />
            Pedir orçamento no WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
