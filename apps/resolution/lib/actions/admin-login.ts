"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
} from "@/lib/auth/admin-session";

export type AdminLoginState = {
  error?: string;
};

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "admin",
  };
}

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const username = formData.get("username")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    return {
      error: "Unable to sign in right now. Please try again.",
    };
  }

  const expected = getAdminCredentials();

  if (username !== expected.username || password !== expected.password) {
    return { error: "Invalid username or password." };
  }

  const token = await createAdminSessionToken(sessionSecret);
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  redirect("/hazards");
}
