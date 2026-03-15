"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[account error]", error);
  }, [error]);

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-8 text-center">
        <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={18} className="text-rose-dark" />
        </div>
        <h2 className="font-display text-xl font-bold text-forest mb-2">Page error</h2>
        <p className="font-body text-sm text-forest/55 mb-5 leading-relaxed">
          Something went wrong loading this section.
          {error.digest && (
            <span className="block mt-1.5 font-mono text-xs text-forest/30">
              {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors"
          >
            <RefreshCw size={13} /> Try again
          </button>
          <Link
            href="/account/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-white border border-forest/15 text-forest font-body font-semibold text-sm rounded-xl px-4 py-2.5 hover:border-teal/30 hover:text-teal transition-colors"
          >
            <ArrowLeft size={13} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
