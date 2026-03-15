import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCents, type Client } from "@/lib/db/types";
import { Copy, Gift, Users } from "lucide-react";
import { ReferralCodeCopy } from "./ReferralCodeCopy";

export const metadata: Metadata = { title: "Referrals | My Account" };

export default async function ReferralsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", user.id)
    .single() as { data: Client | null };

  // Fetch referrals where this client is the referrer
  const { data: referrals } = await supabase
    .from("referrals")
    .select("*, referred:referred_id(name, email)")
    .eq("referrer_id", user.id)
    .order("created_at", { ascending: false });

  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://pawsandpetals.com"}/account/login?ref=${client?.referral_code}`;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Share the love</p>
        <h1 className="font-display text-3xl font-bold text-forest">Referrals</h1>
      </div>

      {/* Credits balance */}
      <div className="bg-teal rounded-2xl p-6 mb-6 text-cream">
        <div className="flex items-center gap-3 mb-2">
          <Gift size={18} className="text-cream/70" />
          <span className="font-body text-xs uppercase tracking-widest text-cream/70 font-semibold">Available credits</span>
        </div>
        <p className="font-display text-4xl font-bold">{formatCents(client?.referral_credits ?? 0)}</p>
        <p className="font-body text-xs text-cream/60 mt-1">Applied automatically to your next booking</p>
      </div>

      {/* Referral code */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-6">
        <h2 className="font-display text-base font-bold text-forest mb-4">Your referral code</h2>
        <p className="font-body text-sm text-forest/60 mb-4">
          Share your link — when a friend signs up and completes their first booking, you both get <strong className="text-teal">$20 off</strong>.
        </p>
        <ReferralCodeCopy code={client?.referral_code ?? ""} url={referralUrl} />
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-6">
        <h2 className="font-display text-base font-bold text-forest mb-5">How it works</h2>
        <div className="space-y-4">
          {[
            { step: "1", title: "Share your link", desc: "Send your unique referral link to a friend." },
            { step: "2", title: "Friend signs up", desc: "They create an account using your link and complete their first booking." },
            { step: "3", title: "Both get $20 off", desc: "We apply $20 credit to both of your accounts automatically." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-7 h-7 rounded-full bg-teal/10 text-teal font-display font-bold text-sm flex items-center justify-center flex-shrink-0">
                {step}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-forest">{title}</p>
                <p className="font-body text-xs text-forest/45">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral list */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-forest/[0.06]">
          <Users size={14} className="text-teal/60" />
          <h2 className="font-display text-base font-bold text-forest">Your referrals</h2>
        </div>
        {!referrals?.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-body text-sm text-forest/40">No referrals yet. Start sharing your link!</p>
          </div>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {referrals.map((r) => {
              const referred = r.referred as { name?: string; email?: string } | null;
              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-sm font-semibold text-forest">
                      {referred?.name || referred?.email || "Unknown"}
                    </p>
                    <p className="font-body text-xs text-forest/40 mt-0.5">
                      {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    r.status === "credited"
                      ? "bg-teal/10 text-teal border-teal/20"
                      : "bg-gold/15 text-gold-dark border-gold/20"
                  }`}>
                    {r.status === "credited" ? "Credited" : "Pending"}
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
