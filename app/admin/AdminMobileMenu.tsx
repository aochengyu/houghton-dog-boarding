"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CalendarDays, Gift, Home, LogOut, BarChart2, CalendarRange, Settings, X, Menu } from "lucide-react";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/admin/clients",   label: "Clients",   icon: Users },
  { href: "/admin/bookings",  label: "Bookings",  icon: CalendarDays },
  { href: "/admin/calendar",  label: "Calendar",  icon: CalendarRange },
  { href: "/admin/referrals", label: "Referrals", icon: Gift },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings",  label: "Settings",  icon: Settings },
];

export function AdminMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      {/* Hamburger trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#212638] flex flex-col transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-white/10 flex-shrink-0">
          <span className="font-display text-sm font-semibold text-white/70">Paws and Petals</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-sm transition-all duration-150 ${
                  active
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/40 hover:text-white/75 hover:bg-white/5"
                }`}
              >
                <Icon size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-2.5 pb-5 space-y-0.5 border-t border-white/5 pt-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            <Home size={13} />
            Back to site
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-xs text-white/25 hover:text-white/50 transition-colors text-left"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
