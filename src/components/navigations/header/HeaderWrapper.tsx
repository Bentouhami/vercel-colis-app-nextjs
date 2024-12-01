"use client";

import {useSession} from "next-auth/react";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";
import {Roles} from "@/utils/dtos";

const HeaderWrapper = () => {
    const {data: session, status} = useSession();

    if (status === "loading") {
        // Optionally show a loading state
        return <div>Loading...</div>;
    }

    // Extract user details from the session
    const isLoggedIn = status === "authenticated";
    const isAdmin = session?.user?.roles?.includes(Roles.ADMIN) || false;
    const id = session?.user?.id || null;
    const email = session?.user?.email || null;
    // console.log("session in HeaderWrapper.tsx: ", session);

    const firstName = session?.user?.firstName || "";
    const lastName = session?.user?.lastName || "";
    const name = session?.user?.name || "";
    const image = session?.user?.image || "https://placehold.co/400";

    return (
        <HeaderNavbar
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            firstName={firstName}
            lastName={lastName}
            name={name}
            email={email}
            image={image}
        />
    );
};

export default HeaderWrapper;
