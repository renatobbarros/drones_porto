'use client';

import React, { useEffect, useRef } from 'react';

export default function TelemetryHUD({ droneState }) {
  // Direct DOM refs to update telemetry at 60fps without React state overhead
  const altRef = useRef();
  const distRef = useRef();
  const hSpeedRef = useRef();
  const vSpeedRef = useRef();
  const pitchRef = useRef();
  const rollRef = useRef();
  const yawRef = useRef();
  const modeRef = useRef();
  const signalRef = useRef();
  const statusRef = useRef();
  const statusIndicatorRef = useRef();

  useEffect(() => {
    let animFrameId;
    let lastZ = droneState.current?.z || 2;
    let lastTime = performance.now();

    const updateHUD = () => {
      if (!droneState.current) {
        animFrameId = requestAnimationFrame(updateHUD);
        return;
      }

      const s = droneState.current;
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // 1. Calculate virtual flight values based on drone coordinates
      const progress = s.progress; // 0 to 1
      const velocity = Math.abs(s.speed); // scroll speed

      // Height: ranges from 1.2m (hero) to 18.5m (loop peak), 2.2m (about), 4.8m (services), 15.0m (portfolio), 2.0m (contact)
      let targetHeight = 1.2;
      if (progress > 0.02 && progress <= 0.25) {
        // Loop peak is around 18.5m
        targetHeight = 1.2 + Math.sin((progress / 0.25) * Math.PI) * 17.3;
      } else if (progress > 0.25 && progress <= 0.5) {
        // About (profile) is around 3.5m
        const t = (progress - 0.25) / 0.25;
        targetHeight = 1.2 + (2.3 * t);
      } else if (progress > 0.5 && progress <= 0.75) {
        // Services/Portfolio
        const t = (progress - 0.5) / 0.25;
        targetHeight = 3.5 + (8.5 * t);
      } else if (progress > 0.75) {
        // Landing to contact
        const t = (progress - 0.75) / 0.25;
        targetHeight = 12.0 - (10.0 * t);
      }
      
      // Add slight noise to simulate natural wind turbulence on height
      const noise = Math.sin(now / 150) * 0.05;
      const currentHeight = Math.max(0.1, targetHeight + noise);

      // Distance: Home point offset
      const currentDistance = progress * 242.4;

      // Flight Mode Selection: Sport mode during loops, Cine during profile shoots, Normal otherwise
      let modeText = 'N-MODE';
      let signalColor = 'text-sky-400 border-sky-400/30 bg-sky-950/20';
      let maxSpeedKmh = 36.0; // Normal Mode max speed (10 m/s for DJI Mini 3)

      if (velocity > 0.15 && progress < 0.3) {
        modeText = 'S-MODE'; // Sport mode
        signalColor = 'text-amber-400 border-amber-400/30 bg-amber-950/20';
        maxSpeedKmh = 57.6; // Sport Mode max speed (16 m/s for DJI Mini 3)
      } else if (progress >= 0.25 && progress < 0.5) {
        modeText = 'C-MODE'; // Cine mode (slow smooth profile)
        signalColor = 'text-emerald-400 border-emerald-400/30 bg-emerald-950/20';
        maxSpeedKmh = 21.6; // Cine Mode max speed (6 m/s for DJI Mini 3)
      }

      // H.Speed (Horizontal Speed): map scroll velocity to km/h, capped by the current mode's top speed
      const currentHSpeed = Math.min(maxSpeedKmh, velocity * 140.0);

      // V.Speed (Vertical Speed): compute from change in height
      const currentVSpeed = dt > 0 ? (s.y - lastZ) / dt : 0;
      lastZ = s.y;

      // Pitch, Roll, Yaw in degrees
      const pitchDeg = Math.round(s.rotX * (180 / Math.PI));
      const rollDeg = Math.round(s.rotZ * (180 / Math.PI));
      // Adjust yaw to standard compass degrees [0, 360]
      let yawDeg = Math.round((s.rotY * (180 / Math.PI)) % 360);
      if (yawDeg < 0) yawDeg += 360;

      // Update HUD elements directly in the DOM for performance
      if (altRef.current) altRef.current.textContent = `H: ${currentHeight.toFixed(1)}m`;
      if (distRef.current) distRef.current.textContent = `D: ${currentDistance.toFixed(1)}m`;
      if (hSpeedRef.current) hSpeedRef.current.textContent = `${currentHSpeed.toFixed(1)} km/h`;
      if (vSpeedRef.current) {
        const sign = currentVSpeed >= 0 ? '+' : '';
        vSpeedRef.current.textContent = `V.S: ${sign}${currentVSpeed.toFixed(1)} m/s`;
      }
      if (pitchRef.current) pitchRef.current.textContent = `PITCH: ${pitchDeg}°`;
      if (rollRef.current) rollRef.current.textContent = `ROLL: ${rollDeg}°`;
      if (yawRef.current) yawRef.current.textContent = `YAW: ${yawDeg}°`;
      
      if (modeRef.current) {
        modeRef.current.textContent = modeText;
        // Apply class changes
        modeRef.current.className = `px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-semibold rounded border ${signalColor}`;
      }

      // Dynamic flight status message
      if (statusRef.current && statusIndicatorRef.current) {
        if (velocity > 0.3) {
          statusRef.current.textContent = 'HIGH SPEED FLIGHT';
          statusIndicatorRef.current.className = 'w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping';
        } else if (currentHeight < 1.0) {
          statusRef.current.textContent = 'LOW ALTITUDE WARN';
          statusIndicatorRef.current.className = 'w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse';
        } else {
          statusRef.current.textContent = 'GPS FLYING (POSITION LOCK)';
          statusIndicatorRef.current.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
        }
      }

      animFrameId = requestAnimationFrame(updateHUD);
    };

    updateHUD();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [droneState]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-20 font-mono text-zinc-300 select-none text-[10px] sm:text-xs">
      
      {/* ================= TOP HUD BAR ================= */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-start pointer-events-auto">
        
        {/* Top Left: RC / Satellite Info */}
        <div className="flex items-center gap-2 sm:gap-4 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-zinc-800/40 text-[9px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            {/* GPS icon */}
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">GPS (16)</span>
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">RC Link:</span>
            <span className="text-emerald-400 font-bold">5.8G</span>
          </div>
          <div className="w-px h-3 bg-zinc-800 hidden sm:block" />
          <div className="text-zinc-400 hidden sm:block">DJI O2 | 720p@30</div>
        </div>

        {/* Top Center: Flight Status Warning - Hidden on Mobile */}
        <div className="hidden md:flex flex-col items-center gap-1 bg-black/50 backdrop-blur-md px-6 py-2 rounded-lg border border-zinc-800/40 text-center">
          <div className="flex items-center gap-2 tracking-wider">
            <div ref={statusIndicatorRef} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span ref={statusRef} className="font-bold text-zinc-100">GPS FLYING (POSITION LOCK)</span>
          </div>
        </div>

        {/* Top Right: Battery & Mode */}
        <div className="flex items-center gap-2 sm:gap-4 bg-black/50 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-zinc-800/40 text-[9px] sm:text-xs">
          <div ref={modeRef} className="px-1.5 sm:px-2 py-0.5 font-semibold rounded border border-sky-400/30 text-sky-400 bg-sky-950/20">
            N-MODE
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">BAT:</span>
            <span className="font-bold text-emerald-400">98%</span>
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2-2a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1H4z" />
              <path d="M18 8h1a1 1 0 011 1v2a1 1 0 01-1 1h-1V8z" />
            </svg>
          </div>
          <div className="text-zinc-400 hidden sm:block">38:00 MIN</div>
        </div>

      </div>


      {/* ================= MIDDLE CORNER HUD ELEMENTS - Hidden on Mobile ================= */}
      <div className="hidden lg:block">
        {/* Left Crosshairs */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col items-center gap-2 opacity-25">
          <div className="w-8 h-px bg-zinc-300" />
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <div className="w-8 h-px bg-zinc-300" />
        </div>
        
        {/* Right Crosshairs */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col items-center gap-2 opacity-25">
          <div className="w-8 h-px bg-zinc-300" />
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
          <div className="w-8 h-px bg-zinc-300" />
        </div>
      </div>


      {/* ================= BOTTOM TELEMETRY HUD ================= */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-end pointer-events-auto">
        
        {/* Bottom Left: Distance and Altitude details */}
        <div className="flex flex-col gap-0.5 sm:gap-1 bg-black/50 backdrop-blur-md p-2.5 sm:p-4 rounded-lg border border-zinc-800/40 text-[9px] sm:text-xs">
          <div className="text-zinc-500 text-[7px] sm:text-xxs tracking-widest font-semibold opacity-75">TELEMETRIA</div>
          <div className="flex gap-2.5 sm:gap-4 mt-0.5">
            <span ref={altRef} className="font-bold text-zinc-100 text-sm sm:text-base">H: 1.2m</span>
            <span ref={distRef} className="font-bold text-zinc-100 text-sm sm:text-base">D: 0.0m</span>
          </div>
          <div className="flex gap-2 sm:gap-4 text-[8px] sm:text-xxs text-zinc-400 mt-0.5">
            <span ref={vSpeedRef}>V.S: 0.0 m/s</span>
            <span className="hidden sm:inline">LIMIT: 120m</span>
          </div>
        </div>

        {/* Bottom Center: Physical Attitude Display / Radar HUD - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-6 bg-black/50 backdrop-blur-md px-6 py-3 rounded-lg border border-zinc-800/40 text-xs">
          {/* Virtual Radar Circle */}
          <div className="relative w-10 h-10 rounded-full border border-zinc-800/60 flex items-center justify-center bg-zinc-950/40">
            <div className="absolute inset-0 rounded-full border border-dashed border-zinc-700/20" />
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="absolute top-0.5 text-[6px] text-zinc-500 font-bold">N</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-zinc-500 text-xxs tracking-wider uppercase">Gimbal Atitude</div>
            <div className="grid grid-cols-3 gap-x-4 text-xxs font-semibold text-zinc-200 mt-0.5">
              <span ref={pitchRef}>PITCH: 0°</span>
              <span ref={rollRef}>ROLL: 0°</span>
              <span ref={yawRef}>YAW: 0°</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Flight Speed and Camera Control */}
        <div className="flex flex-col gap-0.5 sm:gap-1 bg-black/50 backdrop-blur-md p-2.5 sm:p-4 rounded-lg border border-zinc-800/40 text-right text-[9px] sm:text-xs">
          <div className="text-zinc-500 text-[7px] sm:text-xxs tracking-widest font-semibold opacity-75">VELOCIDADE & CAM</div>
          <div className="flex items-center gap-2 sm:gap-4 justify-end mt-0.5">
            {/* Blinking Recording Dot */}
            <div className="flex items-center gap-1 sm:gap-1.5 mr-1 sm:mr-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              <span className="text-red-500 font-bold text-[8px] sm:text-xxs uppercase tracking-wide">REC</span>
            </div>
            
            <span ref={hSpeedRef} className="font-bold text-zinc-100 text-sm sm:text-lg">0.0 km/h</span>
          </div>
          <div className="text-[8px] sm:text-xxs text-zinc-400 mt-0.5">
            4K @ 30FPS | ISO 100 | EV -0.3 | F/1.7
          </div>
        </div>

      </div>

    </div>
  );
}
