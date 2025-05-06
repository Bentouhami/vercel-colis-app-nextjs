// src/app/client/layout.tsx
'use client';

import React from "react";
import Footer from "@/components/navigations/footer/Footer";

import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className="min-h-screen">
                    {/* Always show HeaderNavbar across all client pages */}
                    <HeaderWrapper/>
                    {/* Page Content */}
                    <div className="pt-[70px]">
                        {children}
                    </div>
                    <Footer/>
                </div>
            </ThemeProvider>
        </>
    );
}



