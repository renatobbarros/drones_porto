'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

const DroneScene = dynamic(() => import('../components/DroneScene'), {
  ssr: false,
});

const TelemetryHUD = dynamic(() => import('../components/TelemetryHUD'), {
  ssr: false,
});

export default function Home() {
  // Shared ref holding the real-time physical properties of the drone.
  // GSAP will animate this object, and the Canvas useFrame will apply it.
  const droneState = useRef({
    x: 0,
    y: 0,
    z: 2,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    speed: 0,
    progress: 0,
  });

  const scrollWrapperRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Commercial');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Create a master GSAP Timeline that triggers along the full page scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // smooth inertia lag
          onUpdate: (self) => {
            // Calculate velocity of scroll to drive propeller speed
            const velocity = self.getVelocity() / 2500; // normalized scroll speed
            droneState.current.speed = Math.min(1.2, Math.abs(velocity));
            droneState.current.progress = self.progress;

            // Update active section state based on progress
            const newSection = Math.min(4, Math.floor(self.progress * 4.9));
            setActiveSection(newSection);
          },
        },
      });

      // Define default values
      // Timeline Duration is 4, each phase corresponds to 1 unit of time

      // ================= PHASE 1: HERO -> ABOUT =================
      // Drone does a 3D loop in an elliptical orbit through the center screen,
      // pitching forward (rotX) and rolling into the curve (rotZ)
      tl.to(droneState.current, {
        x: 1.6,
        y: 1.0,
        z: 1.4,
        rotX: -0.35, // pitch up
        rotY: 0.5,
        rotZ: -0.65, // roll left
        duration: 0.3,
        ease: 'sine.inOut',
      })
      .to(droneState.current, {
        x: 0,
        y: 2.0,
        z: 0.6,
        rotX: -0.95, // loop peak
        rotY: 1.5,
        rotZ: -1.0, // heavy roll
        duration: 0.3,
        ease: 'sine.inOut',
      })
      .to(droneState.current, {
        x: -1.6,
        y: 0.6,
        z: 1.0,
        rotX: 0.45, // descending
        rotY: 2.2,
        rotZ: -0.3, // ease roll
        duration: 0.25,
        ease: 'sine.inOut',
      })
      // Settle at Section 2: About (left side, profile Y rotation looking right)
      .to(droneState.current, {
        x: -2.5,
        y: 0.0,
        z: 1.5,
        rotX: 0.0,
        rotY: Math.PI / 2, // 90 deg profile
        rotZ: 0.0,
        duration: 0.15,
        ease: 'power2.out',
      })

      // ================= PHASE 2: ABOUT -> SERVICES =================
      // Descending Arch curve: drone climbs slightly and drops fast
      .to(droneState.current, {
        x: -0.5,
        y: 1.2,
        z: 1.2,
        rotX: -0.3, // climb angle
        rotY: 0.8,
        rotZ: 0.5, // roll right to bank
        duration: 0.4,
        ease: 'power1.out',
      })
      .to(droneState.current, {
        x: 1.2,
        y: -0.1,
        z: 1.0,
        rotX: 0.5, // dive forward pitch
        rotY: 2.4,
        rotZ: 0.25,
        duration: 0.35,
        ease: 'power2.in',
      })
      // Settle at Section 3: Services (right side, rotated 180 Y pilot perspective)
      .to(droneState.current, {
        x: 1.8,
        y: -0.5,
        z: 1.0,
        rotX: 0.0,
        rotY: Math.PI, // looking away
        rotZ: 0.0,
        duration: 0.25,
        ease: 'power2.out',
      })

      // ================= PHASE 3: SERVICES -> PORTFOLIO =================
      // Drone retracts back in Z and ascends in Y to clear screen space for grids
      .to(droneState.current, {
        x: 1.3,
        y: 1.5,
        z: -1.8,
        rotX: 0.1,
        rotY: Math.PI * 1.3, // diagonal profile
        rotZ: 0.05,
        duration: 1.0,
        ease: 'power2.inOut',
      })

      // ================= PHASE 4: PORTFOLIO -> CONTACT =================
      // Drone shoots back into foreground (z: 1.8) on right side,
      // spins 180 degrees quickly, pitches forward, and rolls left
      // to point physically at the contact form on the left
      .to(droneState.current, {
        x: 0.8,
        y: -0.2,
        z: 1.8,
        rotX: 0.12, // pitch down to form
        rotY: Math.PI * 2.15, // spin to face forward-left
        rotZ: -0.15, // tilt bank pointing left
        duration: 1.0,
        ease: 'power2.inOut',
      });
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setFormSubmitted(true);
    
    // Wow factor confetti - dynamic client import to prevent SSR build issues
    try {
      const { default: confetti } = await import('canvas-confetti');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e2e8f0', '#f59e0b', '#334155'],
      });
    } catch (err) {
      console.error("Failed to load confetti", err);
    }

    // Reset form after delay
    setTimeout(() => {
      setName('');
      setEmail('');
      setProjectType('Commercial');
      setMessage('');
      setFormSubmitted(false);
    }, 6000);
  };

  const scrollToSection = (index) => {
    const sections = ['hero', 'about', 'services', 'portfolio', 'contact'];
    const element = document.getElementById(sections[index]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen text-slate-100 bg-transparent overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 3D Scene Background Canvas */}
      <DroneScene droneState={droneState} />

      {/* Dynamic Telemetry HUD overlay */}
      <TelemetryHUD droneState={droneState} />

      {/* Floating Side Dot Navigation - Hidden on Small Screens for Cleaner Layout */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 sm:gap-4 z-50 pointer-events-auto bg-black/30 backdrop-blur-md p-2.5 sm:p-3 rounded-full border border-zinc-800/30 hidden sm:flex">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            aria-label={`Ir para seção ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                : 'bg-zinc-600 hover:bg-zinc-400'
            }`}
          />
        ))}
      </div>

      {/* Main Scroll Content Overlay */}
      <div id="scroll-wrapper" ref={scrollWrapperRef} className="relative z-10 w-full">
        
        {/* ================= SEÇÃO 1: HERO ================= */}
        <section
          id="hero"
          className="relative flex flex-col justify-between items-center w-full min-h-screen pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-12 md:px-24"
        >
          {/* Transparent Header branding */}
          <div className="w-full flex justify-between items-center z-30">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] font-bold text-zinc-100 uppercase">SKYFLOW</span>
            </div>
            <div className="text-zinc-500 font-mono text-[9px] sm:text-xs tracking-widest">
              DJI MINI 3 | CAPTAÇÃO 4K HDR
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-4xl text-center flex flex-col items-center gap-4 sm:gap-6 mt-16 sm:mt-24 pointer-events-auto px-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-amber-400/20 bg-amber-950/30 text-amber-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Filmagens com Drone
            </div>
            
            <h1 className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter text-zinc-50 uppercase leading-none select-none">
              PERSPECTIVAS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-zinc-200 to-amber-500">
                INFINITAS
              </span>
            </h1>
            
            <p className="max-w-xl text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed font-light tracking-wide mt-2">
              Imagens aéreas de alta qualidade capturadas em Nossa Senhora do Ó e toda a região de Ipojuca/Porto de Galinhas. 
              Dê destaque para seu comércio, eventos e imóveis.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={() => scrollToSection(1)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-zinc-950 bg-amber-400 font-semibold tracking-wide hover:bg-amber-300 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg shadow-amber-950/20 text-xs sm:text-sm"
              >
                Conhecer Trabalho
              </button>
              <button
                onClick={() => scrollToSection(4)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-zinc-700 bg-zinc-900/30 font-semibold tracking-wide hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
              >
                Falar com Juninho
              </button>
            </div>
          </div>

          {/* Scroll instruction indicator */}
          <div className="flex flex-col items-center gap-1.5 pointer-events-auto cursor-pointer z-10" onClick={() => scrollToSection(1)}>
            <span className="font-mono text-[8px] sm:text-xxs tracking-[0.3em] uppercase text-zinc-500 hover:text-amber-400 transition-colors">
              Role para Voar (Scroll)
            </span>
            <div className="w-4 h-7 rounded-full border border-zinc-700/80 flex justify-center p-0.5">
              <div className="w-0.5 h-1.5 bg-amber-400 rounded-full animate-bounce mt-0.5" />
            </div>
          </div>
        </section>


        {/* ================= SEÇÃO 2: SOBRE ================= */}
        <section
          id="about"
          className="relative flex items-center w-full min-h-screen py-16 sm:py-24 px-4 sm:px-12 md:px-24 bg-gradient-to-r from-transparent to-black/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full z-10">
            {/* Left side empty on desktop to let the DJI Mini 3 show off its profile Y rotation */}
            <div className="hidden md:block md:col-span-5 lg:col-span-6" />

            {/* Right side Text Block - with dark background card on mobile for readability */}
            <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center gap-4 sm:gap-6 bg-black/60 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-2xl border border-zinc-800/40 sm:border-none pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 tracking-widest font-mono uppercase">
                [ 02 / O PILOTO ]
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-50 uppercase leading-tight">
                A LENTE DE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 font-bold">
                  JUNINHO
                </span>
              </h2>
              
              <div className="h-0.5 w-12 sm:w-16 bg-amber-400" />

              <p className="text-zinc-300 leading-relaxed font-light tracking-wide text-xs sm:text-sm md:text-base">
                Eae! Sou o Juninho, piloto de drone baseado em Nossa Senhora do Ó, Ipojuca. Especializado em tomadas aéreas dinâmicas usando o DJI Mini 3, capturando as belezas naturais e urbanas do litoral pernambucano por ângulos totalmente inovadores.
              </p>
              
              <p className="text-zinc-400 leading-relaxed font-light text-xs sm:text-xs">
                O DJI Mini 3 é o drone ultraleve perfeito com apenas 249g, permitindo voos ágeis e seguros. Equipado com o sensor HDR nativo e abertura f/1.7, capto fotos em 48MP e vídeos em 4K extremamente nítidos mesmo com pouca luz. Além disso, a câmera rotaciona 90 graus para filmagens verticais reais, ideal para Reels e TikTok.
              </p>

              {/* Stats HUD layout */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2 bg-zinc-950/60 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-zinc-850 font-mono text-center sm:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">4K HDR</div>
                  <div className="text-[7px] sm:text-xxs text-zinc-500 uppercase tracking-wider mt-1">Alta Resolução</div>
                </div>
                <div className="border-l border-zinc-800 pl-2.5 sm:pl-4">
                  <div className="text-xl sm:text-2xl font-black text-zinc-100">f/1.7</div>
                  <div className="text-[7px] sm:text-xxs text-zinc-500 uppercase tracking-wider mt-1">Super Abertura</div>
                </div>
                <div className="border-l border-zinc-800 pl-2.5 sm:pl-4">
                  <div className="text-xl sm:text-2xl font-black text-zinc-100">249g</div>
                  <div className="text-[7px] sm:text-xxs text-zinc-500 uppercase tracking-wider mt-1">Peso Ultraleve</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= SEÇÃO 3: SERVIÇOS ================= */}
        <section
          id="services"
          className="relative flex items-center w-full min-h-screen py-16 sm:py-24 px-4 sm:px-12 md:px-24 bg-gradient-to-l from-transparent to-black/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full z-10">
            {/* Left side text block - with background card on mobile */}
            <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center gap-4 sm:gap-6 bg-black/60 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-2xl border border-zinc-800/40 sm:border-none pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 tracking-widest font-mono uppercase">
                [ 03 / SERVIÇOS ]
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-50 uppercase leading-tight">
                VÍDEOS QUE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 font-bold">
                  DESTACAM
                </span>
              </h2>

              <div className="h-0.5 w-12 sm:w-16 bg-amber-400" />

              <p className="text-zinc-300 leading-relaxed font-light text-xs sm:text-sm md:text-base">
                Produções sob medida para valorizar negócios locais, turismo e o mercado residencial na região de Ipojuca.
              </p>

              {/* Interactive Services List */}
              <div className="flex flex-col gap-3 mt-1">
                
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 hover:border-amber-400/30 hover:bg-zinc-900/10 transition-all duration-300 group">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-mono text-xs sm:text-sm font-bold group-hover:bg-amber-400 group-hover:text-zinc-950 transition-all duration-300">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 text-xs sm:text-sm group-hover:text-zinc-50">Comércio & Negócios</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
                      Apresente sua pousada, hotel, restaurante ou comércio local com tomadas aéreas dinâmicas que atraem muito mais clientes no Instagram.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 hover:border-amber-400/30 hover:bg-zinc-900/10 transition-all duration-300 group">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-mono text-xs sm:text-sm font-bold group-hover:bg-amber-400 group-hover:text-zinc-950 transition-all duration-300">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 text-xs sm:text-sm group-hover:text-zinc-50">Mercado Imobiliário</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
                      Fotos e vídeos aéreos incríveis de terrenos, casas e condomínios, exibindo a infraestrutura e a bela proximidade com as praias.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-zinc-850 bg-zinc-950/20 hover:border-amber-400/30 hover:bg-zinc-900/10 transition-all duration-300 group">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-mono text-xs sm:text-sm font-bold group-hover:bg-amber-400 group-hover:text-zinc-950 transition-all duration-300">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-200 text-xs sm:text-sm group-hover:text-zinc-50">Cobertura de Eventos</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
                      Registre confraternizações, casamentos, eventos esportivos e comemorações com ângulos amplos e movimentos de câmera surpreendentes.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side empty on desktop to let the DJI Mini 3 show off its pilot Y rotation */}
            <div className="hidden md:block md:col-span-5 lg:col-span-6" />
          </div>
        </section>


        {/* ================= SEÇÃO 4: TRABALHOS (PORTFÓLIO GRID) ================= */}
        <section
          id="portfolio"
          className="relative flex flex-col justify-center w-full min-h-screen py-16 sm:py-24 px-4 sm:px-12 md:px-24"
        >
          <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 sm:gap-8 pointer-events-auto">
            
            {/* Header section title */}
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 tracking-widest font-mono uppercase">
                [ 04 / PROJETOS DE VOO ]
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-50 uppercase leading-none">
                GALERIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 font-bold">DE VOO</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
                Explore algumas produções aéreas recentes. O drone DJI Mini 3 se afasta no fundo para não bloquear as fotos do portfólio.
              </p>
            </div>

            {/* Premium CSS Grid of Video Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
              
              {/* Card 1 */}
              <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md aspect-video sm:aspect-square flex flex-col justify-end p-5 cursor-pointer hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-500">
                {/* Background high-tech gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-[#0e1115] -z-10 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                
                {/* Visual Camera lens look overlay */}
                <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800 bg-zinc-950/70 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="w-2 h-2 rounded-full bg-red-500 group-hover:animate-ping" />
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-mono text-[8px] sm:text-xxs text-amber-400 font-bold tracking-widest uppercase">TURISMO / LAZER</span>
                  <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight group-hover:text-amber-300 transition-colors">Porto de Galinhas</h3>
                  <p className="text-[10px] sm:text-xxs text-zinc-400 leading-normal font-light">
                    Mergulho de câmera revelando as piscinas naturais e os corais sob luz dourada matinal.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md aspect-video sm:aspect-square flex flex-col justify-end p-5 cursor-pointer hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-950/20 via-zinc-900/60 to-[#0e1115] -z-10 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                
                <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800 bg-zinc-950/70 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-mono text-[8px] sm:text-xxs text-sky-400 font-bold tracking-widest uppercase">IMOBILIÁRIO</span>
                  <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight group-hover:text-amber-300 transition-colors">Residencial Ó</h3>
                  <p className="text-[10px] sm:text-xxs text-zinc-400 leading-normal font-light">
                    Voo rasante sobre a fachada e área de lazer comum, destacando a arquitetura integrada.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md aspect-video sm:aspect-square flex flex-col justify-end p-5 cursor-pointer hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-[#0e1115] -z-10 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                
                <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800 bg-zinc-950/70 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-mono text-[8px] sm:text-xxs text-emerald-400 font-bold tracking-widest uppercase">COMÉRCIO LOCAL</span>
                  <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight group-hover:text-amber-300 transition-colors">Pousada Mar Azul</h3>
                  <p className="text-[10px] sm:text-xxs text-zinc-400 leading-normal font-light">
                    Clipe de divulgação aérea evidenciando a proximidade da praia e a piscina com vista mar.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md aspect-video sm:aspect-square flex flex-col justify-end p-5 cursor-pointer hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-zinc-900/60 to-[#0e1115] -z-10 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                
                <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full border border-zinc-800 bg-zinc-950/70 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-mono text-[8px] sm:text-xxs text-indigo-400 font-bold tracking-widest uppercase">PAISAGISMO</span>
                  <h3 className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight group-hover:text-amber-300 transition-colors">Orla de Ipojuca</h3>
                  <p className="text-[10px] sm:text-xxs text-zinc-400 leading-normal font-light">
                    Panorâmica em 4K acompanhando as palmeiras e as praias de areia branca da nossa costa.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================= SEÇÃO 5: CONTATO ================= */}
        <section
          id="contact"
          className="relative flex items-center w-full min-h-screen py-16 sm:py-24 px-4 sm:px-12 md:px-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-6xl mx-auto z-10">
            
            {/* Left side: Contact Form - with background card on mobile */}
            <div className="md:col-span-7 flex flex-col justify-center gap-4 sm:gap-6 bg-black/60 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-5 sm:p-0 rounded-2xl border border-zinc-800/40 sm:border-none pointer-events-auto">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-amber-400 tracking-widest font-mono uppercase">
                [ 05 / AGENDAR VOO ]
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-50 uppercase leading-none">
                BORA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 font-bold">GRAVAR?</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md">
                Preencha as informações do seu negócio. O DJI Mini 3 se posiciona no plano frontal, apontando as lentes em direção ao formulário.
              </p>

              {formSubmitted ? (
                <div className="p-5 sm:p-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 text-emerald-300 flex flex-col gap-2 max-w-md animate-fade-in">
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sinal Enviado!
                  </h3>
                  <p className="text-[10px] sm:text-xs text-emerald-400/80 leading-relaxed font-mono">
                    TELEMETRIA STATUS: LINK ATIVO. Mensagem transmitida para Juninho. Aguarde nosso retorno para planejar a gravação!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5 sm:gap-4 max-w-md bg-zinc-900/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-zinc-800/40">
                  
                  {/* Name field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="form-name" className="text-[9px] sm:text-xxs font-mono text-zinc-500 uppercase tracking-widest">Seu Nome / Nome Comercial</label>
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Pousada Recanto"
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-zinc-950/80 border border-zinc-850 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="form-email" className="text-[9px] sm:text-xxs font-mono text-zinc-500 uppercase tracking-widest">E-mail de Contato</label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: contato@pousada.com"
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-zinc-950/80 border border-zinc-850 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600"
                    />
                  </div>

                  {/* Project selection */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="form-type" className="text-[9px] sm:text-xxs font-mono text-zinc-500 uppercase tracking-widest">Tipo de Trabalho</label>
                    <select
                      id="form-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-zinc-950/80 border border-zinc-850 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Commercial">Comércio Local / Pousada</option>
                      <option value="Real Estate">Imóvel de Luxo / Terreno</option>
                      <option value="Event">Gravação de Evento</option>
                      <option value="Other">Outro</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="form-message" className="text-[9px] sm:text-xxs font-mono text-zinc-500 uppercase tracking-widest">Fale sobre seu Projeto</label>
                    <textarea
                      id="form-message"
                      rows="2.5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Fale brevemente sobre o local e o que gostaria de filmar..."
                      className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-lg bg-zinc-950/80 border border-zinc-850 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 sm:py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold tracking-wider text-[10px] sm:text-xs uppercase transition-all duration-300 mt-1 shadow-md shadow-amber-950/20 hover:scale-[1.01] cursor-pointer"
                  >
                    Agendar decolagem
                  </button>

                </form>
              )}
            </div>

            {/* Right side: Operations board & status (with background card on mobile) */}
            <div className="md:col-span-5 flex flex-col justify-end gap-4 sm:gap-6 pointer-events-auto text-[10px] sm:text-xs font-mono">
              <div className="bg-zinc-950/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-zinc-800/40 flex flex-col gap-3 sm:gap-4 text-zinc-400">
                <div className="text-zinc-200 font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">
                  BASE DE OPERAÇÕES
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span>LOCAL:</span>
                    <span className="text-zinc-200 font-semibold">Nossa Senhora do Ó, Ipojuca, PE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS VFR:</span>
                    <span className="text-emerald-400 font-semibold">CÉU LIMPO (NÃO CERTIFICADO)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VENTO LOCAL:</span>
                    <span className="text-zinc-200">6 KTS / NE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KP INDEX:</span>
                    <span className="text-emerald-400">1 (EXCELENTE LINK GPS)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DRONE:</span>
                    <span className="text-zinc-200 font-semibold">DJI MINI 3 (249g)</span>
                  </div>
                </div>
                <div className="text-[8px] sm:text-xxs text-zinc-600 leading-normal border-t border-zinc-800/40 pt-2">
                  DISPONÍVEL PARA CAPTAÇÃO CINEMATOGRÁFICA AÉREA EM IPOJUCA, PORTO DE GALINHAS, SERRAMBI E ARREDORES.
                </div>
              </div>
              {/* Spacer on desktop to let the drone hang here */}
              <div className="hidden md:block h-12" />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
