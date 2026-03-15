"use client";

import { useEffect } from "react";

// Cal.com embed button — loads the Cal.com embed script once and renders
// a button that opens the scheduling overlay when clicked.
// Set your Cal.com username/link in the NEXT_PUBLIC_CAL_LINK env var,
// e.g. "janehoughton/meet-greet" — defaults to a placeholder.

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? "me/meet-greet";

interface CalButtonProps {
  label?: string;
  className?: string;
}

export function CalButton({ label = "Schedule a Meet & Greet", className }: CalButtonProps) {
  useEffect(() => {
    // Only inject once
    if (document.getElementById("cal-embed-script")) return;
    const script = document.createElement("script");
    script.id = "cal-embed-script";
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error — Cal is a global injected by the embed script
      if (typeof Cal !== "undefined") {
        // @ts-expect-error
        Cal("init", { origin: "https://cal.com" });
      }
    };
    document.head.appendChild(script);
  }, []);

  return (
    <button
      type="button"
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
      className={className}
    >
      {label}
    </button>
  );
}
