// path: src/components/client-specific/profile/ProfileSideMenu.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, CalendarClock, Bell, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const menuItems = [
    { label: "Mon Profil", href: "/client/profile", icon: <User className="mr-2 h-4 w-4" /> },
    { label: "Paramètres", href: "/client/profile/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
    { label: "Mes Rendez-vous", href: "/client/profile/appointments", icon: <CalendarClock className="mr-2 h-4 w-4" /> },
    { label: "Mes Envois", href: "/client/profile/deliveries", icon: <PackagePlus className="mr-2 h-4 w-4" /> },
    { label: "Notifications", href: "/client/profile/notifications", icon: <Bell className="mr-2 h-4 w-4" /> },
];

export default function ProfileSideMenu() {
    const pathname = usePathname();

    return (
        <div className="h-full">
            {/* Sidebar Menu (for mobile and desktop) */}
            <ScrollArea className="h-full">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Espace Client</h2>
                </div>
                <nav className="p-4 space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <React.Fragment key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                        isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                                {index === 0 && <Separator className="my-2" />}
                            </React.Fragment>
                        );
                    })}
                </nav>
            </ScrollArea>
        </div>
    );
}
