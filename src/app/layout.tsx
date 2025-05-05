// path: /src/app/layout.tsx
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "@/components/theme-provider";
import {Toaster} from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "ColisApp",
    description: "ColisApp est un site web pour les particuliers et les agences de transport entre le Maroc et la Belgique.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr">
            <body className={inter.className}>
            <SessionProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="min-h-screen flex flex-col">
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
                    <Toaster richColors position="bottom-right"/>
                </ThemeProvider>
            </SessionProvider>
            </body>
        </html>
    );
}
