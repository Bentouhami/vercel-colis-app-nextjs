import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LogInIcon} from "lucide-react";

const LoginButton = () => {
    return (
        <Link href="/client/auth/login">
            <Button variant={"login"}  className={"w-full hover:bg-gray-700 hover:text-gray-200"}>
                <LogInIcon className="mr-2 h-4 w-4"/>
                Se connecter
            </Button>
        </Link>
    )
}
export default LoginButton
