"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-body text-sm font-semibold px-5 py-2.5 rounded-xl bg-teal text-cream hover:bg-teal-dark transition-colors print:hidden"
    >
      Print Receipt
    </button>
  );
}
