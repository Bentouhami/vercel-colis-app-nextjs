// src/utils/publicRoutesHelper.ts

// Fonction utilitaire pour vérifier si une route est publique
export function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    "/client/auth/login",
    "/client/auth/register",
    "/client/auth/forgot-password",
    "/client/auth/reset-password",
    "/client/auth/verify-email",
    "/client/simulation",
    "/client/simulation/results",
    "/client/services",
    "/client/tarifs",
    "/client/contact-us",
    "/client/unauthorized",
    "/client/payment/payment-success",
    "/client/payment/payment-cancel",
  ];
  return publicRoutes.some((route) => pathname.startsWith(route));
}
