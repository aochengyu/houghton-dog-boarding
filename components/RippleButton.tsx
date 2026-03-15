"use client";

import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  rippleColor?: string;
}

/**
 * Drop-in replacement for <button> that adds a click-position ink ripple.
 * Pass all normal button props — className, onClick, disabled, etc.
 * The button needs `position: relative; overflow: hidden` on it (added automatically).
 */
export function RippleButton({
  children,
  className = "",
  rippleColor = "rgba(255,255,255,0.35)",
  onClick,
  disabled,
  ...props
}: RippleButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function spawnRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = btnRef.current;
    if (!btn || disabled) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${rippleColor};
      transform: scale(0) translate(-50%, -50%);
      pointer-events: none;
      animation: ripple-out 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      will-change: transform, opacity;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });

    onClick?.(e);
  }

  return (
    <button
      ref={btnRef}
      className={`relative overflow-hidden ${className}`}
      onClick={spawnRipple}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
