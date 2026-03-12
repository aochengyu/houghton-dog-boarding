import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface InfoCardProps {
  icon?: keyof typeof Icons;
  title: string;
  body: string;
  number?: string;
  className?: string;
}

export function InfoCard({ icon, title, body, number, className }: InfoCardProps) {
  const IconComponent = icon ? (Icons[icon] as React.ComponentType<LucideProps>) : null;

  return (
    <div
      className={cn(
        "group bg-white border border-forest/8 rounded-xl p-7",
        "hover:border-forest/20 hover:shadow-[0_8px_30px_rgba(26,58,42,0.08)] transition-all duration-300",
        className
      )}
    >
      {number && (
        <span className="font-display text-4xl font-bold text-forest/10 block mb-4 leading-none group-hover:text-terra/20 transition-colors duration-300">
          {number}
        </span>
      )}
      {!number && IconComponent && (
        <div className="w-10 h-10 rounded-lg bg-terra/8 flex items-center justify-center mb-5 group-hover:bg-terra/15 transition-colors duration-300">
          <IconComponent size={18} className="text-terra" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-forest mb-2 leading-snug">{title}</h3>
      <p className="font-body text-sm text-forest/55 leading-relaxed">{body}</p>
    </div>
  );
}
