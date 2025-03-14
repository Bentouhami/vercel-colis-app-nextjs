"use client";

import React, { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProfileSideMenu from "@/components/client-specific/profile/ProfileSideMenu";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {RoleDto} from "@/services/dtos";

export default function ProfileLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <RequireAuth allowedRoles={[RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT, RoleDto.CLIENT]}>
            <SidebarProvider>
                <div className="w-full flex justify-center items-start min-h-screen bg-gray-100 pt-16 relative">
                    <div className="flex w-full max-w-5xl min-h-[80vh] bg-white shadow-lg rounded-lg overflow-hidden">

                        {/* Sidebar Toggle for Mobile */}
                        <div className="absolute top-4 left-4 md:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-64">
                                    <ProfileSideMenu />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Sidebar for Desktop */}
                        <div
                            className={`${
                                isSidebarOpen ? "w-64" : "w-16"
                            } hidden md:flex flex-col border-r bg-gray-50 transition-all duration-300 relative`}
                        >
                            {isSidebarOpen && <ProfileSideMenu />}

                            {/* Toggle Button - Always Visible */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 -right-5 bg-white border rounded-full shadow-md z-10"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                            </Button>
                        </div>

                        {/* Main Content */}
                        <main className="flex-1 p-6 flex justify-center">
                            <div className="w-full max-w-3xl">{children}</div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </RequireAuth>
    );
}
