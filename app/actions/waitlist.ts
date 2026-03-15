"use server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { isValidDate, isValidService, sanitize } from "@/lib/validate"

export async function joinWaitlist(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated." }

  const service = formData.get("service") as string
  const startDate = formData.get("start_date") as string
  const endDate = (formData.get("end_date") as string) || null
  const notes = sanitize(formData.get("notes") as string, 500)

  if (!isValidService(service)) return { error: "Invalid service." }
  if (!isValidDate(startDate)) return { error: "Invalid start date." }
  if (endDate && !isValidDate(endDate)) return { error: "Invalid end date." }

  const { error } = await supabase.from("waitlist").insert({
    client_id: user.id, service, start_date: startDate, end_date: endDate, notes: notes || null,
  })
  if (error) return { error: error.message }
  revalidatePath("/account/waitlist")
  return { success: true }
}

export async function removeFromWaitlist(entryId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from("waitlist").delete().eq("id", entryId).eq("client_id", user.id)
  revalidatePath("/account/waitlist")
}

export async function adminDeleteWaitlistEntry(entryId: string) {
  const admin = createAdminClient()
  await admin.from("waitlist").delete().eq("id", entryId)
  revalidatePath("/admin/waitlist")
}
