"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign, TrendingUp, Users, PawPrint, Gift,
  Star, AlertCircle, ArrowRight, X, Search,
  ChevronLeft, ChevronRight, ExternalLink, Repeat2, Trophy,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BookingRow = {
  id: string;
  status: string;
  service: string;
  price_cents: number;
  credit_applied_cents: number;
  paid_at: string | null;
  payment_method: string | null;
  created_at: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  client: { name?: string; email: string } | null;
  pet: { name: string; species: string } | null;
};

type ClientRow = { id: string; name?: string; email: string; created_at: string; referral_credits: number };
type PetRow    = { id: string; species: string; created_at: string };
type ReferralRow = { id: string; status: string; created_at: string; credited_at: string | null };

export type Props = {
  bookings:  BookingRow[];
  clients:   ClientRow[];
  pets:      PetRow[];
  referrals: ReferralRow[];
};

type DrawerState = {
  title:      string;
  bookings:   BookingRow[];
  filterHref: string;
} | null;

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
type Period = 3 | 6 | 12;

const STATUS_CONFIG: Record<string, { label: string; bar: string; badge: string }> = {
  inquiry:   { label: "Inquiry",   bar: "bg-gold/60",    badge: "bg-gold/15 text-gold-dark border-gold/25" },
  confirmed: { label: "Confirmed", bar: "bg-teal/60",    badge: "bg-teal/10 text-teal border-teal/20" },
  active:    { label: "Active",    bar: "bg-teal",       badge: "bg-teal text-cream border-teal" },
  completed: { label: "Completed", bar: "bg-forest/40",  badge: "bg-forest/10 text-forest border-forest/20" },
  cancelled: { label: "Cancelled", bar: "bg-rose/50",    badge: "bg-rose/10 text-rose-dark border-rose/20" },
};

const SERVICE_CONFIG: Record<string, { label: string; bar: string; badge: string }> = {
  boarding:   { label: "Boarding",  bar: "bg-teal",      badge: "bg-teal/10 text-teal border-teal/20" },
  "day-care": { label: "Day Care",  bar: "bg-gold/70",   badge: "bg-gold/15 text-gold-dark border-gold/25" },
  walking:    { label: "Walking",   bar: "bg-forest/45", badge: "bg-forest/10 text-forest border-forest/20" },
  "drop-in":  { label: "Drop-In",  bar: "bg-terra/60",  badge: "bg-terra/10 text-terra border-terra/20" },
};

const PAGE_SIZE = 12;

// ─── Animated counter ─────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        setVal(Math.round(target * eased));
        if (elapsed < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return val;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, rawValue, prefix = "", suffix = "", sub,
  icon: Icon, accent, delay = 0, onClick, active = false,
}: {
  label: string; rawValue: number; prefix?: string; suffix?: string;
  sub?: string; icon: React.ElementType; accent: string;
  delay?: number; onClick?: () => void; active?: boolean;
}) {
  const displayed = useCountUp(rawValue, 900, delay);
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-white rounded-2xl border p-5 text-left w-full transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5" : "cursor-default"
      } ${active ? "border-teal ring-2 ring-teal/20 shadow-md" : "border-forest/[0.07]"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold leading-tight pr-2">{label}</p>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
          <Icon size={13} />
        </span>
      </div>
      <p className="font-display text-3xl font-bold text-forest tabular-nums">
        {prefix}{displayed.toLocaleString()}{suffix}
      </p>
      {sub && <p className="font-body text-xs text-forest/40 mt-1">{sub}</p>}
    </button>
  );
}

// ─── Booking row in drawer ────────────────────────────────────────────────────

function DrawerRow({ b }: { b: BookingRow }) {
  const cfg = STATUS_CONFIG[b.status] ?? { badge: "bg-forest/10 text-forest border-forest/15", label: b.status };
  const svcCfg = SERVICE_CONFIG[b.service];
  const net = b.price_cents - b.credit_applied_cents;
  return (
    <div className="py-3 border-b border-forest/[0.05] last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-body text-sm font-semibold text-forest truncate">
            {b.client?.name || b.client?.email || "—"}
          </p>
          <p className="font-body text-xs text-forest/45">
            {b.pet?.name && <span>{b.pet.name} · </span>}
            {svcCfg?.label ?? b.service} ·{" "}
            {new Date(b.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            {b.end_date ? ` – ${new Date(b.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`font-body text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
            {STATUS_CONFIG[b.status]?.label ?? b.status}
          </span>
          {net > 0 && (
            <span className={`font-body text-xs font-semibold ${b.paid_at ? "text-teal" : "text-forest/45"}`}>
              ${(net / 100).toFixed(0)}{b.paid_at ? " ✓" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Slide-over drawer ────────────────────────────────────────────────────────

function Drawer({
  drawer, visible, onClose,
}: {
  drawer: Exclude<DrawerState, null>;
  visible: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(0);

  // Reset when drawer content changes
  useEffect(() => { setSearch(""); setPage(0); }, [drawer.title]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = search.toLowerCase();
  const filtered = q
    ? drawer.bookings.filter((b) =>
        (b.client?.name || b.client?.email || "").toLowerCase().includes(q) ||
        (b.pet?.name || "").toLowerCase().includes(q)
      )
    : drawer.bookings;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const slice = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const totalRevenue = filtered
    .filter((b) => b.paid_at)
    .reduce((s, b) => s + (b.price_cents - b.credit_applied_cents), 0);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-forest/25 z-40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white shadow-2xl z-50
          flex flex-col transition-transform duration-300 ease-out
          ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-forest/[0.06] flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-display text-lg font-bold text-forest">{drawer.title}</h3>
            <p className="font-body text-xs text-forest/40 mt-0.5">
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
              {totalRevenue > 0 && ` · $${(totalRevenue / 100).toFixed(0)} collected`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-forest/[0.06] flex items-center justify-center text-forest/50 hover:text-forest hover:bg-forest/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-forest/[0.05] flex-shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/30" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search client or pet…"
              className="w-full pl-8 pr-3 py-2 border border-forest/15 rounded-lg font-body text-xs
                bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal
                text-forest placeholder:text-forest/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {slice.length === 0 ? (
            <p className="font-body text-sm text-forest/35 text-center py-10">
              {search ? `No bookings matching "${search}"` : "None yet."}
            </p>
          ) : (
            slice.map((b) => <DrawerRow key={b.id} b={b} />)
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-forest/[0.05] flex-shrink-0">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 font-body text-xs text-forest/50 hover:text-forest disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <p className="font-body text-xs text-forest/40">
              Page {page + 1} of {totalPages}
            </p>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 font-body text-xs text-forest/50 hover:text-forest disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-forest/[0.06] flex-shrink-0">
          <Link
            href={drawer.filterHref}
            onClick={onClose}
            className="flex items-center gap-1.5 font-body text-xs text-teal hover:text-teal-dark transition-colors font-semibold"
          >
            <ExternalLink size={11} /> Open in Bookings page
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── Revenue chart ────────────────────────────────────────────────────────────

function RevenueChart({ bookings }: { bookings: BookingRow[] }) {
  const [period, setPeriod] = useState<Period>(6);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setBarsVisible(false);
    const t = setTimeout(() => setBarsVisible(true), 80);
    return () => clearTimeout(t);
  }, [period]);

  const now = new Date();
  const monthly = Array.from({ length: period }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (period - 1 - i), 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const paid = bookings.filter((b) => {
      if (!b.paid_at) return false;
      const pd = new Date(b.paid_at);
      return pd.getMonth() === m && pd.getFullYear() === y;
    });
    return {
      label: MONTH_NAMES[m],
      cents: paid.reduce((s, b) => s + (b.price_cents - b.credit_applied_cents), 0),
      count: paid.length,
    };
  });

  const maxCents = Math.max(...monthly.map((m) => m.cents), 1);
  const totalShown = monthly.reduce((s, m) => s + m.cents, 0);

  return (
    <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 mb-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-forest">Revenue Over Time</h2>
          <p className="font-body text-xs text-forest/40 mt-0.5">
            ${(totalShown / 100).toFixed(0)} collected in last {period} months
          </p>
        </div>
        <div className="flex gap-1 bg-forest/[0.04] rounded-lg p-1">
          {([3, 6, 12] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`font-body text-xs font-semibold px-3 py-1 rounded-md transition-all duration-150 ${
                period === p ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest/70"
              }`}
            >
              {p}M
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-36">
        {monthly.map(({ label, cents, count }, idx) => {
          const pct = Math.round((cents / maxCents) * 100);
          return (
            <div key={`${label}-${idx}`} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Hover tooltip — pure CSS, no state */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-150 z-10 whitespace-nowrap">
                <div className="bg-forest text-cream rounded-xl px-3 py-1.5 shadow-lg">
                  <p className="font-body text-xs font-bold">${(cents / 100).toFixed(0)}</p>
                  <p className="font-body text-[10px] text-cream/60">{count} booking{count !== 1 ? "s" : ""}</p>
                </div>
                <div className="w-2 h-2 bg-forest rotate-45 mx-auto -mt-1 rounded-sm" />
              </div>

              {/* Bar */}
              <div className="w-full rounded-t-md bg-teal/10 flex flex-col justify-end" style={{ height: "100px" }}>
                <div
                  className="w-full bg-teal group-hover:bg-teal-dark rounded-t-md transition-all ease-out"
                  style={{
                    height: barsVisible ? `${Math.max(pct, cents > 0 ? 2 : 0)}%` : "0%",
                    transitionDuration: "700ms",
                    transitionDelay: barsVisible ? `${idx * 40}ms` : "0ms",
                  }}
                />
              </div>
              <p className="font-body text-[10px] text-forest/40">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Breakdown bar row ────────────────────────────────────────────────────────

function BreakdownBar({
  label, count, total, bar, badge, mounted,
  onOpen, delay = 0,
}: {
  label: string; count: number; total: number;
  bar: string; badge: string; mounted: boolean;
  onOpen: () => void; delay?: number;
}) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-body text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${badge}`}>
          {label}
        </span>
        <button
          onClick={onOpen}
          disabled={count === 0}
          className="flex items-center gap-1 font-body text-xs font-semibold text-forest/50 hover:text-teal disabled:opacity-30 transition-colors"
        >
          {count}
          {count > 0 && <ArrowRight size={11} />}
        </button>
      </div>
      <div className="h-1.5 rounded-full bg-forest/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full ${bar} transition-all ease-out`}
          style={{
            width: mounted ? `${pct}%` : "0%",
            transitionDuration: "700ms",
            transitionDelay: mounted ? `${delay}ms` : "0ms",
          }}
        />
      </div>
      <p className="font-body text-[10px] text-forest/25 mt-1 text-right">{pct}%</p>
    </div>
  );
}

// ─── Repeat customers section ─────────────────────────────────────────────────

function RepeatCustomers({
  bookings, clients, mounted, openDrawer,
}: {
  bookings: BookingRow[];
  clients: ClientRow[];
  mounted: boolean;
  openDrawer: (data: Exclude<DrawerState, null>) => void;
}) {
  // Count completed bookings per client
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const countByClient: Record<string, { name: string; email: string; count: number; bookings: BookingRow[] }> = {};
  for (const b of completedBookings) {
    const key = b.client?.email ?? "unknown";
    if (!countByClient[key]) {
      countByClient[key] = { name: b.client?.name ?? b.client?.email ?? "—", email: key, count: 0, bookings: [] };
    }
    countByClient[key].count++;
    countByClient[key].bookings.push(b);
  }

  const allEntries = Object.values(countByClient);
  const repeaters  = allEntries.filter((e) => e.count >= 2);
  const uniqueClientCount = allEntries.length;
  const repeatRate = uniqueClientCount > 0 ? Math.round((repeaters.length / uniqueClientCount) * 100) : 0;
  const avgBookingsRepeater = repeaters.length > 0
    ? (repeaters.reduce((s, e) => s + e.count, 0) / repeaters.length).toFixed(1)
    : "—";

  // Top 5 most loyal (by completed booking count)
  const top5 = [...allEntries].sort((a, b) => b.count - a.count).slice(0, 5);

  // Frequency distribution buckets
  const buckets = [
    { label: "1 stay",  min: 1, max: 1 },
    { label: "2–3",     min: 2, max: 3 },
    { label: "4–5",     min: 4, max: 5 },
    { label: "6+",      min: 6, max: Infinity },
  ];
  const bucketCounts = buckets.map((b) => ({
    ...b,
    count: allEntries.filter((e) => e.count >= b.min && e.count <= b.max).length,
  }));
  const maxBucket = Math.max(...bucketCounts.map((b) => b.count), 1);

  const medalColors = ["text-gold", "text-forest/40", "text-terra/70"];

  return (
    <div className="mb-8">
      <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Repeat Customers</p>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Repeat clients"
          rawValue={repeaters.length}
          sub={`of ${uniqueClientCount} with completed stays`}
          icon={Repeat2}
          accent="bg-teal/10 text-teal"
          delay={0}
          onClick={repeaters.length > 0 ? () => openDrawer({
            title: "Repeat Clients",
            bookings: repeaters.flatMap((e) => e.bookings),
            filterHref: "/admin/bookings?status=completed",
          }) : undefined}
        />
        <StatCard
          label="Repeat rate"
          rawValue={repeatRate}
          suffix="%"
          sub="clients who came back"
          icon={TrendingUp}
          accent="bg-teal/10 text-teal"
          delay={80}
        />
        <StatCard
          label="Avg stays (repeaters)"
          rawValue={parseFloat(avgBookingsRepeater as string) || 0}
          sub="completed bookings"
          icon={Star}
          accent="bg-gold/15 text-gold-dark"
          delay={160}
        />
        <StatCard
          label="One-time only"
          rawValue={allEntries.filter((e) => e.count === 1).length}
          sub="clients with 1 stay"
          icon={Users}
          accent="bg-forest/10 text-forest/60"
          delay={240}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Top loyal clients */}
        <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={13} className="text-gold" />
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold">Most Loyal Clients</p>
          </div>
          {top5.length === 0 ? (
            <p className="font-body text-xs text-forest/35">No completed bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {top5.map((entry, i) => (
                <button
                  key={entry.email}
                  onClick={() => openDrawer({
                    title: `${entry.name}'s Bookings`,
                    bookings: entry.bookings,
                    filterHref: "/admin/bookings?status=completed",
                  })}
                  className="w-full flex items-center gap-3 group"
                >
                  <span className={`font-display text-sm font-bold w-5 text-right flex-shrink-0 ${medalColors[i] ?? "text-forest/25"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-body text-sm font-semibold text-forest truncate group-hover:text-teal transition-colors">
                      {entry.name}
                    </p>
                    <div
                      className="h-1 rounded-full bg-teal/15 mt-1 overflow-hidden"
                    >
                      <div
                        className="h-full bg-teal rounded-full transition-all ease-out"
                        style={{
                          width: mounted ? `${Math.round((entry.count / top5[0].count) * 100)}%` : "0%",
                          transitionDuration: "700ms",
                          transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                        }}
                      />
                    </div>
                  </div>
                  <span className="font-body text-sm font-bold text-forest/60 flex-shrink-0 group-hover:text-teal transition-colors">
                    {entry.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Frequency distribution */}
        <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
          <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold mb-4">Booking Frequency</p>
          {uniqueClientCount === 0 ? (
            <p className="font-body text-xs text-forest/35">No completed bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bucketCounts.map((b, i) => {
                const pct = Math.round((b.count / maxBucket) * 100);
                const clientPct = uniqueClientCount > 0 ? Math.round((b.count / uniqueClientCount) * 100) : 0;
                return (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-body text-xs text-forest/60">{b.label}</span>
                      <span className="font-body text-xs font-semibold text-forest/60">
                        {b.count} client{b.count !== 1 ? "s" : ""} · {clientPct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-forest/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ease-out ${
                          i === 0 ? "bg-forest/30" : i === 1 ? "bg-teal/60" : i === 2 ? "bg-teal" : "bg-gold/70"
                        }`}
                        style={{
                          width: mounted ? `${pct}%` : "0%",
                          transitionDuration: "700ms",
                          transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function AnalyticsDashboard({ bookings, clients, pets, referrals }: Props) {
  const [mounted, setMounted] = useState(false);
  const [drawer, setDrawer]   = useState<DrawerState>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const openDrawer = (data: Exclude<DrawerState, null>) => {
    setDrawer(data);
    setTimeout(() => setDrawerVisible(true), 10);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => setDrawer(null), 300);
  };

  // ── Metrics ──
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  const allPaid = bookings.filter((b) => b.paid_at);
  const totalRevenueCents = allPaid.reduce((s, b) => s + (b.price_cents - b.credit_applied_cents), 0);
  const paidThisMonth = allPaid.filter((b) => {
    const d = new Date(b.paid_at!);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthRevenueCents = paidThisMonth.reduce((s, b) => s + (b.price_cents - b.credit_applied_cents), 0);
  const avgCents = allPaid.length ? Math.round(totalRevenueCents / allPaid.length) : 0;
  const unpaid   = bookings.filter((b) => b.status === "completed" && !b.paid_at);
  const unpaidCents = unpaid.reduce((s, b) => s + (b.price_cents - b.credit_applied_cents), 0);

  const total = bookings.length;
  const statusMap:  Record<string, BookingRow[]> = {};
  const serviceMap: Record<string, BookingRow[]> = {};
  for (const b of bookings) {
    (statusMap[b.status]  ??= []).push(b);
    (serviceMap[b.service] ??= []).push(b);
  }

  const newClientsThisMonth = clients.filter((c) => {
    const d = new Date(c.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const pendingReferrals  = referrals.filter((r) => r.status === "pending").length;
  const creditedReferrals = referrals.filter((r) => r.status === "credited").length;

  const pmMap: Record<string, number> = {};
  for (const b of allPaid) {
    const pm = b.payment_method || "Unknown";
    pmMap[pm] = (pmMap[pm] ?? 0) + 1;
  }
  const pmEntries = Object.entries(pmMap).sort((a, b) => b[1] - a[1]);

  return (
    <>
      {/* Drawer */}
      {drawer && (
        <Drawer drawer={drawer} visible={drawerVisible} onClose={closeDrawer} />
      )}

      <div className="max-w-4xl">
        <div className="mb-8">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Overview</p>
          <h1 className="font-display text-3xl font-bold text-forest">Analytics</h1>
        </div>

        {/* ── Revenue KPIs ── */}
        <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Revenue</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total collected"
            rawValue={Math.round(totalRevenueCents / 100)}
            prefix="$"
            sub={`${allPaid.length} paid bookings`}
            icon={DollarSign}
            accent="bg-teal/10 text-teal"
            delay={0}
          />
          <StatCard
            label="This month"
            rawValue={Math.round(monthRevenueCents / 100)}
            prefix="$"
            sub={`${paidThisMonth.length} bookings`}
            icon={TrendingUp}
            accent="bg-teal/10 text-teal"
            delay={80}
          />
          <StatCard
            label="Avg booking"
            rawValue={Math.round(avgCents / 100)}
            prefix="$"
            sub="per paid booking"
            icon={Star}
            accent="bg-gold/15 text-gold-dark"
            delay={160}
          />
          <button
            onClick={() => openDrawer({ title: "Unpaid Completed", bookings: unpaid, filterHref: "/admin/bookings?status=completed" })}
            className={`bg-white rounded-2xl border p-5 text-left w-full transition-all duration-200
              cursor-pointer hover:shadow-md hover:-translate-y-0.5
              ${unpaidCents > 0 ? "border-rose/20" : "border-forest/[0.07]"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold leading-tight pr-2">Outstanding</p>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${unpaidCents > 0 ? "bg-rose/10 text-rose-dark" : "bg-forest/10 text-forest/50"}`}>
                <AlertCircle size={13} />
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-forest tabular-nums">${(unpaidCents / 100).toFixed(0)}</p>
            <p className={`font-body text-xs mt-1 flex items-center gap-1 ${unpaidCents > 0 ? "text-rose-dark" : "text-forest/40"}`}>
              {unpaid.length} unpaid {unpaidCents > 0 && <ArrowRight size={10} />}
            </p>
          </button>
        </div>

        {/* ── Revenue chart ── */}
        <RevenueChart bookings={bookings} />

        {/* ── Bookings breakdown ── */}
        <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Bookings</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* By status */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold">By Status</p>
              <span className="font-body text-xs font-semibold text-forest/40">{total} total</span>
            </div>
            <div className="space-y-4">
              {Object.entries(STATUS_CONFIG).map(([key, cfg], i) => (
                <BreakdownBar
                  key={key}
                  label={cfg.label}
                  count={statusMap[key]?.length ?? 0}
                  total={total}
                  bar={cfg.bar}
                  badge={cfg.badge}
                  mounted={mounted}
                  delay={i * 60}
                  onOpen={() => openDrawer({
                    title: `${cfg.label} Bookings`,
                    bookings: statusMap[key] ?? [],
                    filterHref: `/admin/bookings?status=${key}`,
                  })}
                />
              ))}
            </div>
          </div>

          {/* By service */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold">By Service</p>
              <span className="font-body text-xs font-semibold text-forest/40">{total} total</span>
            </div>
            <div className="space-y-4">
              {Object.entries(SERVICE_CONFIG).map(([key, cfg], i) => (
                <BreakdownBar
                  key={key}
                  label={cfg.label}
                  count={serviceMap[key]?.length ?? 0}
                  total={total}
                  bar={cfg.bar}
                  badge={cfg.badge}
                  mounted={mounted}
                  delay={i * 60}
                  onOpen={() => openDrawer({
                    title: `${cfg.label} Bookings`,
                    bookings: serviceMap[key] ?? [],
                    filterHref: `/admin/bookings?service=${key}`,
                  })}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Clients & Pets ── */}
        <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Clients & Pets</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total clients"    rawValue={clients.length}   icon={Users}    accent="bg-teal/10 text-teal"        delay={0} />
          <StatCard label="New this month"   rawValue={newClientsThisMonth} icon={Users} accent="bg-gold/15 text-gold-dark"   delay={80} />
          <StatCard label="Dogs"             rawValue={pets.filter(p => p.species === "dog").length} sub={`${pets.length} pets total`} icon={PawPrint} accent="bg-gold/15 text-gold-dark" delay={160} />
          <StatCard label="Cats"             rawValue={pets.filter(p => p.species === "cat").length} icon={PawPrint} accent="bg-forest/10 text-forest/60" delay={240} />
        </div>

        {/* ── Repeat customers ── */}
        <RepeatCustomers bookings={bookings} clients={clients} mounted={mounted} openDrawer={openDrawer} />

        {/* ── Referrals & Payment methods ── */}
        <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Referrals & Payments</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Referral stats */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={13} className="text-teal" />
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold">Referral Program</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-forest/60">Pending referrals</span>
                <span className="font-body text-sm font-bold text-gold-dark">{pendingReferrals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-forest/60">Credited referrals</span>
                <span className="font-body text-sm font-bold text-teal">{creditedReferrals}</span>
              </div>
              <div className="h-px bg-forest/[0.06]" />
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-forest/60">Credits awarded</span>
                <span className="font-body text-sm font-bold text-forest">${(creditedReferrals * 40).toFixed(0)}</span>
              </div>
              {pendingReferrals > 0 && (
                <Link href="/admin/referrals" className="flex items-center gap-1 font-body text-xs text-teal hover:text-teal-dark transition-colors">
                  <ExternalLink size={10} /> Review {pendingReferrals} pending →
                </Link>
              )}
            </div>
          </div>

          {/* Payment method breakdown */}
          <div className="bg-white rounded-2xl border border-forest/[0.07] p-5">
            <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold mb-4">Payment Methods</p>
            {pmEntries.length === 0 ? (
              <p className="font-body text-xs text-forest/35">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {pmEntries.map(([method, count], i) => {
                  const pct = Math.round((count / allPaid.length) * 100);
                  return (
                    <div key={method}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-body text-xs text-forest/60">{method}</span>
                        <span className="font-body text-xs font-semibold text-forest">{count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-forest/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-teal rounded-full transition-all ease-out"
                          style={{
                            width: mounted ? `${pct}%` : "0%",
                            transitionDuration: "700ms",
                            transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
