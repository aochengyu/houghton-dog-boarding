import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-body font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest disabled:opacity-40 disabled:pointer-events-none rounded-lg";

    const variants = {
      primary:
        "bg-terra text-white hover:bg-terra-dark shadow-[0_1px_2px_rgba(26,58,42,0.12)] hover:shadow-[0_4px_16px_rgba(196,105,58,0.35)] active:scale-[0.98]",
      secondary:
        "bg-forest text-cream hover:bg-forest-700 shadow-[0_1px_2px_rgba(26,58,42,0.18)] hover:shadow-[0_4px_16px_rgba(26,58,42,0.3)] active:scale-[0.98]",
      outline:
        "border border-forest/25 text-forest hover:border-forest hover:bg-forest/5 active:scale-[0.98]",
      ghost: "text-forest hover:bg-forest/8",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-sm px-5 py-2.5",
      lg: "text-base px-7 py-3.5",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
