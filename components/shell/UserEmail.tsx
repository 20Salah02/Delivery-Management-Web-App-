import { createClient } from "@/lib/supabase/server";

export async function UserEmail() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;
  if (!email) return null;

  return (
    <span className="min-w-0 truncate text-xs text-gray-500 sm:text-sm" title={email}>
      {email}
    </span>
  );
}
