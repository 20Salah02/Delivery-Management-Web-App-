import type { AuthError } from "@supabase/supabase-js";

export const NETWORK_ERROR = "Can't reach the server. Check your connection and try again.";

export function friendlyAuthError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Please confirm your email first — check your inbox for the link.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Try logging in instead.";
    case "weak_password":
      return "That password is too weak. Use at least 6 characters.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a minute and try again.";
    case "validation_failed":
      return "Please enter a valid email address.";
  }
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return error.message || "Something went wrong. Please try again.";
}
