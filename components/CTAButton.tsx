import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
}

export function CTAButton({
  href,
  label,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn("inline-block", className)}
    >
      <Button variant={variant} size={size}>
        {label}
      </Button>
    </Link>
  );
}
