import type React from "react"
import Footer from "@/components/navigations/footer/Footer"
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper"
import { auth } from "@/auth/auth"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <HeaderWrapper session={session} />

            {/* Main content */}
            <main className="flex-grow pt-[70px]">
                <div className="animate-fade-in">{children}</div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}
