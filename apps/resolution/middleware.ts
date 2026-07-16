import { type NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

export async function middleware(request: NextRequest) {
  const sessionSecret = process.env.SESSION_SECRET;
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (
    !sessionSecret ||
    !token ||
    !(await verifyAdminSessionToken(token, sessionSecret))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hazards/:path*"],
};
