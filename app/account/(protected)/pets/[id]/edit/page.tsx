import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PetForm } from "../../PetForm";
import { updatePet, deletePet } from "@/app/actions/pets";

export const metadata: Metadata = { title: "Edit Pet | My Account" };

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single();

  if (!pet) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href={`/account/pets/${pet.id}`}
          className="inline-flex items-center gap-1.5 font-body text-xs text-forest/40 hover:text-teal transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Back to {pet.name}&apos;s profile
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
            {pet.photo_url ? (
              <Image src={pet.photo_url} alt={pet.name} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {pet.species === "cat" ? "🐱" : "🐶"}
              </div>
            )}
          </div>
          <div>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-0.5">Editing profile</p>
            <h1 className="font-display text-3xl font-bold text-forest">{pet.name}</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8 mb-6">
        <PetForm pet={pet} action={updatePet} submitLabel="Save Changes" />
      </div>

      {/* Danger zone */}
      <div className="bg-rose/5 border border-rose/15 rounded-2xl p-5">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-rose-dark/70 mb-1">Danger zone</p>
        <p className="font-body text-xs text-forest/45 mb-3">Permanently delete {pet.name}&apos;s profile. This cannot be undone.</p>
        <form action={deletePet.bind(null, pet.id)}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 font-body text-xs font-semibold text-rose-dark bg-rose/10 hover:bg-rose/20 border border-rose/20 rounded-lg px-3 py-2 transition-colors"
          >
            <Trash2 size={12} /> Delete {pet.name}
          </button>
        </form>
      </div>
    </div>
  );
}
