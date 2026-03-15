import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { type Referral } from "@/lib/db/types";
import { ApplyCreditButton } from "./ApplyCreditButton";
import { AdminCreateReferralForm } from "./AdminCreateReferralForm";

export const metadata: Metadata = { title: "Referrals | Admin" };

export default async function AdminReferralsPage() {
  const admin = createAdminClient();

  const [{ data: referrals }, { data: clients }] = await Promise.all([
    admin
      .from("referrals")
      .select("*, referrer:referrer_id(name, email), referred:referred_id(name, email)")
      .order("created_at", { ascending: false }),
    admin.from("clients").select("id, name, email").order("name"),
  ]);

  const pending = referrals?.filter((r) => r.status === "pending") ?? [];
  const credited = referrals?.filter((r) => r.status === "credited") ?? [];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Referral program</p>
        <h1 className="font-display text-3xl font-bold text-forest">Referrals</h1>
      </div>

      {/* Manual referral creation */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-8">
        <h2 className="font-display text-base font-bold text-forest mb-1">Create Referral Manually</h2>
        <p className="font-body text-xs text-forest/45 mb-4">Use when a client referred someone verbally and forgot to use their code.</p>
        <AdminCreateReferralForm clients={clients ?? []} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
          <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-2">Pending</p>
          <p className="font-display text-3xl font-bold text-gold-dark">{pending.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
          <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-2">Credited</p>
          <p className="font-display text-3xl font-bold text-teal">{credited.length}</p>
        </div>
      </div>

      {/* Pending referrals */}
      {pending.length > 0 && (
        <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-forest/[0.06] flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-forest">Pending</h2>
            <span className="font-body text-xs bg-gold/15 text-gold-dark border border-gold/20 px-2 py-0.5 rounded-full font-semibold">
              {pending.length} to review
            </span>
          </div>
          <div className="divide-y divide-forest/[0.05]">
            {pending.map((r) => {
              const referrer = r.referrer as { name?: string; email?: string } | null;
              const referred = r.referred as { name?: string; email?: string } | null;
              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-forest">
                      {referrer?.name || referrer?.email} → {referred?.name || referred?.email}
                    </p>
                    <p className="font-body text-xs text-forest/40 mt-0.5">
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <ApplyCreditButton referralId={r.id} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Credited referrals */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        <div className="px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">Credited</h2>
        </div>
        {!credited.length ? (
          <p className="px-6 py-8 font-body text-sm text-forest/40">No credited referrals yet.</p>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {credited.map((r) => {
              const referrer = r.referrer as { name?: string; email?: string } | null;
              const referred = r.referred as { name?: string; email?: string } | null;
              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-forest">
                      {referrer?.name || referrer?.email} → {referred?.name || referred?.email}
                    </p>
                    <p className="font-body text-xs text-forest/40 mt-0.5">
                      Credited {r.credited_at ? new Date(r.credited_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                    </p>
                  </div>
                  <span className="font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-teal/10 text-teal border-teal/20">
                    Credited
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
