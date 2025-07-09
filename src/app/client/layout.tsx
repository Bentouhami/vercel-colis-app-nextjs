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
                {/* Main content */}
                <main className="flex-grow pt-[70px]">{children}</main>
                {/* Footer */}
                <Footer />
            </div>
        </ThemeProvider>
    )
}
