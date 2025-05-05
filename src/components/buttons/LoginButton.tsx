// components/buttons/LoginButton.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import { cn } from "@/lib/utils";          // shadcn helper for class merge

type LoginButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

const LoginButton: React.FC<LoginButtonProps> = ({ className, ...props }) => (
    <Link href="/client/auth/login" className="w-full sm:w-auto">
        <Button
            {...props}
            className={cn("w-full hover:bg-gray-700 hover:text-gray-200", className)}
        >
            <LogInIcon className="mr-2 h-4 w-4" />
            Se connecter
        </Button>
    </Link>
);

export default LoginButton;
