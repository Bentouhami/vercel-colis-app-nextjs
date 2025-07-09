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
        <div className="flex min-h-screen">
            <Sidebar session={session} />
            <div className="flex flex-col flex-1">
                <main className="flex-1 overflow-auto m-5">{children}</main>
                <Footer />
            </div>
        </div>
    )
}
