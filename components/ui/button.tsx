import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "relative overflow-hidden inline-flex items-center justify-center font-body font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-terra text-white hover:bg-terra-dark shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:skew-x-12",
      secondary:
        "bg-forest text-cream hover:bg-forest-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border-2 border-forest text-forest hover:bg-forest hover:text-cream",
      ghost: "text-forest hover:bg-forest-100",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-base px-6 py-3",
      lg: "text-lg px-8 py-4",
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
