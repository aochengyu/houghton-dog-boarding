"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  num: string;
  label: string;
}

interface StatsCounterProps {
  items: StatItem[];
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function parseStat(num: string): { prefix: string; value: number; suffix: string } | null {
  // Non-numeric cases: has dash (like "1–2") or starts with "<"
  if (num.includes("–") || num.includes("-") || num.startsWith("<")) {
    return null;
  }

  // Try to extract numeric value from strings like "$70", "100%"
  const match = num.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return null;

  return {
    prefix: match[1],
    value: parseFloat(match[2]),
    suffix: match[3],
  };
}

function AnimatedStat({ num, label, visible }: StatItem & { visible: boolean }) {
  const parsed = parseStat(num);
  const [displayValue, setDisplayValue] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!visible) return;
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (!parsed) {
      // Fade-in for non-numeric
      setFadeIn(true);
      return;
    }

    const duration = 1200;
    const targetValue = parsed.value;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      setDisplayValue(Math.round(easedProgress * targetValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visible, parsed]);

  if (!parsed) {
    // Non-numeric: fade in with upward translate
    return (
      <div
        className={`py-6 px-6 lg:px-10 first:pl-0 last:pr-0 transition-all duration-700 ease-out ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <p className="font-display text-2xl lg:text-3xl font-bold text-forest">{num}</p>
        <p className="font-body text-xs text-forest/40 mt-0.5 uppercase tracking-widest">{label}</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-6 lg:px-10 first:pl-0 last:pr-0">
      <p className="font-display text-2xl lg:text-3xl font-bold text-forest">
        {parsed.prefix}{displayValue}{parsed.suffix}
      </p>
      <p className="font-body text-xs text-forest/40 mt-0.5 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export function StatsCounter({ items }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-forest/8">
      {items.map((item) => (
        <AnimatedStat key={item.label} num={item.num} label={item.label} visible={visible} />
      ))}
    </div>
  );
}
