// src/app/admin/layout.tsx
import type React from "react"
import Sidebar from "@/components/admin/menu/Sidebar"
import { Footer } from "@/components/admin/menu/Footer"
import { requireAdmin } from "@/lib/auth-utils"

export const metadata = {
    title: "Administration - ColisApp",
    description: "Interface d'administration pour ColisApp",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // This will automatically redirect if not authenticated or not admin
    const session = await requireAdmin()

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Sidebar session={session} />
            <div className="flex flex-col flex-1 min-h-screen">
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
                <Footer />
            </div>
        </div>
    )
}

