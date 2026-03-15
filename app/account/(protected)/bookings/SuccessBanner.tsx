"use client";

import { useState } from "react";
import { ParticleBurst } from "@/components/ParticleBurst";

export function SuccessBanner({ message, variant = "teal" }: { message: string; variant?: "teal" | "gold" }) {
  // trigger=1 fires immediately on mount
  const [trigger] = useState(1);

  const colors = variant === "gold"
    ? "bg-gold/10 border-gold/20 text-gold-dark"
    : "bg-teal/10 border-teal/20 text-teal";

  return (
    <>
      <ParticleBurst trigger={trigger} origin="top" count={28} />
      <div className={`mb-6 px-4 py-3 rounded-xl border text-sm font-body flex items-center gap-2 animate-[bounce-in_0.4s_ease-out] ${colors}`}>
        <span className="text-base">🎉</span>
        {message}
      </div>
    </>
  );
}
