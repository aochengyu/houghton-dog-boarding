"use client";

import { useState } from "react";
import { applyReferralCredit } from "@/app/actions/referrals";
import { CheckCircle } from "lucide-react";

export function ApplyCreditButton({ referralId }: { referralId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    setLoading(true);
    const result = await applyReferralCredit(referralId);
    if (result?.error) {
      setError(result.error);
    } else {
      setDone(true);
    }
    setLoading(false);
  };

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 font-body text-xs text-teal font-semibold">
        <CheckCircle size={13} /> Applied!
      </span>
    );
  }

  return (
    <div>
      {error && <p className="font-body text-xs text-rose-dark mb-1">{error}</p>}
      <button
        onClick={handleApply}
        disabled={loading}
        className="font-body text-xs font-semibold bg-teal/10 text-teal hover:bg-teal/20 border border-teal/20 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
      >
        {loading ? "Applying…" : "Apply $20 Credit"}
      </button>
    </div>
  );
}
