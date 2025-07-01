// path: src/components/client-specific/profile/ProfileSideMenu.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, CalendarClock, Bell, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// 👇️ Add `iconOnly` prop here
interface ProfileSideMenuProps {
    iconOnly?: boolean;
}

const menuItems = [
    { label: "Mon Profil", href: "/client/profile", icon: User },
    { label: "Paramètres", href: "/client/profile/settings", icon: Settings },
    { label: "Mes Rendez-vous", href: "/client/profile/appointments", icon: CalendarClock },
    { label: "Mes Envois", href: "/client/profile/deliveries", icon: PackagePlus },
    { label: "Notifications", href: "/client/profile/notifications", icon: Bell },
];

export default function ProfileSideMenu({ iconOnly = false }: ProfileSideMenuProps) {
    const pathname = usePathname();

    return (
        <div className={cn("h-full", iconOnly && "w-16")}>
            <ScrollArea className="h-full">
                {!iconOnly && (
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold">Espace Client</h2>
                    </div>
                )}
                <nav className={cn("p-4 space-y-1", iconOnly && "p-2")}>
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <React.Fragment key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                                        iconOnly && "justify-center"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {!iconOnly && <span>{item.label}</span>}
                                </Link>
                                {!iconOnly && index === 0 && <Separator className="my-2" />}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </ScrollArea>
        </div>
    );
}
