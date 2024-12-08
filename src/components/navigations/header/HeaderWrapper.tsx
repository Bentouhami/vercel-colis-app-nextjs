"use client";

import {useSession} from "next-auth/react";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";
import {Roles} from "@/services/dtos/enums/EnumsDto";

const HeaderWrapper = () => {
    const {data: session, status} = useSession();

    // if (status === "loading") {
    //     // Optionally show a loading state
    //     return <div>Loading...</div>;
    // }

    // Extract user details from the session
    const isLoggedIn = status === "authenticated";
    const isSuperAdmin = session?.user?.roles?.includes(Roles.SUPER_ADMIN) || false;
    const isAgencyAdmin = session?.user?.roles?.includes(Roles.AGENCY_ADMIN) || false;
    const email = session?.user?.email || null;
    // console.log("session in HeaderWrapper.tsx: ", session);

    const firstName = session?.user?.firstName || "";
    const lastName = session?.user?.lastName || "";
    const name = session?.user?.name || "";
    const image = session?.user?.image || "https://placehold.co/400.png";

    return (
        <HeaderNavbar
            isLoggedIn={isLoggedIn}
            isSuperAdmin={isSuperAdmin}
            isAgencyAdmin={isAgencyAdmin}
            firstName={firstName}
            lastName={lastName}
            name={name}
            email={email}
            image={image}
        />
    );
};

export default HeaderWrapper;
