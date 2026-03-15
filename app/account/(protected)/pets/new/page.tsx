import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PetForm } from "../PetForm";
import { createPet } from "@/app/actions/pets";

export const metadata: Metadata = { title: "Add Pet | My Account" };

export default async function NewPetPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/account/pets"
          className="inline-flex items-center gap-1.5 font-body text-xs text-forest/40 hover:text-teal transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Back to My Pets
        </Link>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-1">New profile</p>
        <h1 className="font-display text-3xl font-bold text-forest">Add a Pet</h1>
      </div>
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6 lg:p-8">
        <PetForm action={createPet} submitLabel="Add Pet" />
      </div>
    </div>
  );
}
