"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Bell,
    Building,
    PieChartIcon as ChartPie,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Laptop,
    LogIn,
    LogOut,
    Menu,
    Moon,
    Package,
    SaveAllIcon,
    Settings,
    Sun,
    Users,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { RoleDto } from "@/services/dtos"
import { FaUsers } from "react-icons/fa6"
import ThemeColorSelector from "@/components/theme/ThemeColorSelector"
import type { Session } from "next-auth"
import { isAdminRole } from "@/lib/auth-utils"

type MenuItem = {
    name: string
    path: string
    icon: any
    roleAllowed: RoleDto[]
}

interface SidebarProps {
    session: Session | null
}

const Sidebar = ({ session }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    const menuItems: MenuItem[] = [
        {
            name: "Dashboard",
            icon: Home,
            path: "/admin",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT],
        },
        {
            name: "Mes Agences",
            icon: Building,
            path: "/admin/agencies",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN],
        },
        {
            name: "Envois",
            icon: Package,
            path: "/admin/envois",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN],
        },
        {
            name: "Utilisateurs",
            icon: Users,
            path: "/admin/users",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN],
        },
        {
            name: "Paramètres",
            icon: Settings,
            path: "/admin/settings",
            roleAllowed: [RoleDto.SUPER_ADMIN],
        },
        {
            name: "Statistiques",
            icon: ChartPie,
            path: "/admin/stats",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT],
        },
        {
            name: "Rapports",
            icon: FileText,
            path: "/admin/reports",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT],
        },
        {
            name: "Exporter",
            icon: SaveAllIcon,
            path: "/admin/export",
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT],
        },
        {
            name: "Administrateurs des Agences",
            icon: FaUsers,
            path: "/admin/agency-admins",
            roleAllowed: [RoleDto.SUPER_ADMIN],
        },
    ]

    // Filter menu items based on user role
    const finalMenuItems = session?.user?.role
        ? menuItems.filter((item) => {
            if (!item.roleAllowed) return true
            return item.roleAllowed.includes(session.user.role as RoleDto)
        })
        : []

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isMobileOpen])

    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const toggleSidebar = () => setIsCollapsed((prev) => !prev)
    const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev)

    const themeOptions = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Laptop, label: "System" },
    ]

    const handleSignOut = async () => {
        await signOut({ redirectTo: "/auth/login" })
    }

    const getRoleDisplayName = (role: RoleDto) => {
        switch (role) {
            case RoleDto.SUPER_ADMIN:
                return "Super Admin"
            case RoleDto.AGENCY_ADMIN:
                return "Agency Admin"
            case RoleDto.ACCOUNTANT:
                return "Accountant"
            default:
                return "Role not defined!"
        }
    }

    if (!mounted) return null

    // Don't render sidebar if user doesn't have admin access
    if (!session?.user?.role || !isAdminRole(session.user.role as RoleDto)) {
        return null
    }

    return (
        <div>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-background/95 backdrop-blur-lg z-50 border-b shadow-sm">
                <div className="px-4 py-3 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMobileSidebar}
                        className="hover:bg-secondary transition-colors duration-200"
                    >
                        <Menu size={20} />
                    </Button>

                    <Link href="/admin" className="animate-in zoom-in duration-300">
                        <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            ColisApp Admin
                        </h1>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuItem>
                                <span>Nouvelle notification</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Desktop/Mobile Sidebar */}
            <div
                className={cn(
                    "fixed lg:relative z-40 h-screen border-r bg-background/95 backdrop-blur-xl shadow-xl lg:shadow-none",
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-72",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    "flex flex-col",
                )}
            >
                {/* Sidebar Header */}
                <div className="p-6 flex justify-between items-center border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <div
                        className={cn(
                            "flex items-center space-x-3 transition-all duration-300",
                            isCollapsed && "opacity-0 w-0 hidden",
                        )}
                    >
                        <Link href="/admin" className="animate-in zoom-in duration-300">
                            <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                ColisApp Admin
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="hidden lg:flex hover:bg-secondary transition-all duration-200 hover:scale-110"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMobileSidebar}
                            className="lg:hidden hover:bg-secondary transition-all duration-200"
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>

                {/* User Profile Section */}
                <div
                    className={cn(
                        "p-6 border-b bg-gradient-to-r from-secondary/20 to-secondary/10",
                        isCollapsed ? "flex justify-center" : "",
                    )}
                >
                    {session ? (
                        <div
                            className={cn(
                                "flex items-center space-x-4 animate-in slide-in-from-left-4 duration-500",
                                isCollapsed && "flex-col space-x-0 space-y-2",
                            )}
                        >
                            <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg transition-all duration-300 hover:scale-110">
                                <AvatarImage src={session.user.image || undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white font-bold">
                                    {session.user.name?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold text-foreground">{session.user.name || "User"}</h2>
                                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                        {session.user.email?.toLowerCase()}
                                    </p>
                                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {getRoleDisplayName(session.user.role as RoleDto)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn("flex items-center space-x-4", isCollapsed && "flex-col space-x-0 space-y-2")}>
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
                                <LogIn size={20} className="text-primary" />
                            </div>
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold">Bienvenue!</h2>
                                    <p className="text-xs text-muted-foreground">Veuillez vous connecter.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                {session?.user?.role && (
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        {finalMenuItems.map((item, index) => {
                            const Icon = item.icon
                            const isActive = item.path === "/admin" ? pathname === item.path : pathname.startsWith(item.path)
                            return (
                                <div
                                    key={item.name}
                                    className="animate-in slide-in-from-left-4 duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <Link href={item.path} onClick={toggleMobileSidebar}>
                                        <Button
                                            variant={isActive ? "default" : "ghost"}
                                            className={cn(
                                                "w-full group relative transition-all duration-300",
                                                isCollapsed ? "justify-center px-2" : "justify-start px-4",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                    : "hover:bg-secondary/80 hover:scale-105 hover:shadow-md",
                                                "mb-1",
                                            )}
                                        >
                                            <Icon
                                                size={20}
                                                className={cn(
                                                    "transition-all duration-300",
                                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                                                    "group-hover:scale-110",
                                                )}
                                            />
                                            {!isCollapsed && (
                                                <span className="ml-3 font-medium transition-all duration-300">{item.name}</span>
                                            )}
                                            {isActive && !isCollapsed && (
                                                <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                                            )}
                                        </Button>
                                    </Link>
                                </div>
                            )
                        })}
                    </nav>
                )}

                {/* Theme Toggle & Settings */}
                <div className="p-4 border-t space-y-3 bg-gradient-to-r from-secondary/10 to-secondary/5">
                    {/* Theme Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full transition-all duration-300 hover:bg-secondary/80 hover:scale-105",
                                    isCollapsed ? "justify-center px-2" : "justify-start px-4",
                                )}
                            >
                                <div className="flex items-center">
                                    {theme === "dark" ? <Moon size={20} /> : theme === "light" ? <Sun size={20} /> : <Laptop size={20} />}
                                    {!isCollapsed && <span className="ml-3 font-medium">Thème</span>}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isCollapsed ? "center" : "start"} className="w-48">
                            {themeOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className="cursor-pointer transition-colors duration-200"
                                    >
                                        <Icon size={16} className="mr-2" />
                                        <span>{option.label}</span>
                                        {theme === option.value && <div className="ml-auto w-2 h-2 bg-primary rounded-full" />}
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Color Theme Selector */}
                    {!isCollapsed && (
                        <div className="animate-in fade-in duration-300">
                            <ThemeColorSelector />
                        </div>
                    )}

                    {/* Logout Button */}
                    {session ? (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105",
                                isCollapsed ? "justify-center px-2" : "justify-start px-4",
                            )}
                            onClick={handleSignOut}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span className="ml-3 font-medium">Déconnexion</span>}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105",
                                isCollapsed ? "justify-center px-2" : "justify-start px-4",
                            )}
                            onClick={() => router.push("/auth/login")}
                        >
                            <LogIn size={20} />
                            {!isCollapsed && <span className="ml-3 font-medium">Connexion</span>}
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
                    onClick={toggleMobileSidebar}
                />
            )}
        </div>
    )
}

export default Sidebar
