// src/app/client/layout.tsx
'use client';

import React from "react";
import Footer from "@/components/navigations/footer/Footer";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";
import { ThemeProvider } from "@/components/theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <HeaderWrapper />

                {/* Contenu principal extensible */}
                <main className="flex-grow pt-[70px]">
                    {children}
                </main>

                {/* Footer collé en bas */}
                <Footer />
            </div>
        </ThemeProvider>
    );

}



