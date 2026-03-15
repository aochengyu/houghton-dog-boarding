"use server"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { isValidUUID } from "@/lib/validate"

export async function uploadStayPhoto(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const admin = createAdminClient()
  const bookingId = formData.get("booking_id") as string
  const file = formData.get("photo") as File
  const caption = (formData.get("caption") as string)?.slice(0, 200) || null

  if (!isValidUUID(bookingId)) return { error: "Invalid booking." }
  if (!file || file.size === 0) return { error: "No file selected." }
  if (file.size > 10 * 1024 * 1024) return { error: "File too large (max 10 MB)." }
  if (!file.type.startsWith("image/")) return { error: "Images only." }

  const ext = file.name.split(".").pop() || "jpg"
  const path = `stay-photos/${bookingId}/${Date.now()}.${ext}`
  const { error: uploadError } = await admin.storage.from("pet-photos").upload(path, file)
  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = admin.storage.from("pet-photos").getPublicUrl(path)
  await admin.from("stay_photos").insert({ booking_id: bookingId, photo_url: publicUrl, caption })
  revalidatePath("/admin/bookings")
  return {}
}

export async function deleteStayPhoto(photoId: string, bookingId: string) {
  if (!isValidUUID(photoId)) return
  const admin = createAdminClient()
  await admin.from("stay_photos").delete().eq("id", photoId)
  revalidatePath("/admin/bookings")
}
