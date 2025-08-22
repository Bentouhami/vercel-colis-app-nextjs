"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Bell, Menu, Settings, User, Sun, Moon, Laptop } from "lucide-react"
import ColisBrand from "@/components/navigations/brand/ColisBrand"
import LogoutButton from "../../buttons/LogoutButton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LoginButton from "@/components/buttons/LoginButton"
import RegisterButton from "@/components/buttons/RegisterButton"
import { RoleDto } from "@/services/dtos"
import { adminPath, clientPath } from "@/utils/constants"
import { useTheme } from "next-themes"
import ThemeColorSelector from "@/components/theme/ThemeColorSelector"
import { DialogTitle } from "@radix-ui/react-dialog"

interface NavbarProps {
    role: RoleDto | undefined
    isLoggedIn: boolean | undefined
    firstName: string
    lastName: string
    name: string
    email: string | null
    image: string
}

const HeaderNavbar: React.FC<NavbarProps> = ({ role, isLoggedIn, name, email, image }) => {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [hasDashboardAccess, setHasDashboardAccess] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const adminRoles = [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT]
        const hasAdminAccess = adminRoles.includes(role as RoleDto)
        setHasDashboardAccess(hasAdminAccess)
        setIsAdmin(hasAdminAccess)
    }, [role])

    const themeOptions = [
        { value: "light", label: "Clair", icon: Sun },
        { value: "dark", label: "Sombre", icon: Moon },
        { value: "system", label: "Système", icon: Laptop },
    ]

    // Function to get the current theme icon
    const getCurrentThemeIcon = () => {
        if (!mounted) return Laptop
        if (theme === "system") {
            return Laptop
        }
        // Use resolvedTheme for actual theme when system is selected
        const currentTheme = theme === "system" ? resolvedTheme : theme
        switch (currentTheme) {
            case "dark":
                return Moon
            case "light":
                return Sun
            default:
                return Laptop
        }
    }

    const CurrentThemeIcon = getCurrentThemeIcon()

    // 🚀 ROLE-BASED NAVIGATION: Different navigation for admins vs clients
    const getNavigationLinks = () => {
        if (isAdmin) {
            // 🔒 Admin navigation - ONLY admin routes (no access to public routes)
            return [
                { href: adminPath(), label: "Dashboard" },
                { href: adminPath("agencies"), label: "Agences" },
                { href: adminPath("users"), label: "Utilisateurs" },
                { href: adminPath("envois"), label: "Envois" },
                { href: adminPath("stats"), label: "Statistiques" },
                { href: adminPath("reports"), label: "Rapports" },
                { href: adminPath("settings"), label: "Paramètres" },
            ]
        } else {
            // Client navigation - full client navigation (CLIENT & DESTINATAIRE have same access)
            return [
                { href: clientPath(), label: "Accueil" },
                { href: clientPath("simulation"), label: "Simulation" },
                { href: clientPath("services"), label: "Services" },
                { href: clientPath("tarifs"), label: "Tarifs" },
                { href: clientPath("contact-us"), label: "Contactez-nous" },
                { href: clientPath("tracking"), label: "Suivi envois" },
            ]
        }
    }

    const navigationLinks = getNavigationLinks()

    return (
        <header className="border-b shadow-sm bg-white dark:bg-background fixed top-0 left-0 w-full z-50">
            <div className="container flex justify-between items-center h-16">
                {/* Brand */}
                <Link href={isAdmin ? adminPath() : clientPath()} className="flex items-center">
                    <ColisBrand />
                </Link>

                {/* Navigation links */}
                <nav className="hidden md:flex gap-6 items-center">
                    {navigationLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-primary text-gray-700 dark:text-gray-300">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Profile & mobile menu */}
                <div className="flex items-center gap-4">
                    {/* Desktop profile dropdown */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Theme toggle desktop */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    {mounted ? <CurrentThemeIcon size={20} /> : <Laptop size={20} />}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {themeOptions.map((option) => {
                                    const Icon = option.icon
                                    const isSelected = theme === option.value
                                    return (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() => setTheme(option.value)}
                                            className={isSelected ? "bg-accent" : ""}
                                        >
                                            <Icon size={16} className="mr-2" />
                                            {option.label}
                                            {isSelected && <span className="ml-auto">✓</span>}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ThemeColorSelector />

                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={image || "/placeholder.svg"} alt={name} />
                                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-4 py-2">
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                        {isAdmin && <p className="text-xs text-purple-600 font-medium mt-1">Administrateur</p>}
                                        {role === RoleDto.DESTINATAIRE && (
                                            <p className="text-xs text-blue-600 font-medium mt-1">Destinataire</p>
                                        )}
                                    </div>
                                    <Separator />

                                    {/* Role-based profile links */}
                                    {isAdmin ? (
                                        // 🔒 Admin profile options - ONLY admin routes
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href={adminPath()} className="flex items-center gap-2">
                                                    <Settings className="w-4 h-4" /> Dashboard Admin
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={adminPath("settings")} className="flex items-center gap-2">
                                                    <Settings className="w-4 h-4" /> Paramètres
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={adminPath("reports")} className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="w-4 h-4"
                                                    >
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                    </svg>
                                                    Rapports
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={adminPath("users")} className="flex items-center gap-2">
                                                    <User className="w-4 h-4" /> Gestion Utilisateurs
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        // Client profile options (CLIENT & DESTINATAIRE have same access)
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link href={clientPath("profile")} className="flex items-center gap-2">
                                                    <User className="w-4 h-4" /> Mon Profil
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={clientPath("profile/notifications")} className="flex items-center gap-2">
                                                    <Bell className="w-4 h-4" /> Mes Notifications
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={clientPath("profile/payments")} className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="w-4 h-4"
                                                    >
                                                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                                        <line x1="2" x2="22" y1="10" y2="10"></line>
                                                    </svg>
                                                    Mes Paiements
                                                </Link>
                                            </DropdownMenuItem>
                                            {role === RoleDto.CLIENT && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={clientPath("profile/mes-destinataires")} className="flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="w-4 h-4"
                                                        >
                                                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                            <circle cx="9" cy="7" r="4"></circle>
                                                            <path d="m19 8 2 2-2 2"></path>
                                                            <path d="m17 12h6"></path>
                                                        </svg>
                                                        Mes Destinataires
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                        </>
                                    )}

                                    <Separator />
                                    <div className="px-4 py-3 flex justify-center">
                                        <LogoutButton />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2">
                                <LoginButton />
                                <RegisterButton />
                            </div>
                        )}
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-64">
                                <DialogTitle className="sr-only">Menu de navigation</DialogTitle>
                                <nav className="flex flex-col gap-4">
                                    {navigationLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="hover:text-primary text-gray-700 dark:text-gray-300"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>

                                <Separator className="my-3" />

                                {isLoggedIn ? (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">{email}</p>
                                        {isAdmin && <p className="text-xs text-purple-600 font-medium mt-1">Administrateur</p>}
                                        {role === RoleDto.DESTINATAIRE && (
                                            <p className="text-xs text-blue-600 font-medium mt-1">Destinataire</p>
                                        )}
                                        <Separator className="my-3" />

                                        <div className="flex flex-col gap-2">
                                            {isAdmin ? (
                                                // 🔒 Admin mobile options - ONLY admin routes
                                                <>
                                                    <Link
                                                        href={adminPath()}
                                                        className="flex items-center gap-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" /> Dashboard Admin
                                                    </Link>
                                                    <Link
                                                        href={adminPath("settings")}
                                                        className="flex items-center gap-2 mt-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <Settings className="w-4 h-4" /> Paramètres
                                                    </Link>
                                                    <Link
                                                        href={adminPath("reports")}
                                                        className="flex items-center gap-2 mt-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="w-4 h-4"
                                                        >
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                            <polyline points="14 2 14 8 20 8"></polyline>
                                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                                            <polyline points="10 9 9 9 8 9"></polyline>
                                                        </svg>
                                                        Rapports
                                                    </Link>
                                                    <Link
                                                        href={adminPath("users")}
                                                        className="flex items-center gap-2 mt-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" /> Gestion Utilisateurs
                                                    </Link>
                                                </>
                                            ) : (
                                                // Client mobile options (CLIENT & DESTINATAIRE)
                                                <>
                                                    <Link
                                                        href={clientPath("profile")}
                                                        className="flex items-center gap-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <User className="w-4 h-4" /> Mon Profil
                                                    </Link>
                                                    <Link
                                                        href={clientPath("profile/notifications")}
                                                        className="flex items-center gap-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <Bell className="w-4 h-4" /> Mes Notifications
                                                    </Link>
                                                    <Link
                                                        href={clientPath("profile/payments")}
                                                        className="flex items-center gap-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="w-4 h-4"
                                                        >
                                                            <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                                            <line x1="2" x2="22" y1="10" y2="10"></line>
                                                        </svg>
                                                        Mes Paiements
                                                    </Link>
                                                    {role === RoleDto.CLIENT && (
                                                        <Link
                                                            href={clientPath("profile/mes-destinataires")}
                                                            className="flex items-center gap-2"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="w-4 h-4"
                                                            >
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                                <circle cx="9" cy="7" r="4"></circle>
                                                                <path d="m19 8 2 2-2 2"></path>
                                                                <path d="m17 12h6"></path>
                                                            </svg>
                                                            Mes Destinataires
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <Separator className="my-3" />
                                        <div className="mt-2">
                                            <LogoutButton />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <LoginButton className="w-full" />
                                        <RegisterButton className="w-full" />
                                    </div>
                                )}

                                <Separator className="my-4" />
                                <div className="flex items-center gap-2">
                                    <div>
                                        <span className="text-sm font-medium">Thème :</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    {mounted ? <CurrentThemeIcon size={16} /> : <Laptop size={16} />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {themeOptions.map((option) => {
                                                    const Icon = option.icon
                                                    const isSelected = theme === option.value
                                                    return (
                                                        <DropdownMenuItem
                                                            key={option.value}
                                                            onClick={() => setTheme(option.value)}
                                                            className={isSelected ? "bg-accent" : ""}
                                                        >
                                                            <Icon size={16} className="mr-2" />
                                                            {option.label}
                                                            {isSelected && <span className="ml-auto">✓</span>}
                                                        </DropdownMenuItem>
                                                    )
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">Couleur :</span>
                                        <ThemeColorSelector />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderNavbar
