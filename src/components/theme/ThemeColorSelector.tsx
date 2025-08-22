"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Paintbrush, Check } from "lucide-react"

type ThemeConfig = {
    name: string
    color: string
    label: string
}

const themes: ThemeConfig[] = [
    { name: "default", color: "#3b82f6", label: "Bleu" },
    { name: "gray", color: "#6b7280", label: "Gris" },
    { name: "violet", color: "#7c3aed", label: "Violet" },
    { name: "green", color: "#22c55e", label: "Vert" },
    { name: "yellow", color: "#eab308", label: "Jaune" },
    { name: "orange", color: "#f97316", label: "Orange" },
    { name: "red", color: "#ef4444", label: "Rouge" },
    { name: "pink", color: "#ec4899", label: "Rose" },
]

export default function ThemeColorSelector() {
    const [activeTheme, setActiveTheme] = useState("default")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem("color-theme") || "default"
        applyTheme(saved)
    }, [])

    const applyTheme = (name: string) => {
        // Remove existing theme
        const existing = document.getElementById("theme-style") as HTMLLinkElement
        if (existing) existing.remove()

        // Apply new theme if not default
        if (name !== "default") {
            const link = document.createElement("link")
            link.id = "theme-style"
            link.rel = "stylesheet"
            link.href = `/themes/${name}.css`
            document.head.appendChild(link)
        }

        localStorage.setItem("color-theme", name)
        setActiveTheme(name)
    }

    if (!mounted) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 transition-all duration-300 hover:bg-secondary/80 hover:scale-105"
                >
                    <Paintbrush className="w-4 h-4" />
                    <span>Couleur</span>
                    <div
                        className="ml-auto w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: themes.find((t) => t.name === activeTheme)?.color }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
                <div className="p-2">
                    <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Choisir une couleur</div>
                    <div className="grid grid-cols-4 gap-2">
                        {themes.map((theme) => (
                            <button
                                key={theme.name}
                                onClick={() => applyTheme(theme.name)}
                                className={`
                                    relative w-8 h-8 rounded-full border-2 transition-all duration-200
                                    hover:scale-110 hover:shadow-lg
                                    ${theme.name === activeTheme
                                        ? "border-white shadow-lg scale-110"
                                        : "border-gray-300 dark:border-gray-600"
                                    }
                                `}
                                style={{ backgroundColor: theme.color }}
                                title={theme.label}
                            >
                                {theme.name === activeTheme && (
                                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto animate-in zoom-in duration-200" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
