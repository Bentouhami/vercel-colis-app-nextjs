"use client"
import { signOut } from "next-auth/react"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function UserMenu() {
    const { user, isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated || !user) {
        return (
            <Button asChild variant="outline">
                <Link href="/client/auth/login">Se connecter</Link>
            </Button>
        )
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/client/auth/login" })
    }

    const getInitials = () => {
        if (user.firstName && user.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        }
        if (user.name) {
            return user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
        }
        return user.email?.[0]?.toUpperCase() || "U"
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || "Utilisateur"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin/profile" : "/client/profile"}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin/settings" : "/client/settings"}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Paramètres</span>
                    </Link>
                </DropdownMenuItem>

                {isAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>Administration</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/users">
                                <Users className="mr-2 h-4 w-4" />
                                <span>Gestion des utilisateurs</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
