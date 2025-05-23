"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Paintbrush } from "lucide-react";

type ThemeConfig = {
    name: string;
    color: string;
};

const themes: ThemeConfig[] = [
    { name: "gray", color: "#6b7280" },
    { name: "violet", color: "#7c3aed" },
    { name: "green", color: "#22c55e" },
    { name: "yellow", color: "#eab308" },
    { name: "orange", color: "#f97316" },
];

export default function ThemeColorSelector() {
    const [activeTheme, setActiveTheme] = useState("default");

    useEffect(() => {
        const saved = localStorage.getItem("color-theme") || "default";
        applyTheme(saved);
    }, []);

    const applyTheme = (name: string) => {
        const existing = document.getElementById("theme-style") as HTMLLinkElement;
        if (existing) existing.remove();

        const link = document.createElement("link");
        link.id = "theme-style";
        link.rel = "stylesheet";
        link.href = `/themes/${name}.css`;
        document.head.appendChild(link);

        localStorage.setItem("color-theme", name);
        setActiveTheme(name);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Paintbrush className="w-4 h-4" />
                    Couleur
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themes.map((theme) => (
                    <DropdownMenuItem
                        key={theme.name}
                        onClick={() => applyTheme(theme.name)}
                        className="flex items-center gap-2"
                    >
                        <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.color }}
                        />
                        <span className="capitalize">{theme.name}</span>
                        {theme.name === activeTheme && (
                            <span className="ml-auto text-xs text-muted-foreground">(actif)</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
