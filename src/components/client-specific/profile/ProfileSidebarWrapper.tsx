// src/components/client-specific/profile/ProfileSidebarWrapper.tsx

"use client"

import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import ProfileSideMenu from "@/components/client-specific/profile/ProfileSideMenu"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProfileSidebarWrapperProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function ProfileSidebarWrapper({ isSidebarOpen, setIsSidebarOpen }: ProfileSidebarWrapperProps) {

    return (
        <SidebarProvider>
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-16"
                } flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 relative`}
            >
                <ProfileSideMenu iconOnly={!isSidebarOpen} />

                {/* Toggle Button - Always Visible */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 -right-5 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full shadow-md z-10"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>
        </SidebarProvider>
    )
}
