"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

async function uploadPetPhoto(file: File, clientId: string, petId: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // Size check: max 5 MB
  if (file.size > 5 * 1024 * 1024) return null;

  // Type check: must be an allowed image MIME type
  if (!file.type.startsWith("image/") || !ALLOWED_IMAGE_TYPES.includes(file.type)) return null;

  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `${clientId}/${petId}.${ext}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("pet-photos")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error || !data) return null;
  const { data: { publicUrl } } = admin.storage.from("pet-photos").getPublicUrl(data.path);
  return publicUrl;
}

function validatePetFields(fields: {
  name: string;
  breed: string;
  microchip_id: string;
  vet_name: string;
  vet_phone: string;
  medical_notes: string;
  behavioral_notes: string;
}): string | null {
  if (fields.name.length > 100) return "Name must be 100 characters or fewer.";
  if (fields.breed.length > 100) return "Breed must be 100 characters or fewer.";
  if (fields.microchip_id.length > 50) return "Microchip ID must be 50 characters or fewer.";
  if (fields.vet_name.length > 100) return "Vet name must be 100 characters or fewer.";
  if (fields.vet_phone.length > 100) return "Vet phone must be 100 characters or fewer.";
  if (fields.medical_notes.length > 2000) return "Medical notes must be 2000 characters or fewer.";
  if (fields.behavioral_notes.length > 2000) return "Behavioral notes must be 2000 characters or fewer.";
  return null;
}

export async function createPet(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const fields = {
    name:             (formData.get("name") as string).trim(),
    breed:            (formData.get("breed") as string).trim(),
    microchip_id:     (formData.get("microchip_id") as string).trim(),
    vet_name:         (formData.get("vet_name") as string).trim(),
    vet_phone:        (formData.get("vet_phone") as string).trim(),
    medical_notes:    (formData.get("medical_notes") as string).trim(),
    behavioral_notes: (formData.get("behavioral_notes") as string).trim(),
  };

  const validationError = validatePetFields(fields);
  if (validationError) return { error: validationError };

  const petId = crypto.randomUUID();
  const file  = formData.get("photo") as File;
  const photoUrl = await uploadPetPhoto(file, user.id, petId);

  const { error } = await supabase.from("pets").insert({
    id:               petId,
    client_id:        user.id,
    name:             fields.name,
    species:          formData.get("species") as string,
    breed:            fields.breed || null,
    dob:              (formData.get("dob") as string) || null,
    weight_lbs:       parseFloat(formData.get("weight_lbs") as string) || null,
    spayed_neutered:  formData.get("spayed_neutered") === "on",
    microchip_id:     fields.microchip_id || null,
    vet_name:         fields.vet_name || null,
    vet_phone:        fields.vet_phone || null,
    medical_notes:    fields.medical_notes || null,
    behavioral_notes: fields.behavioral_notes || null,
    rabies_exp:       (formData.get("rabies_exp") as string) || null,
    bordetella_exp:   (formData.get("bordetella_exp") as string) || null,
    photo_url:        photoUrl,
  });

  if (error) return { error: error.message };
  redirect("/account/pets");
}

export async function updatePet(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const fields = {
    name:             (formData.get("name") as string).trim(),
    breed:            (formData.get("breed") as string).trim(),
    microchip_id:     (formData.get("microchip_id") as string).trim(),
    vet_name:         (formData.get("vet_name") as string).trim(),
    vet_phone:        (formData.get("vet_phone") as string).trim(),
    medical_notes:    (formData.get("medical_notes") as string).trim(),
    behavioral_notes: (formData.get("behavioral_notes") as string).trim(),
  };

  const validationError = validatePetFields(fields);
  if (validationError) return { error: validationError };

  const petId = formData.get("pet_id") as string;
  const file  = formData.get("photo") as File;
  let photoUrl: string | null | undefined = undefined;
  if (file && file.size > 0) {
    photoUrl = await uploadPetPhoto(file, user.id, petId);
  }

  const update: Record<string, unknown> = {
    name:             fields.name,
    species:          formData.get("species") as string,
    breed:            fields.breed || null,
    dob:              (formData.get("dob") as string) || null,
    weight_lbs:       parseFloat(formData.get("weight_lbs") as string) || null,
    spayed_neutered:  formData.get("spayed_neutered") === "on",
    microchip_id:     fields.microchip_id || null,
    vet_name:         fields.vet_name || null,
    vet_phone:        fields.vet_phone || null,
    medical_notes:    fields.medical_notes || null,
    behavioral_notes: fields.behavioral_notes || null,
    rabies_exp:       (formData.get("rabies_exp") as string) || null,
    bordetella_exp:   (formData.get("bordetella_exp") as string) || null,
  };
  if (photoUrl !== undefined) update.photo_url = photoUrl;

  const { error } = await supabase
    .from("pets")
    .update(update)
    .eq("id", petId)
    .eq("client_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/account/pets/${petId}`);
  return { success: true };
}

// Quick photo-only update — called from the profile page avatar uploader
export async function updatePetPhoto(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const petId = formData.get("pet_id") as string;
  const file  = formData.get("photo") as File;
  if (!file || file.size === 0) return { error: "No file provided." };

  const photoUrl = await uploadPetPhoto(file, user.id, petId);
  if (!photoUrl) return { error: "Upload failed. Max 5 MB, images only." };

  const { error } = await supabase
    .from("pets")
    .update({ photo_url: photoUrl })
    .eq("id", petId)
    .eq("client_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/account/pets/${petId}`);
  return {};
}

export async function deletePet(petId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("pets").delete().eq("id", petId).eq("client_id", user.id);
  redirect("/account/pets");
}
