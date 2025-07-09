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
            roleAllowed: [RoleDto.SUPER_ADMIN, RoleDto.AGENCY_ADMIN, RoleDto.ACCOUNTANT],
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
        await signOut({ redirectTo: "/client/auth/login" })
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
            {/* Mobile Navbar */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-background z-50 border-b px-4 py-3 flex items-center justify-between backdrop-blur-lg bg-opacity-90">
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="hover:bg-secondary">
                    <Menu size={20} />
                </Button>
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Colis App Gestion
                        </h1>
                    </Link>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Bell size={20} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem>
                            <span>New notification</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Desktop Sidebar */}
            <div
                className={cn(
                    "fixed md:relative z-40 h-screen border-r bg-background/60 backdrop-blur-xl",
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-72",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    "flex flex-col",
                )}
            >
                {/* Sidebar Header */}
                <div className="p-6 flex justify-between items-center border-b">
                    <div
                        className={cn(
                            "flex items-center space-x-3 transition-all duration-300",
                            isCollapsed && "opacity-0 w-0 hidden",
                        )}
                    >
                        <Link href="/">
                            <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Colis App Gestion
                            </h1>
                        </Link>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex hover:bg-secondary">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>

                {/* User Profile Section */}
                <div className={cn("p-6 border-b", isCollapsed ? "flex justify-center" : "")}>
                    {session ? (
                        <div className={cn("flex items-center space-x-4", isCollapsed && "flex-col space-x-0 space-y-2")}>
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={session.user.image || undefined} />
                                <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold">{session.user.name || "User"}</h2>
                                    <p className="text-xs text-muted-foreground">{session.user.email?.toLowerCase()}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {getRoleDisplayName(session.user.role as RoleDto)}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn("flex items-center space-x-4", isCollapsed && "flex-col space-x-0 space-y-2")}>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                                <LogIn size={20} className="text-primary" />
                            </div>
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold">Welcome!</h2>
                                    <p className="text-xs text-muted-foreground">Please log in to continue.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                {session?.user?.role && (
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
                        {finalMenuItems.map((item) => {
                            const Icon = item.icon
                            const isActive = item.path === "/admin" ? pathname === item.path : pathname.startsWith(item.path)

                            return (
                                <Link key={item.name} href={item.path} onClick={toggleMobileSidebar}>
                                    <Button
                                        variant={isActive ? "active_primary" : "ghost"}
                                        className={cn(
                                            "w-full group relative",
                                            isCollapsed ? "justify-center" : "justify-start",
                                            "transition-all duration-200",
                                            isActive && "font-semibold",
                                        )}
                                    >
                                        <Icon
                                            size={20}
                                            className={cn(
                                                "transition-transform duration-200",
                                                isActive ? "" : "text-muted-foreground",
                                                "group-hover:scale-110",
                                            )}
                                        />
                                        {!isCollapsed && <span className="ml-3">{item.name}</span>}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                )}

                {/* Theme Toggle & Logout */}
                <div className="p-4 border-t space-y-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn("w-full", isCollapsed ? "justify-center" : "justify-start")}>
                                {theme === "dark" ? <Moon size={20} /> : theme === "light" ? <Sun size={20} /> : <Laptop size={20} />}
                                {!isCollapsed && <span className="ml-3">Theme</span>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isCollapsed ? "center" : "start"}>
                            {themeOptions.map((option) => {
                                const Icon = option.icon
                                return (
                                    <DropdownMenuItem
                                        key={option.value}
                                        onClick={() => setTheme(option.value)}
                                        className="cursor-pointer"
                                    >
                                        <Icon size={16} className="mr-2" />
                                        <span>{option.label}</span>
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div>
                        <ThemeColorSelector />
                    </div>

                    {session ? (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full hover:bg-destructive/10 hover:text-destructive",
                                isCollapsed ? "justify-center" : "justify-start",
                            )}
                            onClick={handleSignOut}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span className="ml-3">Logout</span>}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full hover:bg-primary/10 hover:text-primary",
                                isCollapsed ? "justify-center" : "justify-start",
                            )}
                            onClick={() => router.push("/client/auth/login")}
                        >
                            <LogIn size={20} />
                            {!isCollapsed && <span className="ml-3">Log in</span>}
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden" onClick={toggleMobileSidebar} />
            )}
        </div>
    )
}

export default Sidebar
