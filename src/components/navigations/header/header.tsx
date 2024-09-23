// path : /src/app/layout.tsx


import { cookies } from 'next/headers';
import {verifyTokenFromCookies} from "@/app/utils/verifyToken";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";


const Header = () => {
    const token = cookies().get(process.env.COOKIE_NAME)?.value || "";
    const payload = verifyTokenFromCookies(token);

    const isLoggedIn = !!payload;
    const userEmail = payload?.userEmail || "";
    const firstName = payload?.firstName || "";
    const lastName = payload?.lastName || "";

    return (
        <header >
            <HeaderNavbar isAdmin={payload?.role || false} isLoggedIn={isLoggedIn} userEmail={userEmail} firstName={firstName} lastName={lastName} />
        </header>
    );
}

export default Header;
