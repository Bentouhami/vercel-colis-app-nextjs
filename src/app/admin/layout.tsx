// path: src/app/admin/layout.tsx
import React from "react";
import {Footer} from "@/components/admin/menu/Footer";
import {ThemeProvider} from "@/components/theme-provider";
import {Inter} from "next/font/google";
import Sidebar from "@/components/admin/menu/Sidebar";
import {SessionProvider} from "next-auth/react";
import {RoleDto} from "@/services/dtos";


export const metadata = {
    title: 'Dashboard',
    description: 'Dashboard de ColisApp',
};
const inter = Inter({subsets: ['latin']})

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    // Define allowed admin roles
    const allowedAdminRoles = [
        RoleDto.SUPER_ADMIN,
        RoleDto.AGENCY_ADMIN,
        RoleDto.ACCOUNTANT
    ];

    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                    <div className="flex min-h-screen">
                        <Sidebar/>
                        <div className="flex flex-col flex-1">
                            <main className="flex-1 overflow-auto m-5">
                                {children}
                            </main>
                            <Footer/>
                        </div>
                    </div>
            </ThemeProvider>
        </SessionProvider>
    );
}