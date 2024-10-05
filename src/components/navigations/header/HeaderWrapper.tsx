import { cookies } from 'next/headers';
import { verifyTokenFromCookies } from "@/utils/verifyToken";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";

const HeaderWrapper = async () => {
    const cookieName = process.env.COOKIE_NAME || "";
    const cookieStore = cookies();
    const token = cookieStore.get(cookieName)?.value || '';

    let isLoggedIn = false;
    let userEmail = null;
    let isAdmin = false;
    let firstName = '';
    let lastName = '';

    if (token) {
        try {
            const decodedToken = await verifyTokenFromCookies(token);
            isLoggedIn = true;
            userEmail = decodedToken.email;
            isAdmin = decodedToken.isAdmin || false;
            firstName = decodedToken.firstName || '';
            lastName = decodedToken.lastName || '';
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }

    return (
        <HeaderNavbar
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            isAdmin={isAdmin}
            firstName={firstName}
            lastName={lastName}
        />
    );
};

export default HeaderWrapper;