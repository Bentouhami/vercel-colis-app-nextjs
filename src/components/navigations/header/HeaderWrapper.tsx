// path: src/components/navigations/header/HeaderWrapper.tsx
"use client";

import {useSession} from "next-auth/react";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";
import {RoleDto} from "@/services/dtos/enums/EnumsDto";

const HeaderWrapper = () => {
    const {data: session, status} = useSession();

    return (
        <HeaderNavbar
            role={session?.user?.role}
            isLoggedIn={status === "authenticated"}
            firstName={session?.user?.firstName || ""}
            lastName={session?.user?.lastName || ""}
            name={session?.user?.name || ""}
            email={session?.user?.email || ""}
            image={session?.user?.image || "https://placehold.co/400.png"}
        />
    );
};

export default HeaderWrapper;
