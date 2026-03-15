"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isValidUUID, sanitize } from "@/lib/validate"

export async function submitReview(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const bookingId = formData.get("booking_id") as string
  const rating = parseInt(formData.get("rating") as string)
  const body = sanitize(formData.get("body") as string, 1000)

  if (!isValidUUID(bookingId)) return { error: "Invalid booking." }
  if (!rating || rating < 1 || rating > 5) return { error: "Please select a rating." }

  const { error } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    client_id: user.id,
    rating,
    body: body || null,
  })
  if (error) return { error: error.message }
  revalidatePath("/account/bookings")
  return { success: true }
}

export async function approveReview(reviewId: string) {
  if (!isValidUUID(reviewId)) return
  const admin = createAdminClient()
  await admin.from("reviews").update({ approved: true }).eq("id", reviewId)
  revalidatePath("/admin/reviews")
}

export async function deleteReview(reviewId: string) {
  if (!isValidUUID(reviewId)) return
  const admin = createAdminClient()
  await admin.from("reviews").delete().eq("id", reviewId)
  revalidatePath("/admin/reviews")
}
