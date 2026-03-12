import { cn } from "@/lib/utils";

interface PageHeaderProps {
  h1: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ h1, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("py-16 lg:py-20 text-center", className)}>
      <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest leading-tight text-balance animate-fade-up">
        {h1}
      </h1>
      {/* Animated decorative underline */}
      <div className="w-12 h-1 bg-terra rounded-full mx-auto mt-4 animate-fade-up delay-100" />
      {subtitle && (
        <p className="mt-4 text-lg text-forest/60 max-w-2xl mx-auto font-body text-balance animate-fade-up delay-100">
          {subtitle}
        </p>
      )}
    </div>
  );
}
