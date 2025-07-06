// src/utils/publicRoutesHelper.ts
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    // Auth routes (handled separately in middleware)
    "/client/auth/login",
    "/client/auth/register",
    "/client/auth/forgot-password",
    "/client/auth/reset-password",
    "/client/auth/verify-email",

    // Public marketing/info pages
    "/client/about",
    "/client/services",
    "/client/tarifs",
    "/client/contact-us",
    "/client/simulation", // Public simulation tool
    "/client/tracking", // Public tracking (anyone can track with number)
    "/client/unauthorized",

    // Payment callback pages (need to be accessible)
    "/client/payment/payment-success",
    "/client/payment/payment-cancel",
  ];

  return publicRoutes.some((route) => pathname.startsWith(route));
}
