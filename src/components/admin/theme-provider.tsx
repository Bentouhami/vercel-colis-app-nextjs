"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type CustomThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
