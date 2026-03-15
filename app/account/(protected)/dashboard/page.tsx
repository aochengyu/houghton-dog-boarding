import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, CalendarDays, Heart, Gift } from "lucide-react";
import { STATUS_COLORS, STATUS_LABELS, SERVICE_LABELS, formatCents, type Booking } from "@/lib/db/types";

export const metadata: Metadata = { title: "Dashboard | My Account" };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const [{ data: client }, { data: pets }, { data: bookings }] = await Promise.all([
    supabase.from("clients").select("*").eq("id", user.id).single(),
    supabase.from("pets").select("id, name, species").eq("client_id", user.id),
    supabase.from("bookings").select("*").eq("client_id", user.id)
      .order("start_date", { ascending: false }).limit(5),
  ]);

  const upcomingCount = (bookings ?? []).filter(
    (b) => b.status === "confirmed" || b.status === "active"
  ).length;

  return (
    <div className="max-w-3xl">
      {/* Greeting */}
      <div className="mb-10">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-2">Welcome back</p>
        <h1 className="font-display text-3xl font-bold text-forest">
          {client?.name || "Pet Parent"} 👋
        </h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "My Pets",    value: pets?.length ?? 0,   icon: Heart,       href: "/account/pets" },
          { label: "Upcoming",   value: upcomingCount,        icon: CalendarDays, href: "/account/bookings" },
          { label: "Credits",    value: formatCents(client?.referral_credits ?? 0), icon: Gift, href: "/account/referrals" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-forest/[0.07] p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-xs uppercase tracking-widest text-forest/40">{label}</span>
              <Icon size={14} className="text-teal/50 group-hover:text-teal transition-colors" />
            </div>
            <p className="font-display text-2xl font-bold text-forest">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest/[0.06]">
          <h2 className="font-display text-base font-bold text-forest">Recent Bookings</h2>
          <Link href="/account/bookings" className="font-body text-xs text-teal hover:underline">
            View all
          </Link>
        </div>
        {!bookings?.length ? (
          <div className="px-6 py-10 text-center">
            <p className="font-body text-sm text-forest/40 mb-4">No bookings yet.</p>
            <Link
              href="/account/bookings"
              className="inline-flex items-center gap-1.5 font-body text-sm text-teal font-semibold hover:underline"
            >
              Request your first stay <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-forest/[0.05]">
            {(bookings as Booking[]).map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-body text-sm font-semibold text-forest">
                    {SERVICE_LABELS[b.service]}
                  </p>
                  <p className="font-body text-xs text-forest/45 mt-0.5">
                    {new Date(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {b.end_date && ` – ${new Date(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                  </p>
                </div>
                <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[b.status]}`}>
                  {STATUS_LABELS[b.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/pets/new"
          className="flex items-center gap-3 bg-teal/5 border border-teal/15 rounded-2xl px-5 py-4 hover:bg-teal/10 transition-colors group"
        >
          <Heart size={16} className="text-teal flex-shrink-0" />
          <div>
            <p className="font-body text-sm font-semibold text-forest">Add a pet</p>
            <p className="font-body text-xs text-forest/45">Add your dog or cat profile</p>
          </div>
          <ArrowRight size={13} className="text-teal ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/account/bookings"
          className="flex items-center gap-3 bg-teal/5 border border-teal/15 rounded-2xl px-5 py-4 hover:bg-teal/10 transition-colors group"
        >
          <CalendarDays size={16} className="text-teal flex-shrink-0" />
          <div>
            <p className="font-body text-sm font-semibold text-forest">Request a stay</p>
            <p className="font-body text-xs text-forest/45">Book boarding, day care, or walks</p>
          </div>
          <ArrowRight size={13} className="text-teal ml-auto group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
