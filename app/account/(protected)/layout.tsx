import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSidebar } from "./AccountSidebar";
import { WaiverGate } from "./WaiverGate";
import { ToastProvider } from "@/components/Toast";
import Link from "next/link";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: client } = await supabase
    .from("clients")
    .select("name, email, referral_credits, waiver_signed_at")
    .eq("id", user.id)
    .single();

  const firstName = client?.name?.split(" ")[0] || client?.email?.split("@")[0] || "there";

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "#f5f0eb" }}>
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-forest/[0.06] px-4 lg:px-8 h-14 flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-teal rounded-lg flex items-center justify-center">
              <span className="text-cream text-[11px] font-bold font-display">P</span>
            </div>
            <span className="font-display text-sm font-semibold text-forest group-hover:text-teal transition-colors">
              Paws and Petals
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {(client?.referral_credits ?? 0) > 0 && (
              <Link
                href="/account/referrals"
                className="font-body text-xs bg-rose/10 text-rose-dark border border-rose/20 px-2.5 py-1 rounded-full font-semibold hover:bg-rose/20 transition-colors"
              >
                ${Math.floor((client?.referral_credits ?? 0) / 100)} credit
              </Link>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal/15 flex items-center justify-center">
                <span className="font-display text-xs font-bold text-teal">
                  {firstName[0]?.toUpperCase()}
                </span>
              </div>
              <span className="font-body text-xs text-forest/55 hidden sm:block">{firstName}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <AccountSidebar />
          <main className="flex-1 overflow-auto p-6 lg:p-10">
            <WaiverGate signed={!!client?.waiver_signed_at}>
              {children}
            </WaiverGate>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
