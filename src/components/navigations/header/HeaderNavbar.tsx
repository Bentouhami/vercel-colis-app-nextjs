"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {Bell, Menu, Settings, User} from "lucide-react";
import ColisBrand from "@/components/navigations/brand/ColisBrand";
import LogoutButton from "../../buttons/LogoutButton";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import LoginButton from "@/components/buttons/LoginButton";
import RegisterButton from "@/components/buttons/RegisterButton";
import {RoleDto} from "@/services/dtos";

interface NavbarProps {
    role: RoleDto | undefined;
    isLoggedIn: boolean | undefined;
    firstName: string;
    lastName: string;
    name: string;
    email: string | null;
    image: string;
}

const HeaderNavbar: React.FC<NavbarProps> = ({
                                                 role,
                                                 isLoggedIn,
                                                 name,
                                                 email,
                                                 image,
                                             }) => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hasDashboardAccess, setHasDashboardAccess] = useState(false);
    useEffect(() => {
        if (role === RoleDto.SUPER_ADMIN || role === RoleDto.AGENCY_ADMIN || role === RoleDto.ACCOUNTANT) {
            setHasDashboardAccess(true);
        }
    }, [role]);

    return (
        <header className="border-b shadow-sm bg-white fixed top-0 left-0 w-full z-50">
            <div className="container flex justify-between items-center h-16">
                {/* Left - Brand */}
                <Link href="/client" className="flex items-center">
                    <ColisBrand/>
                </Link>

                {/* Navigation Links (Hidden on mobile, visible on md+) */}
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/client/home" className="hover:text-primary text-gray-700 flex items-center">
                        Accueil
                    </Link>
                    <Link href="/client/simulation" className="hover:text-primary text-gray-700 flex items-center">
                        Simulation
                    </Link>
                    <Link href="/client/services" className="hover:text-primary text-gray-700">
                        Services
                    </Link>
                    <Link href="/client/tarifs" className="hover:text-primary text-gray-700">
                        Tarifs
                    </Link>
                    <Link href="/client/contact-us" className="hover:text-primary text-gray-700">Contact-nous</Link>
                </nav>

                {/* Right - User Profile & Mobile Menu */}
                <div className="flex items-center gap-4">
                    {/* Desktop - User Dropdown */}
                    <div className="hidden md:flex items-center gap-4">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={image} alt={name}/>
                                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                    </div>
                                    <Separator/>
                                    {isLoggedIn && (
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href="/client/profile" className="flex items-center gap-2">
                                                    <User className="w-4 h-4"/> Mon Profil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href="/client/profile/notifications"
                                                      className="flex items-center gap-2">
                                                    <Bell className="w-4 h-4"/> Mes Notifications
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                    {hasDashboardAccess && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="flex items-center gap-2">
                                                <Settings className="w-4 h-4"/> Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    <Separator/>
                                    <div className="px-4 py-3 flex justify-center">
                                        <LogoutButton/>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2">
                                <LoginButton/>
                                <RegisterButton/>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <nav className="flex flex-col gap-4">
                                    <Link href="/client/home" className="hover:text-primary text-gray-700">
                                        Accueil
                                    </Link>
                                    <Link href="/client/simulation" className="hover:text-primary text-gray-700">
                                        Simulation
                                    </Link>
                                    <Link href="/client/services" className="hover:text-primary text-gray-700">
                                        Services
                                    </Link>
                                    <Link href="/client/tarifs" className="hover:text-primary text-gray-700">
                                        Tarifs
                                    </Link>
                                    <Link href="/client/contact-us" className="hover:text-primary text-gray-700">
                                        Contact-nous
                                    </Link>
                                </nav>
                                <Separator/>
                                {isLoggedIn ? (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                        <Separator className="my-3"/>

                                        <div className="flex flex-col gap-2">
                                            {/*  Profile */}
                                            <Link href="/client/profile" className="flex items-center gap-2">
                                                <User className="w-4 h-4"/> Mon Profil
                                            </Link>
                                            {/*  Notifications */}
                                            <Link href="/client/profile/notifications"
                                                  className="flex items-center gap-2">
                                                <Bell className="w-4 h-4"/> Mes Notifications
                                            </Link>
                                        </div>
                                        {hasDashboardAccess && (
                                            <Link href="/admin" className="flex items-center gap-2">
                                                <Settings className="w-4 h-4"/> Dashboard
                                            </Link>
                                        )}

                                        <div className="mt-2 flex flex-col gap-2">
                                            <LogoutButton/>
                                        </div>
                                    </div>
                                ) : (
                                    !isLoggedIn && (
                                        <div className="mt-2 flex flex-column gap-2 justify-items-center">
                                            <LoginButton/>
                                            <RegisterButton/>
                                        </div>
                                    )
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderNavbar;
