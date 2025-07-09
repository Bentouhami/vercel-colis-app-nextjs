"use client"

import type { Session } from "next-auth"
import HeaderNavbar from "@/components/navigations/header/HeaderNavbar"
import type { RoleDto } from "@/services/dtos"

interface HeaderWrapperProps {
    session: Session | null
}

const HeaderWrapper = ({ session }: HeaderWrapperProps) => {
    return (
        <HeaderNavbar
            role={session?.user?.role as RoleDto}
            isLoggedIn={!!session?.user}
            firstName={session?.user?.firstName || ""}
            lastName={session?.user?.lastName || ""}
            name={session?.user?.name || ""}
            email={session?.user?.email || ""}
            image={session?.user?.image || "https://placehold.co/400.png"}
        />
    )
}

export default HeaderWrapper
