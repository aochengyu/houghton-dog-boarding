"use client";

/**
 * SuccessCheckmark — animated SVG: circle draws in, then checkmark strokes in.
 * Uses stroke-dashoffset technique for the path-draw effect.
 */
export function SuccessCheckmark({
  size = 52,
  color = "currentColor",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  // circle circumference = 2π × 23 ≈ 144.5
  // check path length ≈ 38 (measured for path "M14 26 L22 34 L38 18")
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="26"
        cy="26"
        r="23"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="145"
        strokeDashoffset="145"
        style={{
          animation: "draw-circle 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards",
        }}
      />
      <path
        d="M14 26 L22 34 L38 18"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="38"
        strokeDashoffset="38"
        style={{
          animation: "draw-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards",
        }}
      />
    </svg>
  );
}
