"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; swap for a real error service in production
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-forest/[0.07] shadow-card p-8 text-center">
        <div className="w-12 h-12 bg-rose/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-rose-dark" />
        </div>
        <h1 className="font-display text-2xl font-bold text-forest mb-2">Something went wrong</h1>
        <p className="font-body text-sm text-forest/55 mb-6 leading-relaxed">
          An unexpected error occurred. You can try refreshing the page, or head back home.
          {error.digest && (
            <span className="block mt-2 font-mono text-xs text-forest/30">
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-5 py-2.5 hover:bg-teal-dark transition-colors"
          >
            <RefreshCw size={14} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-forest/15 text-forest font-body font-semibold text-sm rounded-xl px-5 py-2.5 hover:border-teal/30 hover:text-teal transition-colors"
          >
            <Home size={14} /> Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
