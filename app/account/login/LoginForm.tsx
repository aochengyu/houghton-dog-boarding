"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { Mail } from "lucide-react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-teal text-cream font-body font-semibold text-sm rounded-xl py-3.5 hover:bg-teal-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {pending && (
        <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
      )}
      {pending ? "Please wait…" : label}
    </button>
  );
}

const inputClass =
  "w-full border border-forest/15 rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-forest placeholder:text-forest/30";
const labelClass = "font-body text-xs font-semibold uppercase tracking-wide text-forest/50 mb-1.5 block";

export function LoginForm({ defaultMode }: { defaultMode: "signin" | "signup" }) {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [signInState, signInAction] = useFormState(signIn, null);
  const [signUpState, signUpAction] = useFormState(signUp, null);

  const signInError = signInState?.error;
  const signUpError = signUpState && "error" in signUpState ? signUpState.error : undefined;

  // Email confirmation sent — show success screen
  if (signUpState && "emailSent" in signUpState && signUpState.emailSent) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Mail size={24} className="text-teal" />
        </div>
        <h2 className="font-display text-2xl font-bold text-forest mb-2">Check your inbox</h2>
        <p className="font-body text-sm text-forest/55 mb-1">
          We sent a confirmation link to
        </p>
        <p className="font-body text-sm font-semibold text-teal mb-6">
          {signUpState.email}
        </p>
        <p className="font-body text-xs text-forest/40 leading-relaxed mb-6">
          Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it within a minute.
        </p>
        <button
          onClick={() => setMode("signin")}
          className="font-body text-sm font-semibold text-teal hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-forest mb-1">
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="font-body text-sm text-forest/50 mb-8">
        {mode === "signin"
          ? "Sign in to manage your pets and bookings."
          : "Join to manage your pets, track bookings, and earn referral credits."}
      </p>

      {(signInError || signUpError) && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-rose/10 border border-rose/20 text-sm font-body text-rose-dark">
          {signInError || signUpError}
        </div>
      )}

      <form action={mode === "signin" ? signInAction : signUpAction} className="space-y-4">
        {/* Honeypot: invisible to humans, bots will fill it */}
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
        />

        {mode === "signup" && (
          <div>
            <label htmlFor="name" className={labelClass}>Your name</label>
            <input id="name" name="name" type="text" required placeholder="Jane Smith" className={inputClass} />
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" required minLength={8} placeholder="Min. 8 characters" className={inputClass} />
        </div>

        {mode === "signup" && (
          <div>
            <label htmlFor="referral_code" className={labelClass}>
              Referral code <span className="normal-case font-normal text-forest/35">(optional)</span>
            </label>
            <input id="referral_code" name="referral_code" type="text" placeholder="e.g. PAW4XK" className={inputClass} />
          </div>
        )}

        <div className="pt-2">
          <SubmitButton label={mode === "signin" ? "Sign in" : "Create account"} />
        </div>
      </form>

      <p className="mt-6 text-center font-body text-sm text-forest/50">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button onClick={() => setMode("signup")} className="text-teal font-semibold hover:underline">
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setMode("signin")} className="text-teal font-semibold hover:underline">
              Sign in
            </button>
          </>
        )}
      </p>
    </>
  );
}
