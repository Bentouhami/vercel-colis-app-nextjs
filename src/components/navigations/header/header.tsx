// path : /src/app/layout.tsx

import { cookies } from 'next/headers';
import { verifyTokenFromCookies } from "@/app/utils/verifyToken";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";

const Header = () => {
    const cookieName = process.env.COOKIE_NAME || ""; // Vérifie que la variable d'environnement existe
    const authCookie = cookies().get(cookieName); // Récupère le cookie
    const token = authCookie ? authCookie.value : ""; // Vérifie si le cookie existe et récupère sa valeur
    const payload = token ? verifyTokenFromCookies(token) : null; // Vérifie et décode le token si présent

    const isLoggedIn = !!payload;
    const userEmail = payload?.userEmail || "";
    const firstName = payload?.firstName || "";
    const lastName = payload?.lastName || "";

    return (
        <header>
            <HeaderNavbar
                isAdmin={payload?.role === "ADMIN"}
                isLoggedIn={isLoggedIn}
                userEmail={userEmail}
                firstName={firstName}
                lastName={lastName}
            />
        </header>
    );
};

export default Header;

