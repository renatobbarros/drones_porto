'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Colors
const C = {
  body:   '#dde4ee',
  dark:   '#293548',
  motor:  '#141e2e',
  blade:  '#4b5563',
  tip:    '#f59e0b',
  lens:   '#01050e',
  ledR:   '#ef4444',
  ledG:   '#22c55e',
};

// ─── Propeller ─────────────────────────────────────────────────────────────
function Propeller({ speedRef, ccw }) {
  const spin = useRef();
  const blur = useRef();

  useFrame((_, dt) => {
    if (!spin.current) return;
    const rpm = 22 + (speedRef?.current ?? 0) * 110;
    spin.current.rotation.y += (ccw ? -1 : 1) * rpm * dt;
    if (blur.current) blur.current.material.opacity = Math.min(0.78, rpm / 90);
  });

  return (
    <group>
      {/* Motion blur disc */}
      <mesh ref={blur} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.01, 0.37, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} color="#bbbbbb" />
      </mesh>
      {/* Hub + blades */}
      <group ref={spin}>
        <mesh><cylinderGeometry args={[0.015, 0.015, 0.01, 12]} /><meshStandardMaterial color={C.dark} /></mesh>
        {[0, Math.PI].map((rot, i) => (
          <group key={i} rotation={[0, rot, 0]}>
            <mesh position={[0, 0.005, 0.18]} rotation={[0.04, 0, 0]}>
              <boxGeometry args={[0.025, 0.003, 0.35]} />
              <meshStandardMaterial color={C.blade} roughness={0.55} transparent />
            </mesh>
            <mesh position={[0, 0.005, 0.36]}>
              <boxGeometry args={[0.027, 0.003, 0.013]} />
              <meshBasicMaterial color={C.tip} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// ─── One arm (pivot + rod + motor + prop) ─────────────────────────────────
function ArmAssembly({ pivotPos, pivotRotY, ccw, frontLed, armRef, speedRef }) {
  return (
    <group ref={armRef} position={pivotPos} rotation={[0, pivotRotY, 0]}>
      {/* Hinge */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.09, 14]} />
        <meshStandardMaterial color={C.dark} roughness={0.6} />
      </mesh>
      {/* Rod */}
      <mesh position={[0, 0.01, 0.38]}>
        <boxGeometry args={[0.048, 0.042, 0.66]} />
        <meshStandardMaterial color={C.body} roughness={0.38} />
      </mesh>
      {/* Motor */}
      <group position={[0, 0.044, 0.72]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.046, 0.046, 0.08, 16]} />
          <meshStandardMaterial color={C.motor} metalness={0.75} roughness={0.28} />
        </mesh>
        {/* LED */}
        <mesh position={[0, -0.044, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={frontLed ? C.ledR : C.ledG} />
        </mesh>
        {/* Propeller */}
        <group position={[0, 0.043, 0]}>
          <Propeller speedRef={speedRef} ccw={ccw} />
        </group>
      </group>
    </group>
  );
}

// ─── Main Drone Model ──────────────────────────────────────────────────────
export default function DroneModel({ speedRef }) {
  const hoverRef = useRef();
  const gimbalRef = useRef();
  const camBodyRef = useRef();

  // Arm refs for GSAP animation
  const flRef = useRef(); // Front-Left
  const frRef = useRef(); // Front-Right
  const rlRef = useRef(); // Rear-Left
  const rrRef = useRef(); // Rear-Right

  // Arm unfolding on mount
  useEffect(() => {
    const delay = 0.25;
    const ease  = 'back.out(1.1)';

    // Front arms: start folded (pointing back), open outward
    const animateArm = (ref, targetY, foldY, dur = 1.7) => {
      if (!ref.current) return;
      ref.current.rotation.y = foldY;
      gsap.to(ref.current.rotation, { y: targetY, duration: dur, ease, delay });
    };

    animateArm(flRef, -0.82, 0.05);
    animateArm(frRef,  0.82, -0.05);
    animateArm(rlRef, -2.28, -0.18, 1.9);
    animateArm(rrRef,  2.28,  0.18, 1.9);
  }, []);

  // Hover + gimbal tracking
  useFrame((state) => {
    if (!hoverRef.current) return;
    const t = state.clock.getElapsedTime();
    hoverRef.current.position.y = Math.sin(t * 1.75) * 0.068;
    hoverRef.current.rotation.x = Math.sin(t * 1.1) * 0.012;
    hoverRef.current.rotation.z = Math.cos(t * 0.85) * 0.009;

    if (gimbalRef.current && camBodyRef.current) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      gimbalRef.current.rotation.y = THREE.MathUtils.lerp(
        gimbalRef.current.rotation.y, px * 0.38, 0.07,
      );
      camBodyRef.current.rotation.x = THREE.MathUtils.lerp(
        camBodyRef.current.rotation.x, -0.14 + py * 0.22, 0.07,
      );
    }
  });

  return (
    <group ref={hoverRef}>

      {/* ── BODY ── */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.30, 0.14, 0.66]} />
        <meshStandardMaterial color={C.body} roughness={0.32} metalness={0.07} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.06, 0.38]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.23, 0.11, 0.22]} />
        <meshStandardMaterial color={C.body} roughness={0.35} />
      </mesh>
      {/* Tail/battery */}
      <mesh position={[0, 0.08, -0.36]} castShadow>
        <boxGeometry args={[0.26, 0.11, 0.2]} />
        <meshStandardMaterial color={C.body} roughness={0.44} />
      </mesh>
      {/* Bottom chassis */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.27, 0.036, 0.62]} />
        <meshStandardMaterial color={C.dark} roughness={0.62} metalness={0.22} />
      </mesh>

      {/* Status LEDs */}
      {[-0.04, 0.04].map((x, i) => (
        <mesh key={i} position={[x, 0.15, -0.35]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color={C.ledG} />
        </mesh>
      ))}

      {/* Front obstacle sensors */}
      {[-0.08, 0.08].map((x, i) => (
        <group key={i} position={[x, 0.11, 0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.016, 14]} />
            <meshStandardMaterial color={C.dark} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.009, 0]}>
            <cylinderGeometry args={[0.017, 0.017, 0.003, 14]} />
            <meshBasicMaterial color={C.lens} />
          </mesh>
        </group>
      ))}

      {/* ── GIMBAL + CAMERA ── */}
      <group position={[0, -0.025, 0.37]}>
        <group ref={gimbalRef}>
          <mesh position={[0, -0.038, 0]}>
            <boxGeometry args={[0.044, 0.07, 0.044]} />
            <meshStandardMaterial color={C.dark} roughness={0.52} />
          </mesh>
          <group ref={camBodyRef} position={[0, -0.068, 0.016]}>
            {/* Camera sphere */}
            <mesh castShadow>
              <sphereGeometry args={[0.07, 24, 24]} />
              <meshStandardMaterial color={C.body} roughness={0.26} metalness={0.16} />
            </mesh>
            {/* Gold lens ring */}
            <mesh position={[0, 0, 0.063]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.038, 0.005, 8, 24]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.07} metalness={0.95} />
            </mesh>
            {/* Lens glass */}
            <mesh position={[0, 0, 0.066]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.036, 0.036, 0.004, 24]} />
              <meshStandardMaterial color={C.lens} roughness={0} metalness={0.95} transparent opacity={0.92} />
            </mesh>
            {/* Rec dot */}
            <mesh position={[0.018, 0.018, 0.067]}>
              <sphereGeometry args={[0.0038, 8, 8]} />
              <meshBasicMaterial color={C.ledR} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── ARMS (individually referenced for GSAP) ── */}
      <ArmAssembly armRef={flRef} pivotPos={[-0.13, 0.034, 0.2]}  pivotRotY={-0.82} frontLed ccw={false} speedRef={speedRef} />
      <ArmAssembly armRef={frRef} pivotPos={[ 0.13, 0.034, 0.2]}  pivotRotY={ 0.82} frontLed ccw speedRef={speedRef} />
      <ArmAssembly armRef={rlRef} pivotPos={[-0.10, 0.02,  -0.22]} pivotRotY={-2.28} frontLed={false} ccw speedRef={speedRef} />
      <ArmAssembly armRef={rrRef} pivotPos={[ 0.10, 0.02,  -0.22]} pivotRotY={ 2.28} frontLed={false} ccw={false} speedRef={speedRef} />

    </group>
  );
}
