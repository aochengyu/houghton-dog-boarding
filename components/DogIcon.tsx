interface DogIconProps {
  size?: number;
  className?: string;
  /** "mono" = stroke-only line art of a sitting dog; "mark" = solid badge mark */
  variant?: "mono" | "mark";
}

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
        <rect width="32" height="32" rx="8" fill="#1a3a2a" />
        {/* Ears */}
        <rect x="3" y="4" width="10" height="16" rx="5" fill="#b89870" />
        <rect x="19" y="4" width="10" height="16" rx="5" fill="#b89870" />
        {/* Head */}
        <circle cx="16" cy="18" r="11" fill="#f5deb8" />
        {/* Muzzle */}
        <ellipse cx="16" cy="22" rx="6.5" ry="4.5" fill="#faecd4" />
        {/* Eyes */}
        <circle cx="12" cy="16" r="2.8" fill="#3d2c1a" />
        <circle cx="20" cy="16" r="2.8" fill="#3d2c1a" />
        <circle cx="12.8" cy="15.2" r="1" fill="white" opacity="0.6" />
        <circle cx="20.8" cy="15.2" r="1" fill="white" opacity="0.6" />
        {/* Nose */}
        <ellipse cx="16" cy="20.5" rx="2.2" ry="1.5" fill="#c4693a" />
      </svg>
    );
  }

  // Mono: stroke-only full sitting dog — elegant line art for large decorative use
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
        d="M24 15 C15 11 13 25 16 32 C17 36 22 37 26 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right floppy ear */}
      <path
        d="M40 15 C49 11 51 25 48 32 C47 36 42 37 38 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Head */}
      <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="28" cy="18" r="1.8" fill="currentColor" />
      <circle cx="36" cy="18" r="1.8" fill="currentColor" />
      {/* Nose — sole terracotta accent */}
      <ellipse cx="32" cy="23.5" rx="3.5" ry="2.5" fill="#c4693a" />
      {/* Neck */}
      <path
        d="M25 30 C23 35 22 38 22 42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M39 30 C41 35 42 38 42 42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx="32" cy="48" rx="12" ry="10" stroke="currentColor" strokeWidth="2" />
      {/* Front paws */}
      <path
        d="M26 56 C25 59 24 61 24 63"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38 56 C39 59 40 61 40 63"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tail — curving up from right side of body */}
      <path
        d="M44 44 C50 40 54 34 50 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
