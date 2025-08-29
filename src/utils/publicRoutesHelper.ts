// src/utils/publicRoutesHelper.ts
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    //  Remove auth routes - let middleware handle them
    // "/client/auth/login",        // Remove this
    // "/client/auth/register",     // Remove this
    // "/client/auth/forgot-password", // Remove this
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
