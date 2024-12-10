// src/utils/publicRoutesHelper.ts

// Fonction utilitaire pour vérifier si une route est publique
export function isPublicRoute(pathname: string): boolean {
    const publicRoutes = [

        "api/v1/users/logout",
        "/client/reset-password",
        "/client/simulation",
        "/client/simulation/results",
        "/client/services",
        "/client/tarifs",
        "/client/contact-us",
        "/client/unauthorized",

    ];
    return publicRoutes.some((route) => pathname.startsWith(route));
}

