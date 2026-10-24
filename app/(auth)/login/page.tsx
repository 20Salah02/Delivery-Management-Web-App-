import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your deliveries.">
      <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-gray-100" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
