// src/app/client/layout.tsx
import React from "react";
import Footer from "@/components/navigations/footer/Footer";
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <ThemeProvider>
            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <HeaderWrapper session={session} />

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



