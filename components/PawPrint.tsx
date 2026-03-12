interface PawPrintProps {
  size?: number;
  className?: string;
  filled?: boolean;
}

/** Minimal geometric paw print. Use as accent, divider, or watermark. */
export function PawPrint({ size = 24, className, filled = true }: PawPrintProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {filled ? (
        <>
          <ellipse cx="16" cy="22.5" rx="6.5" ry="5" fill="currentColor" />
          <circle cx="7.5"  cy="14.5" r="2.8" fill="currentColor" />
          <circle cx="12.5" cy="11"   r="3"   fill="currentColor" />
          <circle cx="19.5" cy="11"   r="3"   fill="currentColor" />
          <circle cx="24.5" cy="14.5" r="2.8" fill="currentColor" />
        </>
      ) : (
        <>
          <ellipse cx="16" cy="22.5" rx="6.5" ry="5"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7.5"  cy="14.5" r="2.8"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12.5" cy="11"   r="3"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="19.5" cy="11"   r="3"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="24.5" cy="14.5" r="2.8"
            fill="none" stroke="currentColor" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}
