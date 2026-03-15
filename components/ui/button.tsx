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
        "btn-shimmer bg-rose text-white hover:bg-rose-dark shadow-[0_1px_2px_rgba(21,77,84,0.12)] hover:shadow-[0_4px_16px_rgba(192,146,146,0.35)] active:scale-[0.98]",
      secondary:
        "btn-shimmer bg-teal text-cream hover:bg-teal-dark shadow-[0_1px_2px_rgba(21,77,84,0.18)] hover:shadow-[0_4px_16px_rgba(21,77,84,0.3)] active:scale-[0.98]",
      outline:
        "border border-teal/25 text-teal hover:border-teal hover:bg-teal/5 active:scale-[0.98]",
      ghost: "text-teal hover:bg-teal/10",
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
