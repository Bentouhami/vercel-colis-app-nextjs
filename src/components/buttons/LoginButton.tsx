"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

interface LoginButtonProps {
    className?: string
}

export default function LoginButton({ className }: LoginButtonProps) {
    return (
        <Button asChild variant="outline" className={className}>
            <Link href="/auth/login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Se connecter
            </Link>
        </Button>
    )
}
