// path: src\middleware.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth/auth-edge";
import { RoleDto } from "@/services/dtos";

//  COMPREHENSIVE: Complete role-based access control based on your actual routes
const ROUTE_CONFIG = {
  // Public routes - accessible to everyone when NOT authenticated
  public: [
    "/",
    "/client/about",
    "/client/services",
    "/client/contact-us",
    "/client/simulation", // Public simulation access
    "/client/tarifs",
    "/client/tracking",
    "/client/tracking/[trackingNum]", // Public tracking
    "/api/auth",
    "/api/send-email",
    "/api/v1/contact",
    "/api/v1/countries",
    "/api/v1/countries/all",
    "/api/v1/cities",
    "/api/v1/cities/[countryId]",
    "/api/v1/agencies/light",
    "/api/v1/tarifs",
    "/api/v1/tracking",
    "/api/v1/tracking/[trackingNumber]",
    "/api/v1/transports",
    "/swagger",
    "/api/swagger",
  ],

  // Auth routes - should redirect authenticated users
  authRoutes: [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ],

  // CLIENT and DESTINATAIRE routes - both roles have same access
  clientRoutes: [
    "/client", // Client dashboard
    "/client/profile",
    "/client/profile/appointments",
    "/client/profile/appointments/book",
    "/client/profile/deliveries",
    "/client/profile/mes-destinataires",
    "/client/profile/notifications",
    "/client/profile/payments",
    "/client/profile/settings",
    "/client/payment",
    "/client/payment/payment-cancel",
    "/client/payment/payment-success",
    "/client/envois/recapitulatif",
    "/client/simulation/results",
    "/client/simulation/edit",
    "/client/simulation/ajouter-destinataire",
    // API routes for clients
    "/api/v1/simulations",
    "/api/v1/simulations/edit",
    "/api/v1/simulations/delete-cookies",
    "/api/v1/simulations/[id]",
    "/api/v1/payment",
    "/api/v1/payment/complete-payment",
    "/api/v1/envois/user/[userId]",
    "/api/v1/envois/cancel",
    "/api/v1/envois/[id]",
    "/api/v1/addresses",
    "/api/v1/addresses/[id]",
    "/api/v1/users/appointments/book",
    "/api/v1/users/appointments/envoi-paye",
    "/api/v1/users/destinataires",
    "/api/v1/users/[id]",
    "/api/v1/users/[id]/profile",
    "/swagger",
    "/api/swagger",
  ],

  // 🔒 ADMIN ONLY routes - SUPER_ADMIN, AGENCY_ADMIN, ACCOUNTANT can ONLY access these
  adminOnlyRoutes: [
    "/admin",
    "/admin/agencies",
    "/admin/agencies/new",
    "/admin/agencies/[id]/edit",
    "/admin/customers",
    "/admin/envois",
    "/admin/export",
    "/admin/reports",
    "/admin/settings",
    "/admin/stats",
    "/admin/users",
    "/admin/users/new",
    "/admin/users/[id]/edit",
    // API routes for admins
    "/api/v1/admin/dashboard",
    "/api/v1/agencies",
    "/api/v1/agencies/admin-agencies",
    "/api/v1/agencies/create-agency",
    "/api/v1/agencies/findAgency",
    "/api/v1/agencies/get-agency-by-id",
    "/api/v1/agencies/get-agency-by-id/[id]",
    "/api/v1/agencies/summary",
    "/api/v1/agencies/update-agency",
    "/api/v1/agencies/[agency]",
    "/api/v1/dashboard/super-admin",
    "/api/v1/dashboard/monthly-summary",
    "/api/v1/dashboard/weekly-summary",
    "/api/v1/admin/users/create",
    "/api/v1/users",
    "/api/v1/envois/[id]/status",
    "/api/v1/envois/[id]/tracking",
    "/api/v1/envois/[id]/documents",
    "/api/v1/envois/[id]/history",
    "/api/v1/envois/[id]/summary",
    "/api/v1/envois/[id]/update",
    "/api/v1/envois/[id]/delete",
    "/api/v1/envois/[id]/create",
    "/api/v1/envois/[id]/edit",
    "/api/v1/envois/[id]/duplicate",
    "/api/v1/envois/[id]/status",
    "/swagger",
    "/api/swagger",
  ],

  // Special routes
  errorRoutes: ["/client/unauthorized", "/admin/unauthorized"],

  // Auth API routes (accessible during auth flow)
  authApiRoutes: [
    "/api/auth/[...nextauth]",
    "/api/auth/status",
    "/api/auth/verify-credentials",
    "/api/v1/(auth)/check-reset-token",
    "/api/v1/(auth)/forgot-password",
    "/api/v1/(auth)/reset-password",
    "/api/v1/users/login",
    "/api/v1/users/logout",
    "/api/v1/users/register",
    "/api/v1/users/verify",
  ],
} as const;

//  ROLE DEFINITIONS
const ADMIN_ROLES: RoleDto[] = [
  RoleDto.SUPER_ADMIN,
  RoleDto.AGENCY_ADMIN,
  RoleDto.ACCOUNTANT,
];
const CLIENT_ROLES: RoleDto[] = [RoleDto.CLIENT, RoleDto.DESTINATAIRE];

//  ROLE-BASED REDIRECTS
const ROLE_REDIRECTS = {
  [RoleDto.CLIENT]: "/client",
  [RoleDto.DESTINATAIRE]: "/client", // Same access as CLIENT
  [RoleDto.SUPER_ADMIN]: "/admin",
  [RoleDto.AGENCY_ADMIN]: "/admin",
  [RoleDto.ACCOUNTANT]: "/admin",
} as const;

//  ROUTE CHECKING FUNCTIONS
function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.public.some((route) => {
    if (route.includes("[")) {
      // Handle dynamic routes like /client/tracking/[trackingNum]
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route);
  });
}

function isAuthRoute(pathname: string): boolean {
  return ROUTE_CONFIG.authRoutes.some((route) => pathname === route);
}

function isAuthApiRoute(pathname: string): boolean {
  return ROUTE_CONFIG.authApiRoutes.some((route) => {
    if (route.includes("[")) {
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route);
  });
}

function isClientRoute(pathname: string): boolean {
  return ROUTE_CONFIG.clientRoutes.some((route) => {
    if (route.includes("[")) {
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route);
  });
}

function isAdminOnlyRoute(pathname: string): boolean {
  return ROUTE_CONFIG.adminOnlyRoutes.some((route) => {
    if (route.includes("[")) {
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route);
  });
}

function isErrorRoute(pathname: string): boolean {
  return ROUTE_CONFIG.errorRoutes.some((route) => pathname.startsWith(route));
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role as RoleDto;

  //  PERFORMANCE: Skip processing for static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  //  ALLOW: Auth API routes (needed for authentication flow)
  if (isAuthApiRoute(pathname)) {
    return NextResponse.next();
  }

  //  ALLOW: Error routes
  if (isErrorRoute(pathname)) {
    return NextResponse.next();
  }

  //  REDIRECT: Authenticated users on auth pages
  if (isLoggedIn && userRole && isAuthRoute(pathname)) {
    const redirectUrl = ROLE_REDIRECTS[userRole];
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  //  REDIRECT: Root redirect for authenticated users
  if (pathname === "/" && isLoggedIn && userRole) {
    return NextResponse.redirect(new URL(ROLE_REDIRECTS[userRole], req.url));
  }

  //  ALLOW: Public routes for unauthenticated users only
  if (!isLoggedIn && isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  //  ALLOW: Auth routes for unauthenticated users
  if (!isLoggedIn && isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  //  REQUIRE AUTH: Protected routes need authentication
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // STRICT ROLE-BASED ACCESS CONTROL

  // ADMIN ROLES: Can ONLY access /admin/* routes (MOST RESTRICTIVE)
  if (ADMIN_ROLES.includes(userRole)) {
    //  Allow admin-only routes
    if (isAdminOnlyRoute(pathname)) {
      return NextResponse.next();
    }

    //  Allow access to public API routes used by admin UIs (e.g., countries, cities)
    //  This keeps admin pages functional without granting access to non-admin pages
    if (pathname.startsWith("/api") && isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    //  Block ALL other routes for admins (including root, client, public)

    const unauthorizedUrl = new URL("/admin/unauthorized", req.url);
    unauthorizedUrl.searchParams.set("reason", "admin_restricted_access");
    unauthorizedUrl.searchParams.set("attempted", pathname);
    unauthorizedUrl.searchParams.set("role", userRole);
    return NextResponse.redirect(unauthorizedUrl);
  }

  //  CLIENT ROLES: CLIENT, DESTINATAIRE (same access)
  if (CLIENT_ROLES.includes(userRole)) {
    //  Allow client routes
    if (isClientRoute(pathname)) {
      return NextResponse.next();
    }

    //  Allow public routes for clients (they can still access public pages)
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    //  Block admin routes for clients
    if (isAdminOnlyRoute(pathname)) {
      const unauthorizedUrl = new URL("/client/unauthorized", req.url);
      unauthorizedUrl.searchParams.set("reason", "client_blocked_from_admin");
      unauthorizedUrl.searchParams.set("attempted", pathname);
      unauthorizedUrl.searchParams.set("role", userRole);
      return NextResponse.redirect(unauthorizedUrl);
    }

    //  Allow other routes for clients
    return NextResponse.next();
  }

  // Default: allow access for unknown roles (shouldn't happen)

  return NextResponse.next();
});

//  COMPREHENSIVE: Match all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
