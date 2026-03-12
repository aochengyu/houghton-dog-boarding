interface DogIconProps {
  size?: number;
  className?: string;
  /** "mono" = stroke-only line art; "mark" = solid favicon-style mark */
  variant?: "mono" | "mark";
}

/**
 * Artistic dog icon.
 *
 * mono  — monoline stroke art, scales beautifully at 32px+, transparent bg
 * mark  — solid filled mark on a forest green tile, like the favicon
 */
export function DogIcon({ size = 40, className, variant = "mono" }: DogIconProps) {
  if (variant === "mark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="7" fill="#1a3a2a" />
        <ellipse cx="10" cy="11.5" rx="4.5" ry="6" fill="#f0e8dc" transform="rotate(-15 10 11.5)" />
        <ellipse cx="22" cy="11.5" rx="4.5" ry="6" fill="#f0e8dc" transform="rotate(15 22 11.5)" />
        <ellipse cx="16" cy="19.5" rx="9" ry="8.5" fill="#faf6f0" />
        <circle cx="12.8" cy="17.5" r="1.4" fill="#1a3a2a" />
        <circle cx="19.2" cy="17.5" r="1.4" fill="#1a3a2a" />
        <circle cx="13.3" cy="17" r="0.4" fill="white" />
        <circle cx="19.7" cy="17" r="0.4" fill="white" />
        <ellipse cx="16" cy="22" rx="3" ry="2.2" fill="#c4693a" />
      </svg>
    );
  }

  // Monoline stroke variant — single continuous-weight strokes, artistic
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Left floppy ear */}
      <path
        d="M21 25 Q12 20 13 35 Q14 44 22 43"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right floppy ear */}
      <path
        d="M43 25 Q52 20 51 35 Q50 44 42 43"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head — main oval */}
      <ellipse
        cx="32"
        cy="38"
        rx="15"
        ry="14"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Snout area — subtle raised muzzle */}
      <path
        d="M25 43 Q32 48 39 43"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left eye */}
      <circle cx="27" cy="35" r="2" fill="currentColor" />

      {/* Right eye */}
      <circle cx="37" cy="35" r="2" fill="currentColor" />

      {/* Nose — the one terracotta accent */}
      <ellipse cx="32" cy="41" rx="4" ry="3" fill="#c4693a" />

      {/* Tiny mouth */}
      <path
        d="M29.5 44.5 Q32 46.5 34.5 44.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
