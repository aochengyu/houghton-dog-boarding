import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";
import { PawPrint } from "@/components/PawPrint";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; mode?: string; next?: string };
}) {
  // If already signed in as a CLIENT (not admin), skip the login page entirely
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user && user.email !== process.env.ADMIN_EMAIL) {
    redirect(searchParams.next ?? "/account/dashboard");
  }
  // Admin user: fall through to show the login form so they can sign in as a client
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-10 group">
        <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
          <PawPrint size={16} className="text-cream" />
        </div>
        <span className="font-display text-lg font-semibold text-forest group-hover:text-teal transition-colors">
          Paws and Petals
        </span>
      </Link>

      {/* Banner shown when admin is currently logged in */}
      {user && (
        <div className="w-full max-w-md mb-4 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark flex items-center gap-2">
          <span className="font-semibold">Admin session active.</span>
          <span className="text-rose-dark/70">Sign in below as a client to test the client portal.</span>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-3xl border border-forest/[0.07] shadow-card p-8 lg:p-10">
        {searchParams.error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
            {searchParams.error === "auth_callback_failed"
              ? "Authentication failed. Please try again."
              : searchParams.error}
          </div>
        )}
        <LoginForm defaultMode={(searchParams.mode as "signup") ?? "signin"} />
      </div>

      <p className="mt-6 text-xs font-body text-forest/40 text-center">
        <Link href="/" className="hover:text-teal transition-colors">← Back to Paws and Petals</Link>
      </p>
    </div>
  );
}
