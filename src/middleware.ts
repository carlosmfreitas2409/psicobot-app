import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Not authenticated
  if (
    !session &&
    nextUrl.pathname !== "/sign-in" &&
    nextUrl.pathname !== "/sign-up" &&
    nextUrl.pathname !== "/pricing"
  ) {
    const url = new URL("/sign-in", request.url);

    return NextResponse.redirect(url);
  }

  if (
    session &&
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
