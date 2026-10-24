import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Set up zones, products and orders in minutes.">
      <SignupForm />
    </AuthShell>
  );
}
