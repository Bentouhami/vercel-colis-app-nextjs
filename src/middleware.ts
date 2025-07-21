// src/middleware.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth/auth-edge";
import { RoleDto } from "@/services/dtos";

// 🚀 SIMPLIFIED: Minimal imports for edge compatibility
const ROLE_REDIRECTS = {
  [RoleDto.CLIENT]: "/client",
  [RoleDto.SUPER_ADMIN]: "/admin",
  [RoleDto.AGENCY_ADMIN]: "/admin",
  [RoleDto.ACCOUNTANT]: "/admin",
  [RoleDto.DESTINATAIRE]: "/client",
} as const;

// 🚀 MINIMAL: Public routes check
const isPublicRoute = (pathname: string) => {
  const publicRoutes = [
    "/",
    "/client/auth",
    "/client/about",
    "/client/services",
    "/client/contact-us",
    "/client/simulation",
    "/client/tracking",
    "/api/auth",
  ];
  return publicRoutes.some((route) => pathname.startsWith(route));
};

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as RoleDto;

  // Skip processing for static files and API routes (except auth)
  if (
    pathname.startsWith("/_next/") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect authenticated users from login/register pages
  if (
    isLoggedIn &&
    (pathname === "/client/auth/login" || pathname === "/client/auth/register")
  ) {
    const redirectPath = userRole ? ROLE_REDIRECTS[userRole] : "/client"; // Default to /client if role is not defined for some reason
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Handle public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!isLoggedIn) {
    const loginUrl = new URL("/client/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based redirects
  if (isLoggedIn && userRole) {
    // Root redirect
    if (pathname === "/") {
      return NextResponse.redirect(new URL(ROLE_REDIRECTS[userRole], req.url));
    }

    // Admin access control
    if (pathname.startsWith("/admin")) {
      const adminRoles = [
        RoleDto.SUPER_ADMIN,
        RoleDto.AGENCY_ADMIN,
        RoleDto.ACCOUNTANT,
      ];
      if (!adminRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/client/unauthorized", req.url));
      }
    }

    // Client access control
    if (
      pathname.startsWith("/client/profile") ||
      pathname.startsWith("/client/payment")
    ) {
      const clientRoles = [RoleDto.CLIENT, RoleDto.DESTINATAIRE];
      if (!clientRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }

  return NextResponse.next();
});

// 🚀 OPTIMIZED: More specific matcher to reduce bundle size
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
