
// path: src/components/navigations/header/LogoutButton.tsx

"use client";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {DOMAIN} from "@/utils/constants";


const LogoutButton = () => {
    const router = useRouter();

    const logoutHandler = async () => {
        try {
            // Utilisation de fetch au lieu axios pour envoyer la requête
            const response = await fetch(`${DOMAIN}/api/v1/users/logout`, {
                method: 'GET',
                credentials: 'include', // Cela permet d'envoyer les cookies avec la requête
            });

            if (response.ok) {
                // Si la déconnexion est réussie, on supprime les données locales
                localStorage.removeItem("simulationResults");
                router.push("/"); // Redirection vers la page d'accueil
                router.refresh(); // Rafraîchir la page
            } else {
                throw new Error('Failed to logout');
            }

        } catch (error) {
            toast.warning("Something went wrong"); // Message d'erreur
            console.log(error); // Loguer l'erreur dans la console
        }
    }

    return (
        <button onClick={logoutHandler} className="bg-gray-700 text-gray-200 p-2 rounded">
            Se déconnecter
        </button>
    );
}

export default LogoutButton;