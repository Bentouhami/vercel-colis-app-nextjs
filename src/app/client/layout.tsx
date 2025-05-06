// src/app/client/layout.tsx
/* No 'use client' here unless this layout itself calls client-side hooks.
   You can still import Client Components (like HeaderWrapper) from a Server layout. */

import React from "react"
import Footer from "@/components/navigations/footer/Footer"
import HeaderWrapper from "@/components/navigations/header/HeaderWrapper"

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <>
            <HeaderWrapper />        {/* already a Client Component, no problem */}
            <main className="pt-[70px] min-h-screen">{children}</main>
            <Footer />
        </>
    )
}
