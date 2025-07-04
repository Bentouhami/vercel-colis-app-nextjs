// src/app/admin/layout.tsx
import React from "react"
import Sidebar from "@/components/admin/menu/Sidebar"
import { Footer } from "@/components/admin/menu/Footer"
import { auth } from "@/auth/auth"


export const metadata = { /* … */ }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar session={session} />
                <div className="flex flex-col flex-1">
                    <main className="flex-1 overflow-auto m-5">{children}</main>
                    <Footer />
                </div>
            </div>
        </>
    )
}
