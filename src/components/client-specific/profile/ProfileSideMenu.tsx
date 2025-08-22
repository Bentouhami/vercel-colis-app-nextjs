// src/components/client-specific/profile/ProfileSideMenu.tsx

"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Settings, CalendarClock, Bell, PackagePlus, CreditCard, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface ProfileSideMenuProps {
    iconOnly?: boolean
    onNavigate?: () => void // For mobile menu closing
}

const menuItems = [
    {
        label: "Mon Profil",
        href: "/client/profile",
        icon: User,
        description: "Informations personnelles",
    },
    {
        label: "Mes Destinataires",
        href: "/client/profile/mes-destinataires",
        icon: MapPin,
        description: "Gérer mes destinataires",
        badge: "Nouveau",
    },
    {
        label: "Mes Envois",
        href: "/client/profile/deliveries",
        icon: PackagePlus,
        description: "Historique des envois",
        badge: "Nouveau",
    },
    {
        label: "Mes Rendez-vous",
        href: "/client/profile/appointments",
        icon: CalendarClock,
        description: "Rendez-vous programmés",
    },
    {
        label: "Paiements",
        href: "/client/profile/payments",
        icon: CreditCard,
        description: "Historique des paiements",
    },
    {
        label: "Notifications",
        href: "/client/profile/notifications",
        icon: Bell,
        description: "Préférences de notification",
    },
    {
        label: "Paramètres",
        href: "/client/profile/settings",
        icon: Settings,
        description: "Paramètres du compte",
    },
]

export default function ProfileSideMenu({ iconOnly = false, onNavigate }: ProfileSideMenuProps) {
    const pathname = usePathname()

    const handleNavigation = () => {
        if (onNavigate) {
            onNavigate()
        }
    }

    return (
        <div className={cn("h-full", iconOnly && "w-16")}>
            <ScrollArea className="h-full">
                {!iconOnly && (
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-primary">Espace Client</h2>
                        <p className="text-sm text-muted-foreground mt-1">Gérez votre compte</p>
                    </div>
                )}

                <nav className={cn("p-4 space-y-1", iconOnly && "p-2")}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <React.Fragment key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={handleNavigation}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground group relative",
                                        isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                                        iconOnly && "justify-center px-2",
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />

                                    {!iconOnly && (
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="truncate">{item.label}</span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="ml-2 text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                                        </div>
                                    )}

                                    {/* Tooltip for icon-only mode */}
                                    {iconOnly && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>

                                {/* Separator after profile section */}
                                {!iconOnly && index === 1 && <Separator className="my-2" />}
                                {!iconOnly && index === 4 && <Separator className="my-2" />}
                            </React.Fragment>
                        )
                    })}
                </nav>
            </ScrollArea>
        </div>
    )
}
