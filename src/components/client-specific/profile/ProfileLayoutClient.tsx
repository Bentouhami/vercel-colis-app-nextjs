// src/components/client-specific/profile/ProfileLayoutClient.tsx

"use client"

import React, { useState } from "react"
import { Session } from "next-auth"
import ProfileSidebarWrapper from "@/components/client-specific/profile/ProfileSidebarWrapper"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"
import ProfileSideMenu from "@/components/client-specific/profile/ProfileSideMenu"

interface ProfileLayoutClientProps {
    session: Session | null
    children: React.ReactNode
}

export default function ProfileLayoutClient({ session, children }: ProfileLayoutClientProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)


    return (
        <div className="min-h-screen bg-muted dark:bg-gray-900 pt-[70px]">
            <div className="flex w-full max-w-screen-xl mx-auto min-h-[calc(100vh-4rem)] px-4">

                {/* Mobile Sidebar Button */}
                <div className="md:hidden fixed top-[70px] left-4 z-30">
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <DialogTitle className="sr-only">Menu du profil</DialogTitle>
                            <ProfileSideMenu iconOnly={false} />
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Sidebar desktop */}
                <aside
                    className={`hidden md:flex flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"
                        }`}
                >
                    <ProfileSidebarWrapper
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </aside>

                {/* Contenu principal */}
                <main className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 overflow-y-auto">
                    <div className="px-4 py-6 pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}