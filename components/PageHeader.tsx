import { cn } from "@/lib/utils";

interface PageHeaderProps {
  h1: string;
  subtitle?: string;
  label?: string;
  className?: string;
}

export function PageHeader({ h1, subtitle, label, className }: PageHeaderProps) {
  return (
    <div className={cn("pt-16 pb-12 lg:pt-20 lg:pb-16", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {label && (
          <p className="font-body text-xs uppercase tracking-[0.15em] text-terra font-medium mb-4">
            {label}
          </p>
        )}
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest leading-[1.1] max-w-2xl">
          {h1}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base text-forest/55 max-w-xl font-body leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-6 w-10 h-px bg-terra" />
      </div>
    </div>
  );
}
