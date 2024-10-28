// path: src/components/navigations/header/HeaderWithPathname.tsx

"use client";

import { usePathname } from "next/navigation";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";

const HeaderWithPathname = () => {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/admin");

    return !isDashboard ? <HeaderWrapper /> : null;
};

export default HeaderWithPathname;