// src/app/admin/layout.tsx
import React from "react"
import Sidebar from "@/components/admin/menu/Sidebar"
import {Footer} from "@/components/admin/menu/Footer"

export const metadata = { /* … */}

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar/>
                <div className="flex flex-col flex-1">
                    <main className="flex-1 overflow-auto m-5">{children}</main>
                    <Footer/>
                </div>
            </div>
        </>
    )
}
