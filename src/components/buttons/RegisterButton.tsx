import React from 'react'
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LogInIcon, UserPlus} from "lucide-react";

const RegisterButton = () => {
    return (
        <Link href="/client/auth/register">
            <Button variant={"default"} className={"w-full hover:bg-gray-700 hover:text-gray-200"}>
                <UserPlus className="mr-2 h-4 w-4"/>
                Inscription
            </Button>
        </Link>
    )
}
export default RegisterButton
