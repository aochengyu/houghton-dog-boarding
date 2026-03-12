import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface InfoCardProps {
  icon?: keyof typeof Icons;
  title: string;
  body: string;
  className?: string;
}

export function InfoCard({ icon, title, body, className }: InfoCardProps) {
  const IconComponent = icon ? (Icons[icon] as React.ComponentType<LucideProps>) : null;

  return (
    <div
      className={cn(
        "group bg-white rounded-3xl p-8 shadow-card border border-forest/5",
        "hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Left border accent that appears on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-terra transition-all duration-300 rounded-l-3xl" />

      {IconComponent && (
        <div className="w-12 h-12 bg-cream-200 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-terra transition-all duration-300">
          <IconComponent size={22} className="text-terra group-hover:text-white transition-colors duration-300" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-forest mb-2">{title}</h3>
      <p className="font-body text-forest/60 leading-relaxed">{body}</p>
    </div>
  );
}
