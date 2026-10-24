"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NETWORK_ERROR, friendlyAuthError } from "@/lib/auth-errors";
import { Divider, Field, FormMessage, SubmitButton } from "./fields";
import { GoogleButton } from "./GoogleButton";

const TERMS_ERROR = "Please agree to the Terms and Privacy Policy to continue.";
const legalLink = "font-medium text-orange-600 underline hover:text-orange-700";

export function SignupForm() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function ensureAgreed() {
    if (agreed) return true;
    setError(TERMS_ERROR);
    return false;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    if (!ensureAgreed()) return;

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const { data, error } = await createClient().auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(friendlyAuthError(error));
        setPending(false);
        return;
      }
      // With email confirmation on, Supabase hides existing accounts behind an empty identities list.
      if (data.user && data.user.identities?.length === 0) {
        setError("An account with this email already exists. Try logging in instead.");
        setPending(false);
        return;
      }
      if (data.session) {
        router.replace("/");
        router.refresh();
        return;
      }
      setSuccess("Account created! Check your inbox to confirm your email, then log in.");
      setPending(false);
    } catch {
      setError(NETWORK_ERROR);
      setPending(false);
    }
  }

  const errorId = error ? "signup-error" : undefined;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={pending}
          aria-describedby={errorId}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          disabled={pending}
          hint="At least 6 characters."
          aria-describedby={errorId}
        />

        <div className="flex items-start gap-3">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            aria-required="true"
            checked={agreed}
            disabled={pending}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked && error === TERMS_ERROR) setError(null);
            }}
            aria-invalid={error === TERMS_ERROR}
            aria-describedby={error === TERMS_ERROR ? errorId : undefined}
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-orange-500"
          />
          <label htmlFor="terms" className="cursor-pointer text-sm text-gray-700">
            I agree to the{" "}
            <Link href="/terms" target="_blank" className={legalLink}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" target="_blank" className={legalLink}>
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {error && (
          <FormMessage id="signup-error" kind="error">
            {error}
          </FormMessage>
        )}
        {success && <FormMessage kind="success">{success}</FormMessage>}

        <SubmitButton pending={pending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <Divider />
      <GoogleButton disabled={pending} canStart={ensureAgreed} onError={setError} />

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
