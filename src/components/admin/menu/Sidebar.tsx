// path: src/components/admin/menu/Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Laptop,
    LogIn,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { DOMAIN } from '@/utils/constants';
import { RoleDto } from '@/services/dtos';

type MenuItem = {
    name: string;
    path: string;
    icon: any;
    roleAllowed: RoleDto;
};

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { data: session } = useSession();
    const router = useRouter();

    const menuItems: MenuItem[] = [
        {
            name: 'Dashboard',
            icon: Home,
            path: '/admin',
            roleAllowed:
                RoleDto.SUPER_ADMIN || RoleDto.AGENCY_ADMIN || RoleDto.ACCOUNTANT || RoleDto.CLIENT,
        },
        {
            name: 'Agencies',
            icon: FileText,
            path: '/admin/agencies',
            roleAllowed: RoleDto.SUPER_ADMIN || RoleDto.AGENCY_ADMIN,
        },
        {
            name: 'Envois',
            icon: FileText,
            path: '/admin/envois',
            roleAllowed: RoleDto.SUPER_ADMIN || RoleDto.AGENCY_ADMIN || RoleDto.ACCOUNTANT,
        },
        {
            name: 'Utilisateurs',
            icon: Users,
            path: '/admin/users',
            roleAllowed: RoleDto.SUPER_ADMIN || RoleDto.AGENCY_ADMIN,
        },
        {
            name: 'Paramètres',
            icon: Settings,
            path: '/admin/settings',
            roleAllowed: RoleDto.SUPER_ADMIN,
        },
    ];

    // Determine user roles for filtering the menu items
    const isSuperAdmin = session?.user?.role === RoleDto.SUPER_ADMIN;
    const isAgencyAdmin = session?.user?.role === RoleDto.AGENCY_ADMIN;
    const isAccountant = session?.user?.role === RoleDto.ACCOUNTANT;

    const finalMenuItems =
        isSuperAdmin || isAgencyAdmin || isAccountant
            ? menuItems
            : menuItems.filter((item) => {
                if (!item.roleAllowed) return true;
                return session?.user?.role === item.roleAllowed;
            });

    // Set mounted to true once on mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update body overflow only when isMobileOpen changes
    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileOpen]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsCollapsed((prev) => !prev);
    const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);

    const themeOptions = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Laptop, label: 'System' },
    ];

    if (!mounted) return null;

    return (
        <div>
            {/* Mobile Navbar */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-background z-50 border-b px-4 py-3 flex items-center justify-between backdrop-blur-lg bg-opacity-90">
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar} className="hover:bg-secondary">
                    <Menu size={20} />
                </Button>
                <div className="flex items-center space-x-4">
                    <Link href={`/`}>
                        <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Gest Fac
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
                    'fixed md:relative z-40 h-screen border-r bg-background/60 backdrop-blur-xl',
                    'transition-all duration-300 ease-in-out',
                    isCollapsed ? 'w-20' : 'w-72',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                    'flex flex-col'
                )}
            >
                {/* Sidebar Header */}
                <div className="p-6 flex justify-between items-center border-b">
                    <div className={cn("flex items-center space-x-3 transition-all duration-300", isCollapsed && "opacity-0 w-0 hidden")}>
                        <Link href={`/`}>
                            <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Gest Fac
                            </h1>
                        </Link>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex hover:bg-secondary">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </Button>
                </div>

                {/* User Profile Section or Login Prompt */}
                <div className={cn("p-6 border-b", isCollapsed ? "flex justify-center" : "")}>
                    {session ? (
                        <div className={cn("flex items-center space-x-4", isCollapsed && "flex-col space-x-0 space-y-2")}>
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={session?.user?.image || undefined} />
                                <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="space-y-1">
                                    <h2 className="text-sm font-semibold">{session?.user?.name || 'User'}</h2>
                                    <p className="text-xs text-muted-foreground">{session?.user?.email?.toLowerCase()}</p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {session?.user?.role === RoleDto.SUPER_ADMIN
                                            ? 'Super Admin'
                                            : session?.user?.role === RoleDto.AGENCY_ADMIN
                                                ? 'Agency Admin'
                                                : session?.user?.role === RoleDto.ACCOUNTANT
                                                    ? 'Accountant'
                                                    : "Role not defined!"}
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

                {/* Navigation Links (Only show if logged in) */}
                {session && (
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
                        {finalMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.path);

                            return (
                                <Link key={item.name} href={item.path} onClick={toggleMobileSidebar}>
                                    <Button
                                        variant={isActive ? 'active_primary' : 'ghost'}
                                        className={cn(
                                            'w-full group relative',
                                            isCollapsed ? 'justify-center' : 'justify-start',
                                            'hover:bg-secondary transition-all duration-200',
                                            isActive && 'font-semibold'
                                        )}
                                    >
                                        <Icon
                                            size={20}
                                            className={cn('transition-transform duration-200', isActive ? '' : 'text-muted-foreground', 'group-hover:scale-110')}
                                        />
                                        {!isCollapsed && <span className="ml-3">{item.name}</span>}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                )}

                {/* Theme Toggle & Logout/Login */}
                <div className="p-4 border-t space-y-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn('w-full', isCollapsed ? 'justify-center' : 'justify-start')}>
                                {theme === 'dark' ? <Moon size={20} /> : theme === 'light' ? <Sun size={20} /> : <Laptop size={20} />}
                                {!isCollapsed && <span className="ml-3">Theme</span>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={isCollapsed ? 'center' : 'start'}>
                            {themeOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)} className="cursor-pointer">
                                        <Icon size={16} className="mr-2" />
                                        <span>{option.label}</span>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {session ? (
                        <Button
                            variant="ghost"
                            className={cn('w-full hover:bg-destructive/10 hover:text-destructive', isCollapsed ? 'justify-center' : 'justify-start')}
                            onClick={() => signOut({ redirectTo: '/' })}
                        >
                            <LogOut size={20} />
                            {!isCollapsed && <span className="ml-3">Logout</span>}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className={cn('w-full hover:bg-primary/10 hover:text-primary', isCollapsed ? 'justify-center' : 'justify-start')}
                            onClick={() => router.push(`${DOMAIN}/auth`)}
                        >
                            <LogIn size={20} />
                            {!isCollapsed && <span className="ml-3">Log in</span>}
                        </Button>
                    )}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}
        </div>
    );
};

export default Sidebar;

