// path: src/app/admin/layout.tsx
import React from "react";
import {Footer} from "@/components/admin/menu/Footer";
import {ThemeProvider} from "@/components/admin/theme-provider";
import {ToastContainer} from "react-toastify";
import {Inter} from "next/font/google";
import Sidebar from "@/components/admin/menu/Sidebar";
import {SessionProvider} from "next-auth/react";
import RequireAuth from "@/components/auth/RequireAuth";
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
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {/*<RequireAuth>*/}
                    <div className="flex min-h-screen">
                        <Sidebar/>
                        <div className="flex flex-col flex-1">
                            <main className="flex-1 overflow-auto m-5">
                                {children}
                                <ToastContainer position="top-right" autoClose={3000}/>
                            </main>
                            <Footer/>
                        </div>
                    </div>
                {/*</RequireAuth>*/}
            </ThemeProvider>
        </SessionProvider>
    );
}
