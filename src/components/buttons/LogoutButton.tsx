"use client";

import {signOut} from "next-auth/react";
import {toast} from "react-toastify";
import {DOMAIN} from "@/utils/constants";
import {deleteSimulationCookie} from "@/services/frontend-services/simulation/SimulationService";
import {Button} from "@/components/ui/button";
import {LogOutIcon} from "lucide-react";

const LogoutButton = () => {
    const logoutHandler = async () => {
        try {
            await deleteSimulationCookie();
            // Sign out using NextAuth.js
            await signOut({redirectTo: `${DOMAIN}/`});

        } catch (error) {
            toast.warning("Something went wrong during logout");
            console.error("Logout error:", error);
        }
    };

    return (
        <Button variant={"destructive"} onClick={logoutHandler}>
           <LogOutIcon className="mr-2 h-4 w-4"/>
            Se déconnecter
        </Button>
    );
};

export default LogoutButton;