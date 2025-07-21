// src/app/client/layout.tsx

import type React from "react"
import Footer from "@/components/navigations/footer/Footer"
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { auth } from "@/auth/auth"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
    // Get session but don't require auth for all client routes (some are public)
    const session = await auth()

    return (
        <ThemeProvider>
            <div className="flex min-h-screen flex-col">
                {/* Header */}
                <HeaderWrapper session={session} />

                {/* Main content avec container unifié */}
                <main className="flex-grow pt-[70px]">
                    <div className="container mx-auto px-4">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </ThemeProvider>
    )
}