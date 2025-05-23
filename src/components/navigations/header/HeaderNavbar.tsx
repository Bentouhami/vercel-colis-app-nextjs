"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Separator} from "@/components/ui/separator";
import {Bell, Menu, Settings, User, Sun, Moon, Laptop} from "lucide-react";
import ColisBrand from "@/components/navigations/brand/ColisBrand";
import LogoutButton from "../../buttons/LogoutButton";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import LoginButton from "@/components/buttons/LoginButton";
import RegisterButton from "@/components/buttons/RegisterButton";
import {RoleDto} from "@/services/dtos";
import {adminPath, clientPath} from "@/utils/constants";
import {useTheme} from "next-themes";
import ThemeColorSelector from "@/components/theme/ThemeColorSelector";
import {DialogTitle} from "@radix-ui/react-dialog";

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
                                                 firstName,
                                                 lastName,
                                                 name,
                                                 email,
                                                 image,
                                             }) => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hasDashboardAccess, setHasDashboardAccess] = useState(false);
    const {theme, setTheme, resolvedTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (
            role === RoleDto.SUPER_ADMIN ||
            role === RoleDto.AGENCY_ADMIN ||
            role === RoleDto.ACCOUNTANT
        ) {
            setHasDashboardAccess(true);
        }
    }, [role]);

    const themeOptions = [
        {value: "light", label: "Clair", icon: Sun},
        {value: "dark", label: "Sombre", icon: Moon},
        {value: "system", label: "Système", icon: Laptop},
    ];

    // Function to get the current theme icon
    const getCurrentThemeIcon = () => {
        if (!mounted) return Laptop;

        if (theme === "system") {
            return Laptop;
        }

        // Use resolvedTheme for actual theme when system is selected
        const currentTheme = theme === "system" ? resolvedTheme : theme;

        switch (currentTheme) {
            case "dark":
                return Moon;
            case "light":
                return Sun;
            default:
                return Laptop;
        }
    };

    const CurrentThemeIcon = getCurrentThemeIcon();

    return (
        <header className="border-b shadow-sm bg-white dark:bg-background fixed top-0 left-0 w-full z-50">
            <div className="container flex justify-between items-center h-16">
                {/* Brand */}
                <Link href="/client" className="flex items-center">
                    <ColisBrand/>
                </Link>

                {/* Navigation links */}
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href={clientPath()} className="hover:text-primary text-gray-700 dark:text-gray-300">
                        Accueil
                    </Link>
                    <Link href={clientPath("simulation")}
                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                        Simulation
                    </Link>
                    <Link href={clientPath("services")} className="hover:text-primary text-gray-700 dark:text-gray-300">
                        Services
                    </Link>
                    <Link href={clientPath("tarifs")} className="hover:text-primary text-gray-700 dark:text-gray-300">
                        Tarifs
                    </Link>
                    <Link href={clientPath("contact-us")}
                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                        Contact-nous
                    </Link>
                </nav>

                {/* Profile & mobile menu */}
                <div className="flex items-center gap-4">
                    {/* Desktop profile dropdown */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme toggle desktop */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    {mounted ? (
                                        <CurrentThemeIcon size={20}/>
                                    ) : (
                                        <Laptop size={20}/>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {themeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = theme === option.value;
                                    return (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setTheme(option.value)}
                                            className={isSelected ? "bg-accent" : ""}
                                        >
                                            <Icon size={16} className="mr-2"/>
                                            {option.label}
                                            {isSelected && <span className="ml-auto">✓</span>}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ThemeColorSelector/>

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
                                    <DropdownMenuItem asChild>
                                        <Link href={clientPath("profile")} className="flex items-center gap-2">
                                            <User className="w-4 h-4"/> Mon Profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={clientPath("profile/notifications")}
                                              className="flex items-center gap-2">
                                            <Bell className="w-4 h-4"/> Mes Notifications
                                        </Link>
                                    </DropdownMenuItem>
                                    {hasDashboardAccess && (
                                        <DropdownMenuItem asChild>
                                            <Link href={adminPath()} className="flex items-center gap-2">
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

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
                                <nav className="flex flex-col gap-4">
                                    <Link href={clientPath()}
                                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                                        Accueil
                                    </Link>
                                    <Link href={clientPath("simulation")}
                                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                                        Simulation
                                    </Link>
                                    <Link href={clientPath("services")}
                                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                                        Services
                                    </Link>
                                    <Link href={clientPath("tarifs")}
                                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                                        Tarifs
                                    </Link>
                                    <Link href={clientPath("contact-us")}
                                          className="hover:text-primary text-gray-700 dark:text-gray-300">
                                        Contact-nous
                                    </Link>
                                </nav>
                                <Separator className="my-3"/>

                                {isLoggedIn ? (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                        <Separator className="my-3"/>
                                        <div className="flex flex-col gap-2">
                                            <Link href={clientPath("profile")} className="flex items-center gap-2">
                                                <User className="w-4 h-4"/> Mon Profil
                                            </Link>
                                            <Link href={clientPath("profile/notifications")}
                                                  className="flex items-center gap-2">
                                                <Bell className="w-4 h-4"/> Mes Notifications
                                            </Link>
                                            {hasDashboardAccess && (
                                                <Link href={adminPath()} className="flex items-center gap-2 mt-2">
                                                    <Settings className="w-4 h-4"/> Dashboard
                                                </Link>
                                            )}
                                        </div>
                                        <Separator className="my-3"/>
                                        <div className="mt-2">
                                            <LogoutButton/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <LoginButton className="w-full"/>
                                        <RegisterButton className="w-full"/>
                                    </div>
                                )}

                                <Separator className="my-4"/>
                                <div className="flex items-center gap-2">
                                    <div>
                                        <span className="text-sm font-medium">Thème :</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    {mounted ? (
                                                        <CurrentThemeIcon size={16}/>
                                                    ) : (
                                                        <Laptop size={16}/>
                                                    )}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {themeOptions.map((option) => {
                                                    const Icon = option.icon;
                                                    const isSelected = theme === option.value;
                                                    return (
                                                        <DropdownMenuItem
                                                            key={option.value}
                                                            onClick={() => setTheme(option.value)}
                                                            className={isSelected ? "bg-accent" : ""}
                                                        >
                                                            <Icon size={16} className="mr-2"/>
                                                            {option.label}
                                                            {isSelected && <span className="ml-auto">✓</span>}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">Couleur :</span>
                                        <ThemeColorSelector/>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderNavbar;