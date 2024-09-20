// if the token is null or invalid,
// src/middleware.ts
// import {NextRequest, NextResponse} from "next/server";
//
// export const middleware = async (request: NextRequest) => {
//
//     console.log("Middleware called");
//
//     // get the token from the header request
//     const cookie = request.cookies.get("auth");
//     const authToken = cookie?.value as string;
//     // check if the token is null or invalid
//
//     if (!authToken) { // !authToken && request.method === "DELETE" for delete request only
//         console.log("No token provided, access denied from middleware");
//
//         return NextResponse.json(
//             {message: "No token provided,  access denied from middleware"},
//             {status: 401}
//         );
//     }
//     console.log("Token provided, access granted from middleware");
//
// }
//
// // export the middleware function config for matcher routes
// export const config = {
//     matcher: [
//         "/api/v1/users/profile/:path*",
//         "/api/v1/users/login",
//         "/api/v1/users/register"
//     ],
// }

// src/middleware.ts
import {NextRequest, NextResponse} from "next/server";

export const middleware = async (request: NextRequest) => {
    console.log("Middleware called");

    // Exclure certaines routes de la vérification du token
    const excludedRoutes = ['/api/v1/users/register', '/api/v1/users/login'];
    if (excludedRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next(); // Ne pas appliquer la vérification du token
    }

    // Vérifier la présence d'un token pour les autres routes
    const cookie = request.cookies.get("auth");
    const authToken = cookie?.value as string;

    if (!authToken) {
        console.log("No token provided, access denied from middleware");
        return NextResponse.json(
            {message: "No token provided, access denied from middleware"},
            {status: 401}
        );
    }

    console.log("Token provided, access granted from middleware");
    return NextResponse.next();
}

// Configuration pour appliquer le middleware sur certaines routes
export const config = {
    matcher: [
        "/api/v1/users/profile/:path*",
        "/api/v1/users/register",  // Appliquer le middleware ici, mais exclure via la logique interne
        "/api/v1/users/login",
        "/api/v1/simulation/:path*",
    ],
}
