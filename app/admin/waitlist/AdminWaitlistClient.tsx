"use client";

import { useTransition } from "react";
import { adminDeleteWaitlistEntry } from "@/app/actions/waitlist";
import { SERVICE_LABELS, type ServiceType } from "@/lib/db/types";

function formatDate(ds: string): string {
  const d = new Date(ds + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type WaitlistRow = {
  id: string;
  service: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  client: { name: string | null; email: string | null } | null;
};

function DeleteButton({ entryId }: { entryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => adminDeleteWaitlistEntry(entryId))}
      className="font-body text-[10px] font-semibold text-rose-dark hover:text-rose transition-colors disabled:opacity-50 px-2 py-1 rounded-lg hover:bg-rose/10"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}

export function AdminWaitlistClient({ entries }: { entries: WaitlistRow[] }) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-forest/[0.07] px-6 py-12 text-center">
        <p className="font-body text-sm text-forest/40">No waitlist entries.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
      <div className="divide-y divide-forest/[0.05]">
        {entries.map((entry) => (
          <div key={entry.id} className="px-6 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-body text-sm font-semibold text-forest">
                  {SERVICE_LABELS[entry.service as ServiceType] ?? entry.service}
                </p>
                <span className="font-body text-xs text-forest/45">
                  {formatDate(entry.start_date)}
                  {entry.end_date && ` – ${formatDate(entry.end_date)}`}
                </span>
              </div>
              <p className="font-body text-xs text-forest/55 mt-0.5">
                {entry.client?.name ?? "—"}
                {entry.client?.email && (
                  <span className="text-forest/35 ml-1.5">{entry.client.email}</span>
                )}
              </p>
              {entry.notes && (
                <p className="font-body text-xs text-forest/40 mt-1.5 bg-[#f5f0eb] rounded-lg px-3 py-2 max-w-lg">
                  {entry.notes}
                </p>
              )}
            </div>
            <DeleteButton entryId={entry.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
