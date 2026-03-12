import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tinted?: boolean;
}

export function Section({ children, className, id, tinted }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 lg:py-24",
        tinted && "bg-cream-200",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
