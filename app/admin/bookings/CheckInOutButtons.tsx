"use client"
import { useTransition, useState, useEffect } from "react"
import { checkInBooking, checkOutBooking } from "@/app/actions/bookings"
import { LogIn, LogOut, Check } from "lucide-react"
import { Spinner } from "@/components/Spinner"
import { useToast } from "@/components/Toast"

export function CheckInOutButtons({ bookingId, status, checkedInAt, checkedOutAt }: {
  bookingId: string
  status: string
  checkedInAt: string | null
  checkedOutAt: string | null
}) {
  const [pending, startTransition] = useTransition()
  const [showCheck, setShowCheck] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (showCheck) {
      const t = setTimeout(() => setShowCheck(false), 1500)
      return () => clearTimeout(t)
    }
  }, [showCheck])

  if (status === "confirmed" && !checkedInAt) {
    return (
      <button
        onClick={() =>
          startTransition(async () => {
            await checkInBooking(bookingId)
            toast.success("Checked in!")
            setShowCheck(true)
          })
        }
        disabled={pending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal/10 text-teal font-body text-xs font-semibold hover:bg-teal/20 transition-colors active:scale-95 disabled:opacity-50"
      >
        {pending ? <Spinner size={12} /> : showCheck ? <Check size={12} /> : <LogIn size={12} />}
        Check In
      </button>
    )
  }
  if (status === "active" && !checkedOutAt) {
    return (
      <button
        onClick={() =>
          startTransition(async () => {
            await checkOutBooking(bookingId)
            toast.success("Checked out!")
            setShowCheck(true)
          })
        }
        disabled={pending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/15 text-gold-dark font-body text-xs font-semibold hover:bg-gold/25 transition-colors active:scale-95 disabled:opacity-50"
      >
        {pending ? <Spinner size={12} /> : showCheck ? <Check size={12} /> : <LogOut size={12} />}
        Check Out
      </button>
    )
  }
  if (checkedInAt && checkedOutAt) {
    return (
      <span className="font-body text-[10px] text-forest/35">
        Checked out {new Date(checkedOutAt).toLocaleDateString()}
      </span>
    )
  }
  if (checkedInAt) {
    return (
      <span className="font-body text-[10px] text-teal">
        Checked in {new Date(checkedInAt).toLocaleDateString()}
      </span>
    )
  }
  return null
}
