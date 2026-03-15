"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CalendarDays, Gift, Home, LogOut, BarChart2, CalendarRange, Settings, Star } from "lucide-react";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/admin/clients",   label: "Clients",   icon: Users },
  { href: "/admin/bookings",  label: "Bookings",  icon: CalendarDays },
  { href: "/admin/calendar",  label: "Calendar",  icon: CalendarRange },
  { href: "/admin/referrals", label: "Referrals", icon: Gift },
  { href: "/admin/reviews",   label: "Reviews",   icon: Star },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/settings",  label: "Settings",  icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-48 bg-[#212638] flex-shrink-0">
      <nav className="flex-1 py-5 px-2.5 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
      <div className="px-2.5 pb-5 space-y-0.5 border-t border-white/5 pt-3">
        <Link
          href="/"
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
    </aside>
  );
}
