// path: src/components/navigations/header/HeaderWrapper.tsx
"use client";

import { Session } from "next-auth";
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar";

interface HeaderWrapperProps {
    session: Session | null;
}

const HeaderWrapper = ({ session }: HeaderWrapperProps) => {

    return (
        <HeaderNavbar
            role={session?.user?.role}
            isLoggedIn={session?.user ? true : false}
            firstName={session?.user?.firstName || ""}
            lastName={session?.user?.lastName || ""}
            name={session?.user?.name || ""}
            email={session?.user?.email || ""}
            image={session?.user?.image || "https://placehold.co/400.png"}
        />
    );
};

export default HeaderWrapper;
