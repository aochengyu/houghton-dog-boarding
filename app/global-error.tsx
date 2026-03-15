"use client";

import { useEffect } from "react";

// global-error catches errors thrown by the root layout itself.
// It must include <html> and <body> since it replaces the layout.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#faf6f0", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ maxWidth: 400, textAlign: "center" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              A critical error occurred. Please try refreshing.
              {error.digest && (
                <span style={{ display: "block", marginTop: "0.5rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#999" }}>
                  {error.digest}
                </span>
              )}
            </p>
            <button
              onClick={reset}
              style={{ background: "#3d9e8c", color: "#fff", border: "none", borderRadius: "0.75rem", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
