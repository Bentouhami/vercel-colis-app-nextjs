// components/buttons/RegisterButton.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type RegisterButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

const RegisterButton: React.FC<RegisterButtonProps> = ({
                                                           className,
                                                           variant = "default",
                                                           ...props
                                                       }) => (
    <Link href="/client/auth/register" className="w-full sm:w-auto">
        <Button
            {...props}
            variant={variant}
            className={cn("w-full hover:bg-gray-700 hover:text-gray-200", className)}
        >
            <UserPlus className="mr-2 h-4 w-4" />
            Inscription
        </Button>
    </Link>
);

export default RegisterButton;
