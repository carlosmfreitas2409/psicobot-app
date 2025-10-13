import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;

  const sessionCookie = getSessionCookie(request);

  // 1. Not authenticated
  if (
    !sessionCookie &&
    nextUrl.pathname !== "/sign-in" &&
    nextUrl.pathname !== "/sign-up" &&
    nextUrl.pathname !== "/pricing"
  ) {
    const url = new URL("/sign-in", request.url);

    return NextResponse.redirect(url);
  }

  if (
    sessionCookie &&
    (nextUrl.pathname === "/sign-in" ||
      nextUrl.pathname === "/sign-up" ||
      nextUrl.pathname === "/pricing")
  ) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
