"use client";

import {signOut} from "next-auth/react";
import {toast} from "react-toastify";
import {DOMAIN} from "@/utils/constants";
import {deleteSimulationCookie} from "@/services/frontend-services/simulation/SimulationService";

const LogoutButton = () => {
    const logoutHandler = async () => {
        try {
            await deleteSimulationCookie();
            // Sign out using NextAuth.js
            await signOut({redirectTo: `${DOMAIN}/`}); // Redirect to home after logout

            // // Call API to clear simulationResponse cookie
            // const response = await fetch("/api/v1/users/logout", {method: "GET"});
            // if (!response.ok) throw new Error("Failed to clear simulationResponse cookie");

        } catch (error) {
            toast.warning("Something went wrong during logout");
            console.error("Logout error:", error);
        }
    };

    return (
        <button onClick={logoutHandler} className="bg-gray-700 text-gray-200 p-2 rounded">
            Se déconnecter
        </button>
    );
};

export default LogoutButton;