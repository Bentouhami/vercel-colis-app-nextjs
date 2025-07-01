// src/utils/publicRoutesHelper.ts

// Fonction utilitaire pour vérifier si une route est publique
export function isPublicRoute(pathname: string): boolean {
    const publicRoutes = [
        "/client/login",
        "/client/register",
        "/client/forgot-password",
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

