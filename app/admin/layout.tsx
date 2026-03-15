import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./AdminSidebar";
import { AdminMobileMenu } from "./AdminMobileMenu";
import { ToastProvider } from "@/components/Toast";
import { ShieldCheck } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect("/account/login");

  return (
    <ToastProvider>
    <div className="min-h-screen flex flex-col bg-[#f0f2f5]">
      {/* Top bar — dark, utilitarian */}
      <header className="bg-[#1a1f2e] px-4 lg:px-6 h-12 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <AdminMobileMenu />
          <div className="flex items-center gap-1.5 bg-rose/20 border border-rose/30 rounded-md px-2 py-0.5">
            <ShieldCheck size={11} className="text-rose" />
            <span className="font-body text-[11px] font-bold text-rose tracking-wide uppercase">Admin</span>
          </div>
          <span className="text-white/20 text-xs hidden sm:block">·</span>
          <span className="font-display text-sm font-semibold text-white/70 hidden sm:block">
            Paws and Petals
          </span>
        </div>
        <span className="font-body text-xs text-white/30">{user.email}</span>
      </header>

      <div className="flex flex-1 min-h-0">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 lg:p-10">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}
