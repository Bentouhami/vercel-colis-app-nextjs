// path: /src/app/layout.tsx
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "@/components/navigations/footer/Footer";
import React from "react";
import {SessionProvider} from "next-auth/react";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "ColisApp",
    description: "ColisApp est un site web pour les particuliers et les agences de transport entre le Maroc et la Belgique.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <SessionProvider>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    {children}
                </main>
                <Footer/>
            </div>
        </SessionProvider>
        </body>
        </html>
    );
}
