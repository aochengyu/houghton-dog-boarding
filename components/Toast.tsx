"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { XCircle, AlertCircle, X, Info } from "lucide-react";
import { SuccessCheckmark } from "./SuccessCheckmark";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const CONFIG: Record<ToastType, { icon: React.ElementType; bg: string; border: string; text: string; bar: string }> = {
  success: { icon: Info,         bg: "bg-teal/10",  border: "border-teal/25",  text: "text-teal",        bar: "bg-teal" },
  error:   { icon: XCircle,      bg: "bg-rose/10",  border: "border-rose/25",  text: "text-rose-dark",   bar: "bg-rose" },
  info:    { icon: Info,         bg: "bg-forest/5", border: "border-forest/15",text: "text-forest/70",   bar: "bg-forest/40" },
  warning: { icon: AlertCircle,  bg: "bg-gold/10",  border: "border-gold/25",  text: "text-gold-dark",   bar: "bg-gold" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = CONFIG[toast.type];
  const Icon = cfg.icon;
  const dur = toast.duration ?? 4000;

  useEffect(() => {
    // enter
    const t1 = setTimeout(() => setVisible(true), 10);
    // auto-dismiss
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 350);
    }, dur);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [toast.id, dur, onDismiss]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 350);
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 px-4 py-3.5 rounded-2xl border shadow-lg
        font-body text-sm max-w-sm w-full overflow-hidden
        backdrop-blur-sm bg-white
        transition-all duration-350 ease-out
        ${cfg.border}
        ${visible && !leaving
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95"
        }
      `}
    >
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] ${cfg.bar} rounded-full`}
        style={{
          animation: `shrink ${dur}ms linear forwards`,
        }}
      />

      <span className={`flex-shrink-0 ${cfg.text}`}>
        {toast.type === "success"
          ? <SuccessCheckmark size={20} color="currentColor" />
          : <Icon size={15} className="mt-0.5" />
        }
      </span>
      <p className={`flex-1 leading-snug ${cfg.text}`}>{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-forest/25 hover:text-forest/60 transition-colors mt-0.5"
      >
        <X size={13} />
      </button>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info", duration?: number) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const error   = useCallback((msg: string) => toast(msg, "error"),   [toast]);
  const info    = useCallback((msg: string) => toast(msg, "info"),     [toast]);
  const warning = useCallback((msg: string) => toast(msg, "warning"),  [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {/* Toast stack — top-right */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
