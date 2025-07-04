// path: src/components/navigations/header/HeaderWithPathname.tsx

"use client";

import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";
import { useSession } from "next-auth/react";

const HeaderWithPathname = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isDashboard = pathname.startsWith("/admin");

    return !isDashboard ? <HeaderWrapper session={session} /> : null;
};

export default HeaderWithPathname;