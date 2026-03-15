"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { updateProfile, updatePassword } from "@/app/actions/account";
import { PawLoader } from "@/components/PawLoader";
import { useToast } from "@/components/Toast";

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30 transition-all duration-200";
const labelClass =
  "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";

function ProfileSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50"
    >
      {pending ? (
        <>
          <PawLoader size="sm" className="mr-1.5" /> Saving…
        </>
      ) : (
        "Save Changes"
      )}
    </button>
  );
}

function PasswordSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center bg-teal text-cream font-body font-semibold text-sm rounded-xl px-6 py-3 hover:bg-teal-dark transition-colors disabled:opacity-50"
    >
      {pending ? (
        <>
          <PawLoader size="sm" className="mr-1.5" /> Saving…
        </>
      ) : (
        "Update Password"
      )}
    </button>
  );
}

type Props = {
  name: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
};

export function SettingsClient({ name, phone, emergency_contact_name, emergency_contact_phone }: Props) {
  const [profileState, profileAction] = useFormState(updateProfile, null);
  const [passwordState, passwordAction] = useFormState(updatePassword, null);
  const toast = useToast();

  useEffect(() => {
    if (profileState?.success) {
      toast.success("Profile updated!");
    }
  }, [profileState?.success, toast]);

  useEffect(() => {
    if (passwordState?.success) {
      toast.success("Password updated!");
    }
  }, [passwordState?.success, toast]);

  return (
    <div className="max-w-2xl space-y-8">
      {/* Page heading */}
      <div>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-teal/70 font-semibold mb-2">
          Account
        </p>
        <h1 className="font-display text-3xl font-bold text-forest">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <h2 className="font-display text-lg font-bold text-forest mb-5">Profile Information</h2>

        {profileState?.error && (
          <div
            key={profileState.error}
            className="mb-4 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark animate-shake"
          >
            {profileState.error}
          </div>
        )}

        <form action={profileAction} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={name}
              placeholder="Jane Smith"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={phone}
              placeholder="(555) 000-0000"
              className={inputClass}
            />
          </div>

          <div className="pt-2 border-t border-forest/[0.06]">
            <p className="font-body text-xs text-forest/40 mb-4">
              Emergency contact — someone we can reach if we can&apos;t get hold of you.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergency_contact_name" className={labelClass}>
                  Emergency Contact Name
                </label>
                <input
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  type="text"
                  defaultValue={emergency_contact_name}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="emergency_contact_phone" className={labelClass}>
                  Emergency Contact Phone
                </label>
                <input
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  type="text"
                  defaultValue={emergency_contact_phone}
                  placeholder="(555) 000-0001"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <ProfileSubmit />
          </div>
        </form>
      </div>

      {/* Password card */}
      <div className="bg-white rounded-2xl border border-forest/[0.07] p-6">
        <h2 className="font-display text-lg font-bold text-forest mb-5">Change Password</h2>

        {passwordState?.error && (
          <div
            key={passwordState.error}
            className="mb-4 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark animate-shake"
          >
            {passwordState.error}
          </div>
        )}

        <form action={passwordAction} className="space-y-4">
          <div>
            <label htmlFor="new_password" className={labelClass}>New Password</label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              required
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className={labelClass}>Confirm New Password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div className="pt-1">
            <PasswordSubmit />
          </div>
        </form>
      </div>
    </div>
  );
}
