import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { PetCard } from "./PetCard";

export const metadata: Metadata = { title: "My Pets | My Account" };

export default async function PetsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("client_id", user.id)
    .order("name");

  const count = pets?.length ?? 0;

  return (
    <div className="max-w-3xl">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">Your family</p>
          <h1 className="font-display text-3xl font-bold text-forest">My Pets</h1>
          {count > 0 && (
            <p className="font-body text-sm text-forest/40 mt-1">
              {count} {count === 1 ? "companion" : "companions"} on file
            </p>
          )}
        </div>
        <Link
          href="/account/pets/new"
          className="inline-flex items-center gap-1.5 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-teal-dark transition-colors"
        >
          <Plus size={14} /> Add pet
        </Link>
      </div>

      {/* ── Empty state ── */}
      {count === 0 && (
        <div className="bg-white rounded-2xl border border-forest/[0.07] px-8 py-16 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <p className="font-display text-xl font-bold text-forest mb-2">No pets yet</p>
          <p className="font-body text-sm text-forest/50 mb-6">Add your dog or cat to get started.</p>
          <Link
            href="/account/pets/new"
            className="inline-flex items-center gap-2 bg-teal text-cream font-body font-semibold text-sm rounded-xl px-5 py-3 hover:bg-teal-dark transition-colors"
          >
            <Plus size={14} /> Add your first pet
          </Link>
        </div>
      )}

      {/* ── Pet grid ── */}
      {count > 0 && (
        <div className={`grid gap-4 ${count === 1 ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          {pets!.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

      {/* ── "Add another" nudge when pets exist ── */}
      {count > 0 && (
        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-forest/[0.06]" />
          <Link
            href="/account/pets/new"
            className="inline-flex items-center gap-1.5 font-body text-xs text-forest/35 hover:text-teal transition-colors"
          >
            <Plus size={12} /> Add another pet
          </Link>
          <div className="flex-1 h-px bg-forest/[0.06]" />
        </div>
      )}
    </div>
  );
}
