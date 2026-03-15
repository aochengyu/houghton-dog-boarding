"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CalBooking = {
  id: string;
  status: string;
  service: string;
  start_date: string;
  end_date: string | null;
  price_cents: number;
  credit_applied_cents: number;
  paid_at: string | null;
  notes: string | null;
  client: { name?: string; email: string } | null;
  pet: { name: string; species: string; breed?: string | null; rabies_exp?: string | null; bordetella_exp?: string | null } | null;
};

type Props = {
  bookings: CalBooking[];
  maxCapacity: number;
  blackoutDates: { id: string; date: string; reason: string | null }[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function isActiveOn(b: CalBooking, ds: string): boolean {
  const end = b.end_date ?? b.start_date;
  return ds >= b.start_date && ds <= end;
}

function vaccinationStatus(pet: CalBooking["pet"]): "expired" | "soon" | "ok" {
  if (!pet) return "ok";
  const today = new Date();
  const in30 = new Date(today); in30.setDate(in30.getDate() + 30);
  const check = (exp: string | null | undefined): "expired" | "soon" | "ok" => {
    if (!exp) return "ok";
    const d = new Date(exp);
    if (d < today) return "expired";
    if (d <= in30) return "soon";
    return "ok";
  };
  const r = check(pet.rabies_exp);
  const b = check(pet.bordetella_exp);
  if (r === "expired" || b === "expired") return "expired";
  if (r === "soon" || b === "soon") return "soon";
  return "ok";
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const SERVICE_SHORT: Record<string, string> = {
  boarding:   "Board",
  "day-care": "Daycare",
  walking:    "Walk",
  "drop-in":  "Drop-in",
};

const STATUS_DOT: Record<string, string> = {
  inquiry:   "bg-gold border-gold/30",
  confirmed: "bg-teal/60 border-teal/20",
  active:    "bg-teal border-teal",
  completed: "bg-forest/40 border-forest/20",
};

// ─── Booking pill in day detail ───────────────────────────────────────────────

function BookingPill({ b, isCheckIn, isCheckOut }: { b: CalBooking; isCheckIn: boolean; isCheckOut: boolean }) {
  const net = b.price_cents - b.credit_applied_cents;
  const clientLabel = b.client?.name || b.client?.email || "Unknown";
  const petLabel = b.pet?.name ?? "—";
  const vacStatus = vaccinationStatus(b.pet);

  return (
    <div className="flex items-start gap-3 py-3 border-b border-forest/[0.05] last:border-0">
      {/* Species emoji */}
      <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center text-base flex-shrink-0 mt-0.5">
        {b.pet?.species === "cat" ? "🐱" : "🐶"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <p className="font-body text-sm font-semibold text-forest">{petLabel}</p>
          <span className="font-body text-xs text-forest/40">·</span>
          <p className="font-body text-xs text-forest/55">{clientLabel}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body text-[10px] text-forest/45 bg-forest/[0.05] px-1.5 py-0.5 rounded-md">
            {SERVICE_SHORT[b.service] ?? b.service}
          </span>
          {isCheckIn && (
            <span className="font-body text-[10px] font-semibold text-teal bg-teal/10 border border-teal/15 px-1.5 py-0.5 rounded-md">
              Checking in
            </span>
          )}
          {isCheckOut && (
            <span className="font-body text-[10px] font-semibold text-gold-dark bg-gold/10 border border-gold/15 px-1.5 py-0.5 rounded-md">
              Checking out
            </span>
          )}
          {vacStatus === "expired" && (
            <span className="font-body text-[10px] font-semibold text-rose-dark bg-rose/10 border border-rose/20 px-1.5 py-0.5 rounded-md">
              ⚠ Vaccines expired
            </span>
          )}
          {vacStatus === "soon" && (
            <span className="font-body text-[10px] font-semibold text-gold-dark bg-gold/10 border border-gold/20 px-1.5 py-0.5 rounded-md">
              ⚠ Expires soon
            </span>
          )}
          {net > 0 && (
            <span className={`font-body text-[10px] font-semibold ml-auto ${b.paid_at ? "text-teal" : "text-forest/40"}`}>
              ${(net / 100).toFixed(0)}{b.paid_at ? " ✓" : ""}
            </span>
          )}
        </div>
        {b.notes && (
          <p className="font-body text-[10px] text-forest/40 italic mt-1 truncate">{b.notes}</p>
        )}
      </div>
    </div>
  );
}

// ─── Calendar cell ────────────────────────────────────────────────────────────

function DayCell({
  date, bookings, todayStr, selectedDay, onSelect, blackoutDates, maxCapacity,
}: {
  date: Date | null;
  bookings: CalBooking[];
  todayStr: string;
  selectedDay: string | null;
  onSelect: (ds: string) => void;
  blackoutDates: string[];
  maxCapacity: number;
}) {
  if (!date) {
    return <div className="rounded-xl" />;
  }

  const ds = toDateStr(date);
  const isBlackout  = blackoutDates.includes(ds);
  const dayBookings = bookings.filter((b) => isActiveOn(b, ds));
  const checkIns    = bookings.filter((b) => b.start_date === ds);
  const checkOuts   = bookings.filter((b) => b.end_date === ds);
  const isToday     = ds === todayStr;
  const isSelected  = ds === selectedDay;
  const isPast      = ds < todayStr;
  const count       = dayBookings.length;
  const atCapacity  = count >= maxCapacity;

  if (isBlackout) {
    return (
      <button
        onClick={() => onSelect(isSelected ? "" : ds)}
        className={`relative rounded-xl p-2 text-left flex flex-col transition-all duration-150 min-h-[72px]
          bg-rose/5 border border-rose/10 ${isSelected ? "ring-2 ring-rose/20" : "hover:bg-rose/10"}
          ${isPast && !isToday ? "opacity-55" : ""}
        `}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 flex-shrink-0
          ${isToday ? "bg-rose/20" : ""}
        `}>
          <span className={`font-body text-xs font-semibold ${isToday ? "text-rose-dark" : "text-rose/50"}`}>
            {date.getDate()}
          </span>
        </div>
        <span className="font-body text-[9px] text-rose/50 font-semibold uppercase tracking-wide">blocked</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onSelect(isSelected ? "" : ds)}
      className={`relative rounded-xl p-2 text-left flex flex-col transition-all duration-150 min-h-[72px]
        ${isSelected ? "bg-teal/10 ring-2 ring-teal/25 shadow-sm" : "bg-white hover:bg-forest/[0.025] hover:shadow-sm"}
        ${isPast && !isToday ? "opacity-55" : ""}
        ${atCapacity && !isPast ? "ring-1 ring-gold/40" : ""}
      `}
    >
      {/* Date number */}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 flex-shrink-0
        ${isToday ? "bg-teal text-cream" : ""}
      `}>
        <span className={`font-body text-xs font-semibold ${isToday ? "text-cream" : "text-forest/60"}`}>
          {date.getDate()}
        </span>
      </div>

      {/* Booking dots */}
      {count > 0 && (
        <div className="flex flex-wrap gap-1 flex-1">
          {dayBookings.slice(0, 4).map((b) => (
            <span
              key={b.id}
              title={`${b.pet?.name} (${b.client?.name || b.client?.email})`}
              className={`w-2 h-2 rounded-full border ${STATUS_DOT[b.status] ?? "bg-forest/30 border-forest/20"}`}
            />
          ))}
          {count > 4 && (
            <span className="font-body text-[9px] text-forest/35 leading-none self-end">+{count - 4}</span>
          )}
        </div>
      )}

      {/* Capacity warning dot */}
      {atCapacity && !isPast && (
        <div className="absolute top-1.5 right-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold block" title="At or over capacity" />
        </div>
      )}

      {/* Check-in / check-out indicators */}
      {(checkIns.length > 0 || checkOuts.length > 0) && (
        <div className="absolute bottom-1.5 right-1.5 flex gap-0.5">
          {checkIns.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-teal" title={`${checkIns.length} check-in`} />
          )}
          {checkOuts.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold" title={`${checkOuts.length} check-out`} />
          )}
        </div>
      )}
    </button>
  );
}

// ─── Today snapshot card ──────────────────────────────────────────────────────

function TodayCard({ label, count, color, onClick }: {
  label: string; count: number; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl border border-forest/[0.07] p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 w-full"
    >
      <p className="font-body text-[10px] uppercase tracking-widest text-forest/40 font-semibold mb-2">{label}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{count}</p>
      {count > 0 && (
        <p className="font-body text-[10px] text-forest/35 mt-1 flex items-center gap-0.5">
          View <ArrowRight size={9} />
        </p>
      )}
    </button>
  );
}

// ─── Main calendar ────────────────────────────────────────────────────────────

export function AdminCalendar({ bookings, maxCapacity, blackoutDates }: Props) {
  const todayStr = toDateStr(new Date());
  const todayDate = new Date();

  const blackoutDateStrings = useMemo(() => blackoutDates.map((d) => d.date), [blackoutDates]);

  const [year, setYear]         = useState(todayDate.getFullYear());
  const [month, setMonth]       = useState(todayDate.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState<string>(todayStr);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }
  function goToday() {
    setYear(todayDate.getFullYear());
    setMonth(todayDate.getMonth());
    setSelectedDay(todayStr);
  }

  // Calendar grid cells
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    return [
      ...Array<null>(startDow).fill(null),
      ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
    ];
  }, [year, month]);

  // Today's snapshot
  const stayingToday    = bookings.filter((b) => isActiveOn(b, todayStr));
  const checkInsToday   = bookings.filter((b) => b.start_date === todayStr);
  const checkOutsToday  = bookings.filter((b) => b.end_date === todayStr);

  // This week
  const weekStart = new Date(todayDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekStartStr = toDateStr(weekStart);
  const weekEndStr   = toDateStr(weekEnd);
  const thisWeek = bookings.filter((b) => {
    const end = b.end_date ?? b.start_date;
    return end >= weekStartStr && b.start_date <= weekEndStr;
  });

  // Selected day bookings
  const selBookings  = selectedDay ? bookings.filter((b) => isActiveOn(b, selectedDay)) : [];
  const selCheckIns  = selectedDay ? bookings.filter((b) => b.start_date === selectedDay) : [];
  const selCheckOuts = selectedDay ? bookings.filter((b) => b.end_date === selectedDay) : [];
  const selBlackout  = selectedDay ? blackoutDates.find((d) => d.date === selectedDay) : null;

  const selDate = selectedDay ? new Date(selectedDay + "T12:00:00") : null;
  const selLabel = selDate
    ? selDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  const isCurrentMonth = year === todayDate.getFullYear() && month === todayDate.getMonth();

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Schedule</p>
        <h1 className="font-display text-3xl font-bold text-forest">Calendar</h1>
      </div>

      {/* Today's snapshot */}
      <p className="font-body text-[10px] uppercase tracking-widest text-forest/35 font-semibold mb-3">Today</p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <TodayCard
          label="Staying"
          count={stayingToday.length}
          color="text-teal"
          onClick={() => setSelectedDay(todayStr)}
        />
        <TodayCard
          label="Checking in"
          count={checkInsToday.length}
          color="text-teal"
          onClick={() => setSelectedDay(todayStr)}
        />
        <TodayCard
          label="Checking out"
          count={checkOutsToday.length}
          color="text-gold-dark"
          onClick={() => setSelectedDay(todayStr)}
        />
      </div>

      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-forest">
            {MONTH_NAMES[month]} {year}
          </h2>
          {!isCurrentMonth && (
            <button
              onClick={goToday}
              className="font-body text-xs text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              Today
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-forest/40 hover:text-forest hover:bg-forest/[0.06] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-forest/40 hover:text-forest hover:bg-forest/[0.06] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        {[
          { dot: "bg-gold border-gold/30",     label: "Inquiry" },
          { dot: "bg-teal/60 border-teal/20",  label: "Confirmed" },
          { dot: "bg-teal border-teal",         label: "Active" },
          { dot: "bg-teal",                     label: "Check-in", round: true },
          { dot: "bg-gold",                     label: "Check-out", round: true },
          { dot: "bg-rose/20 border-rose/10",   label: "Blocked", round: false },
        ].map(({ dot, label, round }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 ${round ? "rounded-full" : "rounded-full border"} ${dot} flex-shrink-0`} />
            <span className="font-body text-[10px] text-forest/45">{label}</span>
          </div>
        ))}
        <span className="font-body text-[10px] text-forest/35 ml-auto hidden sm:block">
          Click any day to see detail
        </span>
      </div>

      {/* Calendar grid */}
      <div className="bg-forest/[0.025] rounded-2xl p-3 mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {DAY_NAMES.map((d) => (
            <p key={d} className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/30 text-center py-1">
              {d}
            </p>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((date, i) => (
            <DayCell
              key={i}
              date={date}
              bookings={bookings}
              todayStr={todayStr}
              selectedDay={selectedDay}
              onSelect={setSelectedDay}
              blackoutDates={blackoutDateStrings}
              maxCapacity={maxCapacity}
            />
          ))}
        </div>
      </div>

      {/* Day detail panel */}
      {selectedDay && (
        <div className="bg-white rounded-2xl border border-forest/[0.07] overflow-hidden">
          <div className="px-5 py-4 border-b border-forest/[0.05] flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-forest">{selLabel}</h3>
              <p className="font-body text-xs text-forest/40 mt-0.5">
                {selBookings.length} pet{selBookings.length !== 1 ? "s" : ""} staying
                {selCheckIns.length > 0 && ` · ${selCheckIns.length} checking in`}
                {selCheckOuts.length > 0 && ` · ${selCheckOuts.length} checking out`}
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="font-body text-xs text-teal hover:text-teal-dark font-semibold flex items-center gap-1 transition-colors"
            >
              Manage <ArrowRight size={11} />
            </Link>
          </div>

          {/* Blackout warning */}
          {selBlackout && (
            <div className="mx-5 mt-4 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 flex items-start gap-2">
              <span className="text-sm">🚫</span>
              <div>
                <p className="font-body text-sm font-semibold text-rose-dark">This day is blocked</p>
                {selBlackout.reason && (
                  <p className="font-body text-xs text-rose-dark/70 mt-0.5">{selBlackout.reason}</p>
                )}
              </div>
            </div>
          )}

          {selBookings.length === 0 ? (
            <p className="px-5 py-8 font-body text-sm text-forest/35 text-center">
              {selBlackout ? "No bookings on this blocked day." : "Nothing scheduled for this day."}
            </p>
          ) : (
            <div className="px-5 divide-y divide-forest/[0.04]">
              {selBookings.map((b) => (
                <BookingPill
                  key={b.id}
                  b={b}
                  isCheckIn={b.start_date === selectedDay}
                  isCheckOut={b.end_date === selectedDay}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* This week sidebar summary (if viewing current month) */}
      {isCurrentMonth && thisWeek.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-forest/[0.07] p-5">
          <p className="font-body text-xs uppercase tracking-widest text-forest/40 font-semibold mb-3">This Week</p>
          <div className="space-y-1">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(weekStart);
              d.setDate(d.getDate() + i);
              const ds = toDateStr(d);
              const dayBookings = bookings.filter((b) => isActiveOn(b, ds));
              const checkIns    = bookings.filter((b) => b.start_date === ds);
              const checkOuts   = bookings.filter((b) => b.end_date === ds);
              const isToday     = ds === todayStr;
              const isBlackout  = blackoutDateStrings.includes(ds);
              if (dayBookings.length === 0 && checkIns.length === 0 && checkOuts.length === 0 && !isBlackout) return null;
              return (
                <button
                  key={ds}
                  onClick={() => { setSelectedDay(ds); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors
                    ${ds === selectedDay ? "bg-teal/10" : "hover:bg-forest/[0.03]"}
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0 ${isToday ? "bg-teal" : isBlackout ? "bg-rose/10" : "bg-forest/[0.06]"}`}>
                    <p className={`font-body text-[9px] font-semibold uppercase ${isToday ? "text-cream/70" : isBlackout ? "text-rose/50" : "text-forest/35"}`}>
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className={`font-body text-sm font-bold leading-none ${isToday ? "text-cream" : isBlackout ? "text-rose/50" : "text-forest/70"}`}>
                      {d.getDate()}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    {isBlackout ? (
                      <p className="font-body text-xs text-rose/50 font-semibold">Blocked</p>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-1">
                          {dayBookings.slice(0, 4).map((b) => (
                            <span key={b.id} className="font-body text-xs text-forest/55">
                              {b.pet?.name ?? "?"}
                            </span>
                          ))}
                          {dayBookings.length > 4 && (
                            <span className="font-body text-xs text-forest/35">+{dayBookings.length - 4}</span>
                          )}
                        </div>
                        {(checkIns.length > 0 || checkOuts.length > 0) && (
                          <p className="font-body text-[10px] text-forest/35 mt-0.5">
                            {checkIns.length > 0 && `${checkIns.length} in`}
                            {checkIns.length > 0 && checkOuts.length > 0 && " · "}
                            {checkOuts.length > 0 && `${checkOuts.length} out`}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <span className={`font-body text-xs font-semibold flex-shrink-0 ${isToday ? "text-teal" : isBlackout ? "text-rose/50" : "text-forest/40"}`}>
                    {isBlackout ? "—" : `${dayBookings.length} pets`}
                  </span>
                </button>
              );
            }).filter(Boolean)}
          </div>
        </div>
      )}
    </div>
  );
}
