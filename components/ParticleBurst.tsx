"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  shape: "circle" | "paw" | "heart" | "square";
  delay: number;
}

const COLORS = [
  "#154D54", // teal
  "#C09292", // rose
  "#d4a853", // gold
  "#faf6f0", // cream
  "#2d6e55", // forest-500
  "#e8c77a", // gold-light
  "#d4b0b0", // rose-light
];

function PawShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="17" rx="6" ry="4.5" />
      <ellipse cx="5" cy="11" rx="3" ry="2.5" />
      <ellipse cx="10" cy="8" rx="2.8" ry="2.4" />
      <ellipse cx="15" cy="8" rx="2.8" ry="2.4" />
      <ellipse cx="19" cy="11" rx="3" ry="2.5" />
    </svg>
  );
}

function HeartShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function ParticleBurst({
  trigger,
  origin = "center",
  count = 24,
}: {
  /** Increment this to re-fire the burst */
  trigger: number;
  origin?: "center" | "top";
  count?: number;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const shapes: Particle["shape"][] = ["circle", "paw", "heart", "square", "circle", "circle"];
    const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 20, // % from left
      y: origin === "top" ? 15 : 50,
      angle: (360 / count) * i + (Math.random() - 0.5) * (360 / count),
      distance: 80 + Math.random() * 80,
      size: 6 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      delay: Math.random() * 0.15,
    }));

    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(t);
  }, [trigger, count, origin]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.distance;
        const ty = Math.sin(rad) * p.distance;

        return (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              color: p.color,
              animation: `particle-burst 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
              // CSS custom properties for the keyframe
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
            } as React.CSSProperties}
          >
            {p.shape === "circle"  && <div style={{ width: p.size, height: p.size, borderRadius: "50%", background: p.color }} />}
            {p.shape === "square"  && <div style={{ width: p.size * 0.8, height: p.size * 0.8, background: p.color, borderRadius: 2, transform: `rotate(${Math.random() * 45}deg)` }} />}
            {p.shape === "paw"     && <div style={{ color: p.color }}><PawShape size={p.size} /></div>}
            {p.shape === "heart"   && <div style={{ color: p.color }}><HeartShape size={p.size} /></div>}
          </div>
        );
      })}
    </div>
  );
}
