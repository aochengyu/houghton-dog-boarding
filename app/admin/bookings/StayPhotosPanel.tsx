"use client";

import { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Camera, X, Upload } from "lucide-react";
import { uploadStayPhoto, deleteStayPhoto } from "@/app/actions/stay-photos";

type StayPhoto = {
  id: string;
  photo_url: string;
  caption: string | null;
};

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal text-cream hover:bg-teal-dark transition-colors disabled:opacity-50"
    >
      <Upload size={11} />
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}

export function StayPhotosPanel({
  bookingId,
  photos,
}: {
  bookingId: string;
  photos: StayPhoto[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(uploadStayPhoto, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Reset form after successful upload
  if (state && !state.error && formRef.current) {
    formRef.current.reset();
  }

  async function handleDelete(photoId: string) {
    setDeletingId(photoId);
    await deleteStayPhoto(photoId, bookingId);
    setDeletingId(null);
  }

  return (
    <div className="mt-3 pt-3 border-t border-forest/[0.06]">
      {/* Toggle row */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-forest/40 hover:text-teal transition-colors group"
      >
        <Camera size={12} />
        <span className="font-body text-[11px] font-semibold text-forest/40 group-hover:text-teal">
          Stay Photos ({photos.length})
        </span>
        <span
          className={`font-body text-[10px] text-forest/30 transition-transform inline-block ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-3 bg-white rounded-xl border border-forest/[0.07] p-4 space-y-4">
          {/* Photo grid */}
          {photos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {photos.map((p) => (
                <div key={p.id} className="relative group">
                  <img
                    src={p.photo_url}
                    alt={p.caption || "Stay photo"}
                    className="w-20 h-20 rounded-lg object-cover border border-forest/10"
                  />
                  {p.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-forest/60 text-cream text-[9px] font-body px-1 py-0.5 rounded-b-lg truncate">
                      {p.caption}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-dark text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-rose"
                    aria-label="Delete photo"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload form */}
          <form ref={formRef} action={formAction} className="space-y-2">
            <input type="hidden" name="booking_id" value={bookingId} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1 block">
                  Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="block w-full font-body text-xs text-forest/60 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:font-semibold file:text-xs file:bg-cream file:text-forest hover:file:bg-forest/10 transition-colors cursor-pointer"
                />
              </div>
              <div>
                <label className="font-body text-[10px] font-semibold uppercase tracking-wide text-forest/40 mb-1 block">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  name="caption"
                  placeholder="e.g. Playing in the yard"
                  maxLength={200}
                  className="w-full border border-forest/15 rounded-lg px-3 py-1.5 font-body text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal text-forest placeholder:text-forest/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <UploadButton />
              {state?.error && (
                <p className="font-body text-xs text-rose-dark">{state.error}</p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
