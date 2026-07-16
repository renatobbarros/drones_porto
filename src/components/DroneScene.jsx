'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import DroneModel from './DroneModel';

// ─── Stars (manual, no drei dependency) ────────────────────────────────────
function ManualStars() {
  const ref = useRef();
  const { geo, mat } = useMemo(() => {
    const count = 250;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 30;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: '#94a3b8', size: 0.18, sizeAttenuation: true, transparent: true, opacity: 0.5 });
    return { geo, mat };
  }, []);

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Space dust (imperative geometry) ──────────────────────────────────────
function SpaceDust({ speedRef }) {
  const ref = useRef();
  const { geo, mat } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: '#cbd5e1', size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0.28 });
    return { geo, mat };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const speed = speedRef?.current ?? 0;
    const move = delta * (0.35 + speed * 5);
    const arr = ref.current.geometry.attributes.position.array;
    const count = arr.length / 3;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += move;
      if (arr[i * 3 + 2] > 4) {
        arr[i * 3 + 2] = -10;
        arr[i * 3]     = (Math.random() - 0.5) * 14;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Dynamic fill light ────────────────────────────────────────────────────
function AccentLight({ progressRef }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const hex =
      p > 0.88 ? '#facc15' :
      p > 0.70 ? '#818cf8' :
      p > 0.45 ? '#2dd4bf' :
      p > 0.20 ? '#fb923c' : '#38bdf8';
    ref.current.color.lerp(new THREE.Color(hex), 0.04);
  });
  return <pointLight ref={ref} color="#38bdf8" position={[-5, 6, -2]} intensity={2.0} />;
}

// ─── Drone position/rotation controller ───────────────────────────────────
function DroneRig({ droneState, speedRef, progressRef }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    const s = droneState.current;
    const L = 0.12;
    const R = 0.10;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, s.x, L);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, s.y, L);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, s.z, L);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, s.rotX, R);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, s.rotY, R);
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, s.rotZ, R);
    speedRef.current = s.speed ?? 0;
    progressRef.current = s.progress ?? 0;
  });

  return (
    <group ref={ref}>
      <Suspense fallback={null}>
        <DroneModel speedRef={speedRef} />
      </Suspense>
    </group>
  );
}

// ─── All scene content (must live inside Canvas) ───────────────────────────
function Scene({ droneState, speedRef, progressRef }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[5, 12, 6]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight position={[4, -4, 4]} intensity={0.9} color="#ffffff" />
      <AccentLight progressRef={progressRef} />
      <SpaceDust speedRef={speedRef} />
      <ManualStars />
      <DroneRig droneState={droneState} speedRef={speedRef} progressRef={progressRef} />
    </>
  );
}

// ─── Exported wrapper ──────────────────────────────────────────────────────
export default function DroneScene({ droneState }) {
  const speedRef   = useRef(0);
  const progressRef = useRef(0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: -1,
        background: '#08090a',
      }}
    >
      {/* Subtle center glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(51,65,85,0.22) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#08090a'));
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Scene droneState={droneState} speedRef={speedRef} progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
