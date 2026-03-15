"use client";

/**
 * PawLoader — sequential paw-stamp loading animation.
 *
 * size="sm"  inline button use (16px, single bouncing paw)
 * size="md"  form-level loading (3 walking paws, ~72px wide)
 * size="lg"  page-level loading (4 walking paws, ~120px wide)
 */

function PawSVG({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Main pad */}
      <ellipse cx="12" cy="17" rx="6" ry="4.5" />
      {/* Toe beans */}
      <ellipse cx="5"  cy="11" rx="3"   ry="2.5" />
      <ellipse cx="10" cy="8"  rx="2.8" ry="2.4" />
      <ellipse cx="15" cy="8"  rx="2.8" ry="2.4" />
      <ellipse cx="19" cy="11" rx="3"   ry="2.5" />
    </svg>
  );
}

export function PawLoader({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center justify-center text-current ${className}`}
        aria-label="Loading"
        style={{ width: 16, height: 16 }}
      >
        <span className="animate-[paw-bounce_0.9s_ease-in-out_infinite]">
          <PawSVG size={16} />
        </span>
      </span>
    );
  }

  const pawSize  = size === "lg" ? 22 : 18;
  const count    = size === "lg" ? 4 : 3;
  const stagger  = 0.4; // seconds between each paw stamp
  const duration = stagger * count + 0.6; // total cycle length

  return (
    <span
      className={`inline-flex items-end gap-2 ${className}`}
      aria-label="Loading"
      style={{ height: pawSize }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            // Even paws lean left, odd paws lean right — like a walking gait
            animation: `paw-stamp ${duration}s ease-in-out ${i * stagger}s infinite`,
            transformOrigin: "center bottom",
            // Alternate paw tilt for left/right footfalls
            transform: i % 2 === 0 ? "rotate(-8deg)" : "rotate(8deg)",
            opacity: 0,
          }}
        >
          <PawSVG size={pawSize} />
        </span>
      ))}
    </span>
  );
}
