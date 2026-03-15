"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/Toast";

export function ReferralCodeCopy({ code, url }: { code: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const { success: toastSuccess } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toastSuccess("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="bg-teal/5 border border-teal/15 rounded-xl px-4 py-2.5 flex-1 min-w-0">
          <p className="font-body text-xs text-forest/40 mb-0.5">Your code</p>
          <p className="font-display text-lg font-bold text-teal tracking-widest">{code}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-4 py-3 hover:bg-teal-dark transition-all duration-200 flex-shrink-0 active:scale-95"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      <p className="font-body text-xs text-forest/30 break-all">{url}</p>
    </div>
  );
}
