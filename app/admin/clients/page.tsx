import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCents, type Client } from "@/lib/db/types";
import { ArrowRight, Users } from "lucide-react";

export const metadata: Metadata = { title: "Clients | Admin" };

export default async function AdminClientsPage({ searchParams }: { searchParams: { q?: string } }) {
  const admin = createAdminClient();
  const q = searchParams.q?.trim() ?? "";

  let query = admin.from("clients").select("*").order("created_at", { ascending: false });
  if (q) query = query.ilike("name", `%${q}%`);

  const { data: clients } = await query;

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">All clients</p>
          <h1 className="font-display text-3xl font-bold text-forest">Clients</h1>
        </div>
        <div className="flex items-center gap-2 bg-white border border-forest/[0.07] rounded-xl px-4 py-2.5">
          <Users size={14} className="text-forest/30" />
          <span className="font-body text-sm text-forest">{clients?.length ?? 0}</span>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name…"
          className="w-full max-w-sm border border-forest/15 rounded-xl px-4 py-2.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30"
        />
      </form>

      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        {!clients?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-body text-sm text-forest/40">{q ? "No clients matching your search." : "No clients yet."}</p>
          </div>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {(clients as Client[]).map((c) => (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-cream/50 transition-colors group"
              >
                <div>
                  <p className="font-body text-sm font-semibold text-forest">{c.name || "—"}</p>
                  <p className="font-body text-xs text-forest/40 mt-0.5">{c.email}</p>
                  {c.phone && <p className="font-body text-xs text-forest/30">{c.phone}</p>}
                </div>
                <div className="flex items-center gap-4">
                  {c.referral_credits > 0 && (
                    <span className="font-body text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                      {formatCents(c.referral_credits)} credit
                    </span>
                  )}
                  <span className="font-body text-xs text-forest/30">
                    {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <ArrowRight size={13} className="text-teal/30 group-hover:text-teal transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
