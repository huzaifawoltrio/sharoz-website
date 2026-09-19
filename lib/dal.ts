import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookieValue } from "./session";
import dbConnect from "./db";
import Admin from "./models/Admin";

/**
 * The real authorization boundary. Verifies the session cookie's signature
 * and expiry. Cached per-request so calling it from a layout AND a nested
 * Server Action/component costs one decrypt, not several.
 *
 * Redirects to /admin/login on failure — call this at the top of every
 * protected layout, page, and Server Action. proxy.ts's cookie-presence
 * check is only a UX fast path; this is the check that actually matters.
 */
export const verifySession = cache(async () => {
  const cookieValue = await getSessionCookieValue();
  const session = await decrypt(cookieValue);

  if (!session?.adminId) {
    redirect("/admin/login");
  }

  return { isAuth: true, adminId: session.adminId };
});

/** Alias used at the top of protected layouts/Server Actions. */
export async function requireAdmin() {
  return verifySession();
}

export const getCurrentAdmin = cache(async () => {
  const { adminId } = await verifySession();
  await dbConnect();
  return Admin.findById(adminId).select("email name -_id").lean();
});
