"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Focus confirm button when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => confirmRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open && !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className={`fixed inset-0 z-50 bg-forest/30 backdrop-blur-sm transition-opacity duration-200
          ${visible ? "opacity-100" : "opacity-0"}`}
      />

      {/* Dialog */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}
      >
        <div
          className={`bg-white rounded-2xl shadow-xl border border-forest/[0.07] p-6 max-w-sm w-full pointer-events-auto
            transition-all duration-250 ease-out
            ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              danger ? "bg-rose/10 text-rose-dark" : "bg-gold/15 text-gold-dark"
            }`}>
              <AlertTriangle size={16} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-forest">{title}</h3>
              <p className="font-body text-sm text-forest/55 mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl font-body text-sm text-forest/60 hover:text-forest hover:bg-forest/5 transition-all duration-150"
            >
              {cancelLabel}
            </button>
            <button
              ref={confirmRef}
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl font-body text-sm font-semibold transition-all duration-150 active:scale-95
                ${danger
                  ? "bg-rose text-cream hover:bg-rose-dark"
                  : "bg-teal text-cream hover:bg-teal-dark"
                }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
