"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Heart, CalendarDays, Gift, LogOut, Home, Settings } from "lucide-react";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/account/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/account/pets",      label: "My Pets",    icon: Heart },
  { href: "/account/bookings",  label: "Bookings",   icon: CalendarDays },
  { href: "/account/referrals", label: "Referrals",  icon: Gift },
  { href: "/account/settings",  label: "Settings",   icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-52 bg-white border-r border-forest/[0.06] flex-shrink-0">
      <nav className="flex-1 py-5 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-150 ${
                active
                  ? "bg-teal/10 text-teal font-semibold"
                  : "text-forest/45 hover:text-forest hover:bg-forest/5"
              }`}
            >
              <Icon size={15} className={active ? "text-teal" : "text-forest/30"} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5 space-y-0.5 border-t border-forest/[0.05] pt-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl font-body text-xs text-forest/35 hover:text-forest/60 transition-colors"
        >
          <Home size={13} />
          Back to site
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-body text-xs text-forest/35 hover:text-forest/60 transition-colors text-left"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
