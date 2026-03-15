import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PetProfileClient } from "./PetProfileClient";
import type { Pet } from "@/lib/db/types";

export const metadata: Metadata = { title: "Pet Profile | My Account" };

export default async function PetProfilePage({ params }: { params: { id: string } }) {
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

  return <PetProfileClient pet={pet as Pet} />;
}
