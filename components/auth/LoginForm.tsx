"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NETWORK_ERROR, friendlyAuthError } from "@/lib/auth-errors";
import { Divider, Field, FormMessage, SubmitButton } from "@/components/ui/fields";
import { GoogleButton } from "./GoogleButton";

const CALLBACK_ERRORS: Record<string, string> = {
  oauth: "Google sign-in didn't complete. Please try again.",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = CALLBACK_ERRORS[searchParams.get("error") ?? ""] ?? null;

  const [error, setError] = useState<string | null>(callbackError);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    setError(null);
    setPending(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        setError(friendlyAuthError(error));
        setPending(false);
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError(NETWORK_ERROR);
      setPending(false);
    }
  }

  const errorId = error ? "login-error" : undefined;

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
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
        {error && (
          <FormMessage id="login-error" kind="error">
            {error}
          </FormMessage>
        )}
        <SubmitButton pending={pending} pendingLabel="Logging in…">
          Log in
        </SubmitButton>
      </form>

      <Divider />
      <GoogleButton disabled={pending} onError={setError} />

      <p className="mt-6 text-center text-sm text-gray-600">
        New to QuickDrop?{" "}
        <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
